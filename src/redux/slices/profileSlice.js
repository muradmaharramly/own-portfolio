// ============================================
// slices/profileSlice.js
// ============================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../services/supabaseClient';
import { compressImage } from '../../utils/imageOptimizer';

export const fetchProfile = createAsyncThunk('profile/fetch', async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .maybeSingle();
  
  if (error) throw error;
  return data;
});

export const updateProfile = createAsyncThunk('profile/update', async (profileData) => {
  if (profileData?.id) {
    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', profileData.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
});

export const uploadProfileImage = createAsyncThunk('profile/uploadImage', async (file) => {
  let fileToUpload = file;
  try {
    fileToUpload = await compressImage(file, {
      maxWidthOrHeight: 1024,
      fileType: 'image/webp'
    });
  } catch (err) {
    console.warn('Image optimization failed:', err);
  }

  const fileExt = fileToUpload.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('profile-images')
    .upload(filePath, fileToUpload, {
      cacheControl: '31536000',
      upsert: false
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('profile-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
});

export const uploadCV = createAsyncThunk('profile/uploadCV', async (file) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `cv-${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('cv-files')
    .upload(filePath, file, {
      cacheControl: '31536000',
      upsert: false
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('cv-files')
    .getPublicUrl(filePath);

  return data.publicUrl;
});

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearProfile: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        if (state.data) {
          state.data.profile_image = action.payload;
        }
      })
      .addCase(uploadCV.fulfilled, (state, action) => {
        if (state.data) {
          state.data.cv_file = action.payload;
        }
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
