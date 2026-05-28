
import { supabase } from './supabaseClient';

/**
 * Gets the public URL for a video stored in Supabase Storage.
 * @param bucketName The name of the storage bucket (e.g., 'videos')
 * @param filePath The path to the file within the bucket (e.g., 'spring/plowing.mp4')
 * @returns The public URL string
 */
export const getVideoUrl = (bucketName: string, filePath: string) => {
  const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
  return data.publicUrl;
};

/**
 * Uploads a video file to Supabase Storage.
 * @param bucketName The name of the storage bucket
 * @param file The file object to upload
 * @param path The destination path in the bucket
 */
export const uploadVideo = async (bucketName: string, file: File, path: string) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(path, file);

  if (error) {
    console.error('Error uploading video:', error);
    throw error;
  }

  return data;
};

/**
 * Lists all videos in a specific folder of a bucket.
 * @param bucketName The name of the storage bucket
 * @param folderPath The folder path to list (optional)
 */
export const listVideos = async (bucketName: string, folderPath: string = '') => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .list(folderPath);

  if (error) {
    console.error('Error listing videos:', error);
    throw error;
  }

  return data;
};
