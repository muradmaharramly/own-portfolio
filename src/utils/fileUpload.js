// src/utils/fileUpload.js
import { supabase } from '../../src/services/supabaseClient';
import { compressImage } from './imageOptimizer';

export const uploadFile = async (file, bucket, folder = '') => {
  try {
    let fileToUpload = file;
    
    // Optimize image if it is an image
    if (file.type.startsWith('image/')) {
      try {
        fileToUpload = await compressImage(file, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1280,
          useWebWorker: true,
          fileType: 'image/webp'
        });
      } catch (err) {
        console.warn('Image optimization failed, uploading original:', err);
      }
    }

    const fileExt = fileToUpload.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, fileToUpload, {
        cacheControl: '31536000',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { url: publicUrl, path: filePath };
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
};

export const deleteFile = async (bucket, filePath) => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('File delete error:', error);
    throw error;
  }
};

export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
  } = options;

  if (file.size > maxSize) {
    throw new Error(`Fayl ölçüsü ${maxSize / 1024 / 1024}MB-dan böyük ola bilməz`);
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Yalnız ${allowedTypes.join(', ')} formatları qəbul edilir`);
  }

  return true;
};