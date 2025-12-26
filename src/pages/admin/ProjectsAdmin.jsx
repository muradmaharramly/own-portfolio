// src/pages/admin/ProjectsAdmin.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes,
  FaRocket,
  FaGithub,
  FaExternalLinkAlt,
  FaUpload,
  FaImage
} from 'react-icons/fa';
import { 
  fetchProjects, 
  createProject, 
  updateProject, 
  deleteProject 
} from '../../redux/slices/projectsSlice';
import Modal from '../../components/Common/Modal';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import Tag from '../../components/Common/Tag';
import LoadMore from '../../components/Common/LoadMore';
import EmptyState from '../../components/Common/EmptyState';
import { uploadFile, deleteFile, validateFile } from '../../utils/fileUpload';
import { ITEMS_PER_PAGE } from '../../utils/constants';
import { toast } from 'react-toastify';
import { FiEdit2, FiExternalLink, FiGithub, FiTrash } from 'react-icons/fi';
import { IoRocketOutline } from 'react-icons/io5';

const ProjectsAdmin = () => {
  const dispatch = useDispatch();
  const { items, loading, hasMore, currentPage } = useSelector((state) => state.projects);

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    project_name: '',
    description: '',
    project_image: '',
    github_url: '',
    live_url: '',
    technologies: []
  });

  const [techInput, setTechInput] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const uploadTickerRef = useRef(null);

  useEffect(() => {
    dispatch(fetchProjects({ page: 1, limit: ITEMS_PER_PAGE }));
  }, [dispatch]);

  const handleLoadMore = () => {
    dispatch(fetchProjects({ page: currentPage + 1, limit: ITEMS_PER_PAGE }));
  };

  const resetForm = () => {
    setFormData({
      project_name: '',
      description: '',
      project_image: '',
      github_url: '',
      live_url: '',
      technologies: []
    });
    setTechInput('');
    setImagePreview(null);
    setEditingId(null);
  };

  const openModal = (item = null) => {
    if (item) {
      setFormData({
        project_name: item.project_name || '',
        description: item.description || '',
        project_image: item.project_image || '',
        github_url: item.github_url || '',
        live_url: item.live_url || '',
        technologies: item.technologies ? item.technologies.map(t => t.technology_name) : []
      });
      setImagePreview(item.project_image);
      setEditingId(item.id);
    } else {
      resetForm();
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      validateFile(file, { maxSize: 5 * 1024 * 1024 });
      setUploading(true);
      setUploadProgress(0);
      if (uploadTickerRef.current) clearInterval(uploadTickerRef.current);
      uploadTickerRef.current = setInterval(() => {
        setUploadProgress((p) => (p < 95 ? Math.min(95, p + Math.floor(Math.random() * 12) + 3) : p));
      }, 120);

      // Delete old image if exists and editing
      if (editingId && formData.project_image) {
        const oldPath = formData.project_image.split('/').slice(-2).join('/');
        await deleteFile('project-images', oldPath);
      }

      // Upload new image
      const { url } = await uploadFile(file, 'project-images', 'projects');
      
      setFormData(prev => ({ ...prev, project_image: url }));
      const img = new Image();
      img.onload = () => {
        setImagePreview(url);
        setUploadProgress(100);
        if (uploadTickerRef.current) clearInterval(uploadTickerRef.current);
        setUploading(false);
        toast.success('Şəkil yükləndi');
      };
      img.onerror = () => {
        if (uploadTickerRef.current) clearInterval(uploadTickerRef.current);
        setUploading(false);
        setUploadProgress(0);
        toast.error('Şəkil yüklənərkən xəta baş verdi');
      };
      img.src = url;
    } catch (error) {
      toast.error(error.message || 'Şəkil yüklənərkən xəta baş verdi');
    } finally {
      // handled in onload/onerror
    }
  };

  const handleDeleteImage = async () => {
    if (!formData.project_image) return;

    try {
      const path = formData.project_image.split('/').slice(-2).join('/');
      await deleteFile('project-images', path);
      
      setFormData(prev => ({ ...prev, project_image: '' }));
      setImagePreview(null);
      toast.success('Şəkil silindi');
    } catch {
      toast.error('Şəkil silinərkən xəta baş verdi');
    }
  };

  const handleAddTech = (e) => {
    e.preventDefault();
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const handleRemoveTech = (techToRemove) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => tech !== techToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.project_name.trim()) {
      toast.error('Proyekt adını daxil edin');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Proyekt təsvirini daxil edin');
      return;
    }

    try {
      if (editingId) {
        await dispatch(updateProject({ id: editingId, data: formData })).unwrap();
        toast.success('Proyekt yeniləndi');
      } else {
        await dispatch(createProject(formData)).unwrap();
        toast.success('Proyekt əlavə edildi');
      }
      closeModal();
    } catch (error) {
      toast.error(error.message || 'Xəta baş verdi');
    }
  };

  const handleDelete = async () => {
    try {
      const project = items.find(item => item.id === deleteId);
      
      // Delete project image if exists
      if (project?.project_image) {
        const path = project.project_image.split('/').slice(-2).join('/');
        await deleteFile('project-images', path);
      }

      await dispatch(deleteProject(deleteId)).unwrap();
      toast.success('Proyekt silindi');
      setDeleteId(null);
    } catch {
      toast.error('Silinərkən xəta baş verdi');
    }
  };

  return (
    <div className="projects-admin">
      <div className="projects-admin__header">
        <div>
          <h1 className="projects-admin__title">Proyektlər</h1>
          <p className="projects-admin__subtitle">Proyektlərinizi idarə edin</p>
        </div>
        <button className="btn-primary" onClick={() => openModal()}>
          <FaPlus />
          <span>Proyekt əlavə et</span>
        </button>
      </div>

      {loading && items.length === 0 ? (
        <div className="projects-admin__loading">
          <div className="spinner"></div>
          <p>Yüklənir...</p>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<IoRocketOutline />}
          title="Proyekt yoxdur"
          description="Proyektlərinizi əlavə edin"
          action={
            <button className="btn-primary" onClick={() => openModal()}>
              <FaPlus />
              <span>İlk proyekti əlavə et</span>
            </button>
          }
        />
      ) : (
        <>
          <div className="projects-grid">
            {items.map((item) => (
              <div key={item.id} className="project-card">
                {item.project_image && (
                  <div className="project-card__image">
                    <img src={item.project_image} alt={item.project_name} />
                    <div className="project-card__overlay">
                      <div className="project-card__links">
                        {item.github_url && (
                          <a 
                            href={item.github_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="project-card__link"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FiGithub />
                          </a>
                        )}
                        {item.live_url && (
                          <a 
                            href={item.live_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="project-card__link"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FiExternalLink />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="project-card__content">
                  <div className="project-card__header">
                    <h3 className="project-card__title">{item.project_name}</h3>
                    <div className="project-card__actions">
                      <button 
                        className="btn-icon primary"
                        onClick={() => openModal(item)}
                        aria-label="Edit"
                      >
                        <FiEdit2 />
                      </button>
                      <button 
                        className="btn-icon danger"
                        onClick={() => {
                          setDeleteId(item.id);
                          setConfirmOpen(true);
                        }}
                        aria-label="Delete"
                      >
                        <FiTrash />
                      </button>
                    </div>
                  </div>

                  <p className="project-card__description">{item.description}</p>

                  {item.technologies && item.technologies.length > 0 && (
                    <div className="project-card__tech">
                      {item.technologies.map((tech, index) => (
                        <Tag key={index} variant="secondary">{tech.technology_name || tech}</Tag>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <LoadMore 
            onClick={handleLoadMore}
            loading={loading}
            hasMore={hasMore}
          />
        </>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingId ? 'Proyekti Redaktə et' : 'Proyekt əlavə et'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="project-form">
          {/* Project Image */}
          <div className="form-group">
            <label className="form-group__label">Proyekt Şəkli</label>
            <div className="image-upload-area">
              {imagePreview ? (
                <div className="image-preview">
                  <img src={imagePreview} alt="Project preview" />
                  {uploading && (
                    <div className="image-preview__progress">
                      <div className="upload-circular">
                        <svg className="upload-circular__svg" viewBox="0 0 120 120">
                          <circle className="upload-circular__track" cx="60" cy="60" r="54" />
                          <circle
                            className="upload-circular__progress"
                            cx="60"
                            cy="60"
                            r="54"
                            style={{
                              strokeDasharray: 2 * Math.PI * 54,
                              strokeDashoffset: (2 * Math.PI * 54) * (1 - uploadProgress / 100)
                            }}
                          />
                        </svg>
                        <div className="upload-circular__text">{uploadProgress}%</div>
                      </div>
                    </div>
                  )}
                  <div className="image-preview__overlay">
                    <label className="image-preview__btn">
                      <FaUpload />
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange}
                        disabled={uploading}
                      />
                    </label>
                    <button 
                      type="button"
                      className="image-preview__btn image-preview__btn--danger"
                      onClick={handleDeleteImage}
                      disabled={uploading}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ) : (
                <label className="image-upload-placeholder">
                  <FaImage />
                  <span>Şəkil yükləyin</span>
                  <span className="image-upload-hint">PNG, JPG (max. 5MB)</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    disabled={uploading}
                  />
                  {uploading && (
                    <div className="image-preview__progress">
                      <div className="upload-circular">
                        <svg className="upload-circular__svg" viewBox="0 0 120 120">
                          <circle className="upload-circular__track" cx="60" cy="60" r="54" />
                          <circle
                            className="upload-circular__progress"
                            cx="60"
                            cy="60"
                            r="54"
                            style={{
                              strokeDasharray: 2 * Math.PI * 54,
                              strokeDashoffset: (2 * Math.PI * 54) * (1 - uploadProgress / 100)
                            }}
                          />
                        </svg>
                        <div className="upload-circular__text">{uploadProgress}%</div>
                      </div>
                    </div>
                  )}
                </label>
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-group__label">
              Proyekt adı <span className="required">*</span>
            </label>
            <input
              type="text"
              name="project_name"
              value={formData.project_name}
              onChange={handleChange}
              className="form-group__input"
              placeholder="Proyektinizin adı"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-group__label">
              Təsvir <span className="required">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-group__textarea"
              rows="4"
              placeholder="Proyekt haqqında məlumat..."
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-group__label">GitHub URL</label>
              <input
                type="url"
                name="github_url"
                value={formData.github_url}
                onChange={handleChange}
                className="form-group__input"
                placeholder="https://github.com/username/repo"
              />
            </div>

            <div className="form-group">
              <label className="form-group__label">Live Demo URL</label>
              <input
                type="url"
                name="live_url"
                value={formData.live_url}
                onChange={handleChange}
                className="form-group__input"
                placeholder="https://demo.example.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-group__label">Texnologiyalar</label>
            <div className="skill-input">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                className="form-group__input"
                placeholder="Texnologiya daxil edin və Enter basın"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTech(e);
                  }
                }}
              />
              <button 
                type="button"
                onClick={handleAddTech}
                className="btn-secondary btn-sm"
              >
                <FaPlus />
              </button>
            </div>
            {formData.technologies.length > 0 && (
              <div className="skills-list">
                {formData.technologies.map((tech, index) => (
                  <Tag 
                    key={index} 
                    variant="secondary"
                    onRemove={() => handleRemoveTech(tech)}
                  >
                    {tech}
                  </Tag>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={closeModal}
            >
              <FaTimes />
              <span>Ləğv et</span>
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading || uploading}
            >
              <FaSave />
              <span>{editingId ? 'Yenilə' : 'Əlavə et'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Proyekti sil"
        message="Bu proyekti silmək istədiyinizdən əminsiniz?"
        confirmText="Sil"
        variant="danger"
      />
    </div>
  );
};

export default ProjectsAdmin;
