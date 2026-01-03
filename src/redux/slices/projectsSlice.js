// ============================================
// slices/projectsSlice.js
// ============================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../services/supabaseClient';
import { compressImage } from '../../utils/imageOptimizer';

export const fetchProjects = createAsyncThunk('projects/fetchAll', async () => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      technologies:project_technologies(id, technology_name)
    `)
    .order('display_index', { ascending: true });
  
  if (error) throw error;
  return data;
});

export const createProject = createAsyncThunk('projects/create', async (projectData) => {
  const { technologies, ...mainData } = projectData;
  
  const { data: project, error } = await supabase
    .from('projects')
    .insert(mainData)
    .select()
    .single();
  
  if (error) throw error;

  if (technologies && technologies.length > 0) {
    const techData = technologies.map(tech => ({
      project_id: project.id,
      technology_name: tech,
    }));

    await supabase
      .from('project_technologies')
      .insert(techData);
  }

  return project;
});

export const updateProject = createAsyncThunk('projects/update', async ({ id, data }) => {
  const { technologies, ...mainData } = data;
  
  const { data: project, error } = await supabase
    .from('projects')
    .update(mainData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;

  if (technologies) {
    await supabase
      .from('project_technologies')
      .delete()
      .eq('project_id', id);

    if (technologies.length > 0) {
      const techData = technologies.map(tech => ({
        project_id: id,
        technology_name: tech,
      }));

      await supabase
        .from('project_technologies')
        .insert(techData);
    }
  }

  return project;
});

export const deleteProject = createAsyncThunk('projects/delete', async (id) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return id;
});

export const uploadProjectImage = createAsyncThunk('projects/uploadImage', async (file) => {
  let fileToUpload = file;
  try {
    fileToUpload = await compressImage(file, {
      maxWidthOrHeight: 1280, // Optimized for retina displays (displayed ~640px)
      fileType: 'image/webp'
    });
  } catch (err) {
    console.warn('Image optimization failed:', err);
  }

  const fileExt = fileToUpload.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('project-images')
    .upload(fileName, fileToUpload, {
      cacheControl: '31536000',
      upsert: false
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('project-images')
    .getPublicUrl(fileName);

  return data.publicUrl;
});

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export default projectsSlice.reducer;