from fastapi import APIRouter, File, UploadFile, HTTPException
from app.db import collections
import logging
from app.utils import serialize_document
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
from datetime import datetime

router = APIRouter()

# Directory to temporarily store uploaded files
UPLOAD_DIR = "uploaded_files"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Models
class Document(BaseModel):
    filename: str
    content: str
    uploaded_at: datetime

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

        # Read content from the file (assuming it's text-based)
        with open(file_path, "r") as f:
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
    except Exception as e:
        logging.error(f"Error uploading file: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@router.get("/files/")
async def list_files():
    try:
        doc_collection = collections["documents"]
        files = doc_collection.find({}, {"_id": 1, "filename": 1}).sort("uploaded_at", -1)
        file_list = [{"id": str(file["_id"]), "filename": file["filename"]} for file in files]
        return {"files": file_list}
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
