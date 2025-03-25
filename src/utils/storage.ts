import { supabase } from '../lib/supabase';

export const uploadImage = async (uri: string, userId: string): Promise<string | null> => {
  try {
    // Convert URI to Blob
    const response = await fetch(uri);
    const blob = await response.blob();
    
    // Generate unique filename
    const fileName = `${userId}/${Date.now()}.jpg`;
    const filePath = `${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('service-images')
      .upload(filePath, blob);

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data } = supabase.storage
      .from('service-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

export const deleteImage = async (url: string): Promise<boolean> => {
  try {
    // Extract file path from URL
    const path = url.split('service-images/')[1];
    
    const { error } = await supabase.storage
      .from('service-images')
      .remove([path]);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}; 