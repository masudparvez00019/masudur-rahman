

import { v2 as cloudinary } from "cloudinary"

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * Upload an image to Cloudinary
 * @param fileBuffer - The file buffer to upload
 * @param folder - Optional folder name to organize uploads
 * @returns The URL of the uploaded image
 */
export async function uploadImage(fileBuffer: Buffer, folder = "portfolio"): Promise<string | null> {
  try {
    // Convert buffer to base64
    const base64String = `data:image/jpeg;base64,${fileBuffer.toString("base64")}`

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(base64String, {
      folder: folder,
      resource_type: "image",
    })

    return result.secure_url
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error)
    return null
  }
}

/**
 * Delete an image from Cloudinary
 * @param imageUrl - The URL of the image to delete
 * @returns Boolean indicating success or failure
 */
export async function deleteImage(imageUrl: string): Promise<boolean> {
  try {
    // Extract the public ID from the URL
    // URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.ext
    const urlParts = imageUrl.split("/")
    const filenameWithExtension = urlParts[urlParts.length - 1]
    const publicIdWithExtension = urlParts.slice(-2).join("/")
    const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf("."))

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId)

    return result.result === "ok"
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error)
    return false
  }
}


