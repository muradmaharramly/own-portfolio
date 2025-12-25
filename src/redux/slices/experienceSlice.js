// ============================================
// slices/experienceSlice.js
// ============================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../services/supabaseClient';

export const fetchExperience = createAsyncThunk('experience/fetchAll', async () => {
  const { data, error } = await supabase
    .from('experience')
    .select(`
      *,
      skills:experience_skills(id, skill_name)
    `)
    .order('start_date', { ascending: false });
  
  if (error) throw error;
  return data;
});

export const createExperience = createAsyncThunk('experience/create', async (experienceData) => {
  const { skills, ...mainData } = experienceData;
  
  const { data: experience, error } = await supabase
    .from('experience')
    .insert(mainData)
    .select()
    .single();
  
  if (error) throw error;

  if (skills && skills.length > 0) {
    const skillsData = skills.map(skill => ({
      experience_id: experience.id,
      skill_name: skill,
    }));

    await supabase
      .from('experience_skills')
      .insert(skillsData);
  }

  return experience;
});

export const updateExperience = createAsyncThunk('experience/update', async ({ id, data }) => {
  const { skills, ...mainData } = data;
  
  const { data: experience, error } = await supabase
    .from('experience')
    .update(mainData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;

  if (skills) {
    await supabase
      .from('experience_skills')
      .delete()
      .eq('experience_id', id);

    if (skills.length > 0) {
      const skillsData = skills.map(skill => ({
        experience_id: id,
        skill_name: skill,
      }));

      await supabase
        .from('experience_skills')
        .insert(skillsData);
    }
  }

  return experience;
});

export const deleteExperience = createAsyncThunk('experience/delete', async (id) => {
  const { error } = await supabase
    .from('experience')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return id;
});

export const uploadCompanyLogo = createAsyncThunk('experience/uploadLogo', async (file) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('company-logos')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('company-logos')
    .getPublicUrl(fileName);

  return data.publicUrl;
});

const experienceSlice = createSlice({
  name: 'experience',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExperience.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchExperience.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchExperience.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createExperience.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateExperience.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteExperience.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export default experienceSlice.reducer;