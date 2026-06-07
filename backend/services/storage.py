import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
import os

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

async def upload_file_from_bytes(contents: bytes, filename: str) -> str:
    result = cloudinary.uploader.upload(
        contents,
        folder="receipt-radar",
        resource_type="auto",
        public_id=filename
    )
    return result["secure_url"]