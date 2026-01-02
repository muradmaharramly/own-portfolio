// ============================================
// pages/admin/SocialMediaAdmin.jsx
// ============================================

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSocialMedia, createSocialMedia, updateSocialMedia, deleteSocialMedia } from '../../redux/slices/socialMediaSlice';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiLink, FiTrash } from 'react-icons/fi';
import Modal from '../../components/Common/Modal';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import EmptyState from '../../components/Common/EmptyState';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';
import * as FiIcons from 'react-icons/fi';
import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';

const SocialMediaAdmin = () => {
  const dispatch = useDispatch();
  const { items: socialMedia, loading } = useSelector((state) => state.socialMedia);

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    platform_name: '',
    platform_url: '',
    icon_name: '',
  });

  useEffect(() => {
    dispatch(fetchSocialMedia());
  }, [dispatch]);

  const resetForm = () => {
    setFormData({
      platform_name: '',
      platform_url: '',
      icon_name: '',
    });
    setEditingId(null);
  };

  const openModal = (item = null) => {
    if (item) {
      setFormData({
        platform_name: item.platform_name,
        platform_url: item.platform_url,
        icon_name: item.icon_name || '',
      });
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await dispatch(updateSocialMedia({ id: editingId, data: formData })).unwrap();
        toast.success('Sosial media keçidi yeniləndi');
      } else {
        await dispatch(createSocialMedia(formData)).unwrap();
        toast.success('Sosial media keçidi əlavə edildi');
      }
      closeModal();
    } catch (error) {
      console.error('SUPABASE ERROR:', error);
      toast.error(error?.message || 'Əməliyyat alınmadı');
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteSocialMedia(deleteId)).unwrap();
      toast.success('Sosial media keçidi silindi');
      setDeleteId(null);
    } catch {
      toast.error('Keçidi silmək alınmadı');
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const resolveIcon = (name) => {
      if (!name || typeof name !== 'string') return FiLink;
      const prefix = name.slice(0, 2);
      if (prefix === 'Fi' && FiIcons[name]) return FiIcons[name];
      if (prefix === 'Fa' && FaIcons[name]) return FaIcons[name];
      if (prefix === 'Si' && SiIcons[name]) return SiIcons[name];
      return FiLink;
    };

  if (loading && socialMedia.length === 0) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="social-admin">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Sosial Media</h1>
          <p className="admin-subtitle">Sosial profillərinizi idarə edin</p>
        </div>
        <button className="btn-primary" onClick={() => openModal()}>
          <FiPlus />
          Keçid əlavə et
        </button>
      </div>

      {socialMedia.length === 0 ? (
        <EmptyState
          icon={<FiLink />}
          title="Sosial keçid yoxdur"
          description="Hələ sosial media keçidi əlavə edilməyib. Profillərinizi göstərmək üçün əlavə edin."
          action={
            <button className="btn-primary" onClick={() => openModal()}>
              <FiPlus />
              Keçid əlavə et
            </button>
          }
        />
      ) : (
        <div className="social-admin__grid">
          {socialMedia.map((item) => (
            <div key={item.id} className="social-card">
              <div className="social-card__content">
                <div className="social-card__header">
                  <h3 className="social-card__platform">{item.platform_name}</h3>
                </div>

                <div className='media-fl'>
                  <FiLink /><a
                    href={item.platform_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-card__link"
                  >

                    {item.platform_url}
                  </a></div>
                  <div className='media-fl'>{(() => {
                  const Icon = resolveIcon(item.icon_name);
                  return <Icon />;
                })()}<span>{item.icon_name}</span></div>
                  
              </div>

              <div className="social-card__actions">
                <div
                  className="btn-icon primary btn-sm"
                  onClick={() => openModal(item)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && openModal(item)}
                  aria-label="Edit"
                >
                  <FiEdit2 />
                </div>
                <div
                  className="btn-icon danger btn-sm"
                  onClick={() => confirmDelete(item.id)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      confirmDelete(item.id);
                    }
                  }}
                  aria-label="Delete"
                >
                  <FiTrash />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingId ? 'Sosial keçidi redaktə et' : 'Sosial keçid əlavə et'}
      >
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label className='form-group__label'>Platforma adı (məs., GitHub, LinkedIn)</label>
            <input
              type="text"
              className="form-control form-group__input"
              value={formData.platform_name}
              onChange={(e) => setFormData({ ...formData, platform_name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className='form-group__label'>Profil URL</label>
            <input
              type="url"
              className="form-control form-group__input"
              value={formData.platform_url}
              onChange={(e) => setFormData({ ...formData, platform_url: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className='form-group__label'>İkon adı (məs., FiGithub)</label>
            <input
              type="text"
              className="form-control form-group__input"
              value={formData.icon_name}
              onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
              placeholder="FiGithub, FiLinkedin, FaTwitter, SiGmail"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={closeModal}>
              <FaTimes />
              Ləğv et
            </button>
            <button type="submit" className="btn-primary">
              <FiSave />
              {editingId ? 'Yenilə' : 'Əlavə et'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Keçidi sil"
        message="Bu sosial media keçidini silmək istədiyinizdən əminsiniz?"
      />
    </div>
  );
};

export default SocialMediaAdmin;
