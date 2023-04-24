import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import {genContentType} from "./modules";

dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

export class CloudinaryError extends Error {
    constructor(message: string) {
        console.warn(message)
        super(message);
    }
}

const uploadFile = async (file: string, type: string, folder = '') => {
    type = (!!type ? type : genContentType(type)) + 's'
    folder = 'e-learning/' + folder + '/' + type
    return await cloudinary.uploader.upload(file, {folder, overwrite: true, resource_type: "auto"})
}

interface UploadFileOptions {
    filePath: string,
    folder?: string
    fileType: string
}

const uploadFileToCloudinary = async ({ filePath, fileType, folder }: UploadFileOptions) => {
    if (!filePath) throw new CloudinaryError('File path must not be empty')
    const cloudinaryUploadResponse = await uploadFile(filePath, fileType, folder)
    const resolvedPath = path.resolve(filePath)
    fs.rm(resolvedPath, (err) => {
        if (err) return console.error('SILENT_FAILURE:: Failed to remove uploaded file')
        console.info('CLOUDINARY_UPLOADER:: Removed uploaded image file from disk')
    })
    return new CloudinaryUploadResponse(cloudinaryUploadResponse)
}

class CloudinaryUploadResponse {
    private readonly secure_url;
    private readonly type;
    private readonly format;
    private readonly originalFilename;
    constructor({ secure_url, type, format, original_filename }: UploadApiResponse) {
        this.secure_url = secure_url
        this.type = type
        this.format = format
        this.originalFilename = original_filename
    }

    getUploadResponse () {
        return {
            url: this.secure_url,
            type: this.type,
            format: this.format,
            originalFilename: this.originalFilename
        }
    }
}

export default uploadFileToCloudinary
