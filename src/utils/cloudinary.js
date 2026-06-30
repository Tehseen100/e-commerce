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
        // console.log("file is uploaded on cloudinary ", response.url);

        // Delete the file from local storage after uploading to Cloudinary
        fs.unlinkSync(filePath);
        return response.secure_url;
    } catch (error) {
        console.log("Cloudinary upload failed", error);
        fs.unlinkSync(filePath);
        return null;
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

export { uploadOnCloudinary, deleteFromCloudinary }