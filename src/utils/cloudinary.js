import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload Function
const uploadOnCloudinary = async (filePath) => {
    try {
        if (!filePath) return null;

        const response = await cloudinary.uploader.upload(filePath, {
            folder: "ecommerce",
            resource_type: "auto"
        });

        return response;
    } catch (error) {
        console.log("Cloudinary upload failed", error);
        return null;
    } finally {
        removeLocalFile(filePath);
    }
}

const deleteFromCloudinary = async (public_id, resource_type = "image") => {
    try {
        if (!public_id) return null;

        await cloudinary.uploader.destroy(public_id, { resource_type });
    } catch (error) {
        console.log("Cloudinary deletion failed", error);
        return null;
    }
}

// Removes a file from local disk
const removeLocalFile = (filePath) => {
    try {
        if (!filePath) return null;

        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (error) {
        console.log("Local file cleanup failed", error);
        return null;
    }
}

export { uploadOnCloudinary, deleteFromCloudinary, removeLocalFile }