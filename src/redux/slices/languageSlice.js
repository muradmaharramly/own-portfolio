// ============================================
// slices/languagesSlice.js
// ============================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../services/supabaseClient';

export const fetchLanguages = createAsyncThunk('languages/fetchAll', async () => {
  const { data, error } = await supabase
    .from('languages')
    .select('*')
    .order('proficiency_percentage', { ascending: false });
  
  if (error) throw error;
  return data;
});

export const createLanguage = createAsyncThunk('languages/create', async (languageData) => {
  const { data, error } = await supabase
    .from('languages')
    .insert(languageData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
});

export const updateLanguage = createAsyncThunk('languages/update', async ({ id, data }) => {
  const { data: language, error } = await supabase
    .from('languages')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return language;
});

export const deleteLanguage = createAsyncThunk('languages/delete', async (id) => {
  const { error } = await supabase
    .from('languages')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return id;
});

const languagesSlice = createSlice({
  name: 'languages',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLanguages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLanguages.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchLanguages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createLanguage.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateLanguage.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteLanguage.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export default languagesSlice.reducer;