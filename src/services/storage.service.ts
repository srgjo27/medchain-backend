import crypto from "crypto";
import path from "path";
import { supabase } from "../config/supabase.js";

export const storageService = {
  async uploadFile(
    fileBuffer: Buffer,
    originalName: string,
    bucketName: string
  ): Promise<string> {
    const fileExt = path.extname(originalName);
    const uniqueId = crypto.randomUUID();
    const fileName = `${uniqueId}${fileExt}`;
    const filePath = `${fileName}`;

    const { error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, fileBuffer, {
        contentType: getMimeType(fileExt),
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(`Gagal mengunggah file ke Supabase Storage: ${error.message}`);
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    return data.publicUrl;
  },

  async deleteFile(fileUrl: string, bucketName: string): Promise<void> {
    try {
      // Extract file name/path from the public URL
      const urlParts = fileUrl.split(`/storage/v1/object/public/${bucketName}/`);
      if (urlParts.length < 2) return;
      const filePath = urlParts[1];
      if (!filePath) return;

      const { error } = await supabase.storage.from(bucketName).remove([filePath]);
      if (error) {
        console.error(`Gagal menghapus file dari storage: ${error.message}`);
      }
    } catch (err) {
      console.error("Error parsing file URL for deletion:", err);
    }
  },
};

const getMimeType = (ext: string): string => {
  switch (ext.toLowerCase()) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".pdf":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
};
