
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Supabase configuration
const SUPABASE_URL = 'https://bwbhoiykyolpcbjaxqmk.supabase.co';
// WARNING: Using service role key for admin tasks like uploading from script is better,
// but here we might need to use the anon key if we don't have the service key readily available
// or if the bucket policies allow public upload. 
// Assuming the user has provided the anon key in .env.local, but for this script we need to read it or hardcode it.
// Since we can't easily read .env.local in a standalone node script without dotenv, let's try to grab it from the user's environment or ask.
// For now, I will use the anon key I saw earlier in the conversation history.
const SUPABASE_KEY = 'sb_publishable__1qJC58dAWEsS5_0VT3MOA_Uldpjd21'; 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BUCKET_NAME = 'videos';
const LOCAL_VIDEO_PATH = 'public/videos/place1.mp4';
const REMOTE_FILE_PATH = 'place1.mp4';

async function uploadFile() {
  try {
    console.log(`Reading file from ${LOCAL_VIDEO_PATH}...`);
    const fileContent = fs.readFileSync(LOCAL_VIDEO_PATH);

    console.log(`Uploading to bucket '${BUCKET_NAME}' as '${REMOTE_FILE_PATH}'...`);
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(REMOTE_FILE_PATH, fileContent, {
        contentType: 'video/mp4',
        upsert: true
      });

    if (error) {
      console.error('Error uploading file:', error);
      
      // If bucket doesn't exist, try to create it (requires higher privileges usually, but let's see)
      if (error.message.includes('Bucket not found')) {
         console.log('Bucket might not exist. Please create a public bucket named "videos" in your Supabase dashboard.');
      }
      return;
    }

    console.log('Upload successful!', data);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(REMOTE_FILE_PATH);

    console.log('\n---------------------------------------------------');
    console.log('🎉 Video Public URL:');
    console.log(urlData.publicUrl);
    console.log('---------------------------------------------------\n');
    console.log('You can now copy this URL and update your database.');

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

uploadFile();
