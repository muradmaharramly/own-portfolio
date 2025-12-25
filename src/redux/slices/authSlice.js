// ============================================
// slices/authSlice.js
// ============================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../services/supabaseClient';

export const signIn = createAsyncThunk('auth/signIn', async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
});

export const signOut = createAsyncThunk('auth/signOut', async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
});

export const checkAuth = createAsyncThunk('auth/check', async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    session: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.session = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.isAuthenticated = true;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.session = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.session = action.payload;
          state.isAuthenticated = true;
        }
      });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;