// ============================================
// slices/educationSlice.js
// ============================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../services/supabaseClient';
import { compressImage } from '../../utils/imageOptimizer';

export const fetchEducation = createAsyncThunk('education/fetchAll', async () => {
  const { data, error } = await supabase
    .from('education')
    .select(`
      *,
      skills:education_skills(id, skill_name)
    `)
    .order('start_date', { ascending: false });
  
  if (error) throw error;
  return data;
});

export const createEducation = createAsyncThunk('education/create', async (educationData) => {
  const { skills, ...mainData } = educationData;
  
  const { data: education, error } = await supabase
    .from('education')
    .insert(mainData)
    .select()
    .single();
  
  if (error) throw error;

  if (skills && skills.length > 0) {
    const skillsData = skills.map(skill => ({
      education_id: education.id,
      skill_name: skill,
    }));

    await supabase
      .from('education_skills')
      .insert(skillsData);
  }

  return education;
});

export const updateEducation = createAsyncThunk('education/update', async ({ id, data }) => {
  const { skills, ...mainData } = data;
  
  const { data: education, error } = await supabase
    .from('education')
    .update(mainData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;

  if (skills) {
    await supabase
      .from('education_skills')
      .delete()
      .eq('education_id', id);

    if (skills.length > 0) {
      const skillsData = skills.map(skill => ({
        education_id: id,
        skill_name: skill,
      }));

      await supabase
        .from('education_skills')
        .insert(skillsData);
    }
  }

  return education;
});

export const deleteEducation = createAsyncThunk('education/delete', async (id) => {
  const { error } = await supabase
    .from('education')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return id;
});

export const uploadInstitutionLogo = createAsyncThunk('education/uploadLogo', async (file) => {
  let fileToUpload = file;
  try {
    fileToUpload = await compressImage(file, {
      maxWidthOrHeight: 300,
      fileType: 'image/webp'
    });
  } catch (err) {
    console.warn('Image optimization failed:', err);
  }

  const fileExt = fileToUpload.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('institution-logos')
    .upload(fileName, fileToUpload, {
      cacheControl: '31536000',
      upsert: false
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('institution-logos')
    .getPublicUrl(fileName);

  return data.publicUrl;
});

const educationSlice = createSlice({
  name: 'education',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEducation.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEducation.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchEducation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createEducation.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateEducation.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteEducation.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export default educationSlice.reducer;