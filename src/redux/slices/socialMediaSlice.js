// ============================================
// slices/socialMediaSlice.js
// ============================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../services/supabaseClient';

export const fetchSocialMedia = createAsyncThunk('socialMedia/fetchAll', async () => {
  const { data, error } = await supabase
    .from('social_media')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data;
});

export const createSocialMedia = createAsyncThunk('socialMedia/create', async (socialData) => {
  const { data, error } = await supabase
    .from('social_media')
    .insert(socialData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
});

export const updateSocialMedia = createAsyncThunk('socialMedia/update', async ({ id, data }) => {
  const { data: social, error } = await supabase
    .from('social_media')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return social;
});

export const deleteSocialMedia = createAsyncThunk('socialMedia/delete', async (id) => {
  const { error } = await supabase
    .from('social_media')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return id;
});

const socialMediaSlice = createSlice({
  name: 'socialMedia',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSocialMedia.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSocialMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSocialMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createSocialMedia.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateSocialMedia.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteSocialMedia.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export default socialMediaSlice.reducer;