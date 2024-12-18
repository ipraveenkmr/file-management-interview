from bson import ObjectId

def serialize_document(document):
    """Converts a MongoDB document into a JSON-serializable format."""
    return {
        **document,
        "_id": str(document["_id"]),  # Convert ObjectId to string
    }