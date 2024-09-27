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
        return new ApiError(500, "Error uploading file to Cloudinary");
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
        localFilePaths.forEach((filePath) => fs.unlinkSync(filePath));

        return new ApiError(
            500,
            "Error uploading product images to Cloudinary"
        );
    }
};

const deleteImagesFromCloudinary = async (publicIds) => {
    try {
        const deletionPromises = publicIds.map((public_id) => {
            return cloudinary.uploader.destroy(public_id);
        });

        const results = await Promise.all(deletionPromises);
    } catch (error) {
        return new ApiError(500, "Failed to delete images from Cloudinary");
    }
};

export {
    uploadToCloudinary,
    uploadProductImagesToCloudinary,
    deleteImagesFromCloudinary,
};
