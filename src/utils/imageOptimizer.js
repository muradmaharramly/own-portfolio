import imageCompression from 'browser-image-compression';

export const compressImage = async (file, options = {}) => {
  const defaultOptions = {
    maxSizeMB: 0.5, // Max size 0.5MB
    maxWidthOrHeight: 1920, // Max width/height
    useWebWorker: true,
    fileType: 'image/webp', // Force convert to WebP
  };

  const combinedOptions = { ...defaultOptions, ...options };

  try {
    const compressedFile = await imageCompression(file, combinedOptions);
    
    // Create a new file with .webp extension if needed
    if (combinedOptions.fileType === 'image/webp' && !compressedFile.name.endsWith('.webp')) {
      const newName = compressedFile.name.replace(/\.[^/.]+$/, "") + ".webp";
      return new File([compressedFile], newName, { type: 'image/webp' });
    }
    
    return compressedFile;
  } catch (error) {
    console.error("Image compression error:", error);
    // Return original file if compression fails
    return file;
  }
};
