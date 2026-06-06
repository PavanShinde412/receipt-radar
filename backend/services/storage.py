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

async def upload_file(file) -> str:
    contents = await file.read()
    result = cloudinary.uploader.upload(
        contents,
        folder="receipt-radar",
        resource_type="auto"
    )
    return result["secure_url"]