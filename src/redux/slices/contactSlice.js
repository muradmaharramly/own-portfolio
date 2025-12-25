// ============================================
// slices/contactSlice.js
// ============================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../services/supabaseClient';

export const fetchContactInfo = createAsyncThunk('contact/fetchInfo', async () => {
  const { data, error } = await supabase
    .from('contact_info')
    .select('*')
    .maybeSingle();
  
  if (error) throw error;
  return data;
});

export const updateContactInfo = createAsyncThunk('contact/updateInfo', async (contactData) => {
  const { data, error } = await supabase
    .from('contact_info')
    .upsert(contactData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
});

export const fetchContactMessages = createAsyncThunk('contact/fetchMessages', async () => {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
});

export const createContactMessage = createAsyncThunk('contact/createMessage', async (messageData) => {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert(messageData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
});

export const markMessageAsRead = createAsyncThunk('contact/markAsRead', async (id) => {
  const { data, error } = await supabase
    .from('contact_messages')
    .update({ is_read: true })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
});

export const deleteMessage = createAsyncThunk('contact/deleteMessage', async (id) => {
  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return id;
});

const contactSlice = createSlice({
  name: 'contact',
  initialState: {
    info: null,
    messages: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContactInfo.fulfilled, (state, action) => {
        state.info = action.payload;
      })
      .addCase(updateContactInfo.fulfilled, (state, action) => {
        state.info = action.payload;
      })
      .addCase(fetchContactMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContactMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchContactMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createContactMessage.fulfilled, (state, action) => {
        state.messages.unshift(action.payload);
      })
      .addCase(markMessageAsRead.fulfilled, (state, action) => {
        const index = state.messages.findIndex(msg => msg.id === action.payload.id);
        if (index !== -1) {
          state.messages[index] = action.payload;
        }
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.messages = state.messages.filter(msg => msg.id !== action.payload);
      });
  },
});

export default contactSlice.reducer;