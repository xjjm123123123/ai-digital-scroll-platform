
import { supabase } from './supabaseClient';
import { Hotspot, Season, HotspotLevel } from '../../types';
import { HOTSPOTS } from '../../constants';

// Database interface matching the SQL table structure
interface DBHotspot {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  category: string;
  season: string;
  level: string;
  description: string;
  video_url?: string;
  original_image?: string;
  prompt?: string;
  versions?: any;
  annotations?: any;
  related_hotspot_ids?: string[];
  carousel_media?: string[];
}

// Convert DB format to Application format
const mapDBToHotspot = (dbHotspot: DBHotspot): Hotspot => ({
  id: dbHotspot.id,
  x: dbHotspot.x,
  y: dbHotspot.y,
  width: dbHotspot.width,
  height: dbHotspot.height,
  label: dbHotspot.label,
  category: dbHotspot.category,
  season: dbHotspot.season as Season,
  level: dbHotspot.level as HotspotLevel,
  description: dbHotspot.description,
  videoUrl: dbHotspot.video_url || '',
  originalImage: dbHotspot.original_image,
  prompt: dbHotspot.prompt || '',
  versions: dbHotspot.versions,
  annotations: dbHotspot.annotations,
  relatedHotspotIds: dbHotspot.related_hotspot_ids,
  carouselMedia: dbHotspot.carousel_media,
});

// Convert Application format to DB format
const mapHotspotToDB = (hotspot: Hotspot): DBHotspot => ({
  id: hotspot.id,
  x: hotspot.x,
  y: hotspot.y,
  width: hotspot.width,
  height: hotspot.height,
  label: hotspot.label,
  category: hotspot.category,
  season: hotspot.season,
  level: hotspot.level,
  description: hotspot.description,
  video_url: hotspot.videoUrl,
  original_image: hotspot.originalImage,
  prompt: hotspot.prompt,
  versions: hotspot.versions,
  annotations: hotspot.annotations,
  related_hotspot_ids: hotspot.relatedHotspotIds,
  carousel_media: hotspot.carouselMedia,
});

export const fetchHotspots = async (): Promise<Hotspot[]> => {
  const { data, error } = await supabase
    .from('hotspots')
    .select('*');

  if (error) {
    console.error('Error fetching hotspots:', error);
    // Fallback to local constants if DB fetch fails (e.g., table doesn't exist yet)
    console.warn('Falling back to local constant data');
    return HOTSPOTS;
  }

  if (!data || data.length === 0) {
    return [];
  }

  return data.map(mapDBToHotspot);
};

export const seedHotspots = async () => {
  console.log('Seeding hotspots...');
  
  // First check if data exists
  const { count, error: countError } = await supabase
    .from('hotspots')
    .select('*', { count: 'exact', head: true });

  if (countError && countError.code !== 'PGRST116') { // Ignore "result contains 0 rows" kind of errors if any
     console.error('Error checking existing hotspots:', countError);
     // Proceeding might be risky if table doesn't exist, but let's try
  }

  if (count && count > 0) {
    console.log(`Database already has ${count} hotspots. Skipping seed.`);
    return;
  }

  const dbHotspots = HOTSPOTS.map(mapHotspotToDB);

  const { data, error } = await supabase
    .from('hotspots')
    .upsert(dbHotspots);

  if (error) {
    console.error('Error seeding hotspots:', error);
    throw error;
  }

  console.log('Hotspots seeded successfully:', data);
};
