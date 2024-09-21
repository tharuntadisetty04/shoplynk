import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
import { ApiError } from "./ApiError.js";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "shoplynk_avatars",
        });

        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        throw new ApiError(500, "Error uploading file to Cloudinary");
    }
};

const uploadProductImagesToCloudinary = async (localFilePaths) => {
    try {
        if (!localFilePaths || localFilePaths.length === 0) return null;

        const uploadPromises = localFilePaths.map(async (filePath) => {
            const response = await cloudinary.uploader.upload(filePath, {
                resource_type: "auto",
                folder: "shoplynk_products",
            });

            fs.unlinkSync(filePath);
            return response;
        });

        const uploadResults = await Promise.all(uploadPromises);
        return uploadResults;
    } catch (error) {
        localFilePaths.forEach(filePath => fs.unlinkSync(filePath));
        throw new ApiError(500, "Error uploading product images to Cloudinary");
    }
};

export { uploadToCloudinary, uploadProductImagesToCloudinary };