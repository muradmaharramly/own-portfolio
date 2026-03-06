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
  // Use RPC function to bypass RLS policies for public insertion
  const { data, error } = await supabase
    .rpc('send_contact_message', {
      p_sender_name: messageData.sender_name,
      p_sender_email: messageData.sender_email,
      p_subject: messageData.subject,
      p_message: messageData.message
    });
  
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

export const markAllMessagesAsRead = createAsyncThunk('contact/markAllAsRead', async (_, { getState }) => {
  const { messages } = getState().contact;
  const unreadIds = (messages || []).filter(m => !m.is_read).map(m => m.id);
  if (unreadIds.length === 0) return [];
  const { data, error } = await supabase
    .from('contact_messages')
    .update({ is_read: true })
    .in('id', unreadIds)
    .select();
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

export const deleteAllMessages = createAsyncThunk('contact/deleteAllMessages', async () => {
  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .neq('id', 0); // Delete all rows
  
  if (error) throw error;
  return true;
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
      .addCase(markAllMessagesAsRead.fulfilled, (state, action) => {
        const updatedIds = (action.payload || []).map(m => m.id);
        state.messages.forEach((msg, i) => {
          if (updatedIds.includes(msg.id)) state.messages[i] = { ...msg, is_read: true };
        });
      })
      .addCase(deleteAllMessages.fulfilled, (state) => {
        state.messages = [];
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.messages = state.messages.filter(msg => msg.id !== action.payload);
      });
  },
});

export default contactSlice.reducer;
