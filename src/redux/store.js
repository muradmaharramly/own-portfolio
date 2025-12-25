// ============================================
// store.js
// ============================================

import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './slices/themeSlice';
import profileReducer from './slices/profileSlice';
import educationReducer from './slices/educationSlice';
import experienceReducer from './slices/experienceSlice';
import projectsReducer from './slices/projectsSlice';
import languagesReducer from './slices/languageSlice';
import socialMediaReducer from './slices/socialMediaSlice';
import contactReducer from './slices/contactSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    profile: profileReducer,
    education: educationReducer,
    experience: experienceReducer,
    projects: projectsReducer,
    languages: languagesReducer,
    socialMedia: socialMediaReducer,
    contact: contactReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// ============================================
// slices/themeSlice.js
// ============================================

import { createSlice } from '@reduxjs/toolkit';

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) return savedTheme;
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    mode: getInitialTheme(),
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', state.mode);
      document.documentElement.setAttribute('data-theme', state.mode);
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      localStorage.setItem('theme', state.mode);
      document.documentElement.setAttribute('data-theme', state.mode);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
