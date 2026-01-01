import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../services/supabaseClient';

// Helper to darken/lighten hex color
const adjustColor = (color, amount) => {
  return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

// Helper to apply variables to document
const applyTheme = (settings) => {
  if (!settings) return;
  
  const root = document.documentElement;
  
  if (settings.colors) {
    Object.entries(settings.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
      
      // Also set RGB versions for rgba() usage
      if (value.startsWith('#')) {
        const hex = value.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        root.style.setProperty(`--${key}-rgb`, `${r}, ${g}, ${b}`);
        
        // Auto-generate hover and light variants for primary/accent
        if (key === 'primary' || key === 'accent' || key === 'secondary') {
          root.style.setProperty(`--${key}-hover`, adjustColor(value, -20)); // Darken by 20
          root.style.setProperty(`--${key}-light`, adjustColor(value, 40));  // Lighten by 40
        }
      }
    });
  }
  
  if (settings.typography) {
    if (settings.typography.fontFamily) {
      root.style.setProperty('--font-primary', settings.typography.fontFamily);
    }
  }
};

export const fetchDesignSettings = createAsyncThunk('design/fetch', async () => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .single();
    
  if (error && error.code !== 'PGRST116') throw error;
  
  // If no settings exist, return default structure
  if (!data) {
    return {
      settings: {
        colors: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
          accent: '#10b981',
        },
        typography: {
          fontFamily: "'Inter', sans-serif",
        }
      }
    };
  }
  
  applyTheme(data.settings);
  return { id: data.id, settings: data.settings };
});

export const updateDesignSettings = createAsyncThunk('design/update', async (settings, { getState }) => {
  const { id } = getState().design;
  
  let result;
  
  if (id) {
    result = await supabase
      .from('site_settings')
      .update({ 
        settings,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
  } else {
    result = await supabase
      .from('site_settings')
      .insert({ settings })
      .select()
      .single();
  }
    
  const { data, error } = result;

  if (error) throw error;
  
  applyTheme(settings);
  return { id: data.id, settings: data.settings };
});

const designSlice = createSlice({
  name: 'design',
  initialState: {
    id: null,
    settings: {
      colors: {
        primary: '#6366f1',
        secondary: '#8b5cf6',
        accent: '#10b981',
      },
      typography: {
        fontFamily: "'Inter', sans-serif",
      }
    },
    loading: false,
    error: null,
  },
  reducers: {
    previewSettings: (state, action) => {
      applyTheme(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDesignSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDesignSettings.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.id) {
          state.id = action.payload.id;
          state.settings = action.payload.settings;
        } else {
          state.settings = action.payload.settings;
        }
      })
      .addCase(fetchDesignSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateDesignSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDesignSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.id = action.payload.id;
        state.settings = action.payload.settings;
      })
      .addCase(updateDesignSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { previewSettings } = designSlice.actions;
export default designSlice.reducer;
