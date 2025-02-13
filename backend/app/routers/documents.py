from fastapi import APIRouter, File, UploadFile, HTTPException, Query
from app.db import collections
import logging
from app.utils import serialize_document
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
from datetime import datetime
import traceback

router = APIRouter()

# Directory to temporarily store uploaded files
UPLOAD_DIR = "uploaded_files"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Models
class Document(BaseModel):
    filename: str
    content: str
    uploaded_at: datetime
    
class UpdateDocument(BaseModel):
    filename: str
    content: str

# Routes
@router.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Save file temporarily
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        if os.path.exists(file_path):
            raise HTTPException(status_code=400, detail="File already exists")

        with open(file_path, "wb") as f:
            f.write(await file.read())

        # Check if the file is text-based
        if not file.content_type.startswith("text/"):
            os.remove(file_path)
            raise HTTPException(status_code=400, detail="Only text-based files are supported")

        # Read content from the file (assuming it's text-based)
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Save to MongoDB
        doc_collection = collections["documents"]
        document = {
            "filename": file.filename,
            "content": content,
            "uploaded_at": datetime.utcnow()
        }
        result = doc_collection.insert_one(document)

        # Cleanup: Remove the temporary file
        os.remove(file_path)

        return {"message": "File uploaded successfully", "document_id": str(result.inserted_id)}
    except HTTPException as e:
        logging.error(f"HTTP Exception: {e.detail}")
        raise e
    except Exception as e:
        logging.error(f"Error uploading file: {e}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


# @router.get("/files/")
# async def list_files(isSorted: bool = Query(default=False)):
#     try:
        
#         doc_collection = collections["documents"]


#         if isSorted:
#             files = doc_collection.find({}, {"_id": 1, "filename": 1}).sort("uploaded_at", -1)
#         else:
#             files = doc_collection.find({}, {"_id": 1, "filename": 1})


#         # files = doc_collection.find({}, {"_id": 1, "filename": 1}).sort("uploaded_at", -1)
#         file_list = [{"id": str(file["_id"]), "filename": file["filename"]} for file in files]
#         return {"files": file_list}
#     except Exception as e:
#         logging.error(f"Error listing files: {e}")
#         raise HTTPException(status_code=500, detail="Internal Server Error")


from fastapi import APIRouter, Query, HTTPException
from pymongo import ASCENDING, DESCENDING
import logging

router = APIRouter()

@router.get("/files/")
async def list_files(
    isSorted: bool = Query(default=False),
    page: int = Query(default=1, ge=1)
):
    """
    List files with sorting and pagination.
    
    :param isSorted: Determines whether the files should be sorted by 'uploaded_at' in descending order.
    :param page: The page number for pagination, defaults to 1.
    """
    try:
        doc_collection = collections["documents"]
        items_per_page = 2
        skip = (page - 1) * items_per_page

        # Sort if isSorted is True, otherwise fetch without sorting
        if isSorted:
            files = doc_collection.find({}, {"_id": 1, "filename": 1}).sort("uploaded_at", DESCENDING).skip(skip).limit(items_per_page)
        else:
            files = doc_collection.find({}, {"_id": 1, "filename": 1}).skip(skip).limit(items_per_page)

        file_list = [{"id": str(file["_id"]), "filename": file["filename"]} for file in files]

        # Total files count for pagination info
        total_files = doc_collection.count_documents({})
        total_pages = (total_files + items_per_page - 1) // items_per_page

        return {
            "files": file_list,
            "total_files": total_files,
            "total_pages": total_pages,
            "current_page": page,
        }
    except Exception as e:
        logging.error(f"Error listing files: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/files/{filename}")
async def read_file(filename: str):
    try:
        doc_collection = collections["documents"]
        document = doc_collection.find_one({"filename": filename})
        if not document:
            raise HTTPException(status_code=404, detail="File not found")

        return serialize_document(document)
    except Exception as e:
        logging.error(f"Error reading file: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.delete("/files/{filename}")
async def delete_file(filename: str):
    try:
        doc_collection = collections["documents"]
        result = doc_collection.delete_one({"filename": filename})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="File not found")

        return {"message": f"{filename} deleted successfully"}
    except Exception as e:
        logging.error(f"Error deleting file: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
    
    
@router.put("/files/update")
async def update_file_content(updated_document: UpdateDocument):
    """
    Endpoint to update the content of an existing file.
    """
    try:
        doc_collection = collections["documents"]
        result = doc_collection.update_one(
            {"filename": updated_document.filename},
            {"$set": {"content": updated_document.content, "uploaded_at": datetime.utcnow()}}
        )

        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="File not found")

        return {"message": f"File '{updated_document.filename}' updated successfully"}
    except Exception as e:
        logging.error(f"Error updating file: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
