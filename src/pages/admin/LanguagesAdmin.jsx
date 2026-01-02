// ============================================
// pages/admin/LanguagesAdmin.jsx
// ============================================

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLanguages, createLanguage, updateLanguage, deleteLanguage } from '../../redux/slices/languageSlice';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiTrash } from 'react-icons/fi';
import { FaLanguage, FaTimes } from 'react-icons/fa';
import Modal from '../../components/Common/Modal';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import EmptyState from '../../components/Common/EmptyState';
import { toast } from 'react-toastify';
import { HiMiniLanguage } from 'react-icons/hi2';

const LanguagesAdmin = () => {
  const dispatch = useDispatch();
  const { items: languages, loading } = useSelector((state) => state.languages);
  const levelFor = (p) => {
    if (p >= 96) return 'Ana dili';
    if (p >= 86) return 'Səlis';
    if (p >= 61) return 'Qabaqcıl';
    if (p >= 41) return 'Orta';
    return 'Başlanğıc';
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    language_name: '',
    proficiency_percentage: 50,
  });

  useEffect(() => {
    dispatch(fetchLanguages());
  }, [dispatch]);

  const resetForm = () => {
    setFormData({
      language_name: '',
      proficiency_percentage: 50,
    });
    setEditingId(null);
  };

  const openModal = (language = null) => {
    if (language) {
      setFormData({
        language_name: language.language_name,
        proficiency_percentage: language.proficiency_percentage,
      });
      setEditingId(language.id);
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
        await dispatch(updateLanguage({ id: editingId, data: formData })).unwrap();
        toast.success('Dil uğurla yeniləndi');
      } else {
        await dispatch(createLanguage(formData)).unwrap();
        toast.success('Dil uğurla əlavə edildi');
      }
      closeModal();
    } catch (error) {
      console.error('UPDATE PROFILE ERROR:', error);
      toast.error(
        error?.message ||
        error?.error ||
        'Əməliyyat alınmadı. Yenidən cəhd edin.'
      );
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteLanguage(deleteId)).unwrap();
      toast.success('Dil uğurla silindi');
      setDeleteId(null);
    } catch {
      toast.error('Dilin silinməsi alınmadı');
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  if (loading && languages.length === 0) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="languages-admin">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Dillər</h1>
          <p className="admin-subtitle">Dil bacarıqlarınızı idarə edin</p>
        </div>
        <button className="btn-primary" onClick={() => openModal()}>
          <FiPlus />
          Dil əlavə et
        </button>
      </div>

      {languages.length === 0 ? (
        <EmptyState
          icon={<HiMiniLanguage />}
          title="Dil yoxdur"
          description="Hələ dil əlavə edilməyib. Aşağıdakı düymə ilə əlavə edin."
          action={
            <button className="btn-primary" onClick={() => openModal()}>
              <FiPlus />
              Dil əlavə et
            </button>
          }
        />
      ) : (
        <div className="languages-admin__grid">
          {languages.map((lang) => (
            <div key={lang.id} className="language-admin-card">
              <div className="language-admin-card__content">
                <div className="language-admin-card__header">
                  <h3 className="language-admin-card__name">{lang.language_name}</h3>
                  <span className="language-admin-card__percentage">
                    {lang.proficiency_percentage}%
                  </span>
                </div>

                <div className="language-admin-card__circular">
                  <svg className="language-admin-card__svg" viewBox="0 0 120 120">
                    <circle
                      className="language-admin-card__circle-bg"
                      cx="60"
                      cy="60"
                      r="45"
                    />
                    <circle
                      className="language-admin-card__circle-progress"
                      cx="60"
                      cy="60"
                      r="45"
                      style={{
                        strokeDasharray: 2 * Math.PI * 45,
                        strokeDashoffset:
                          2 * Math.PI * 45 - (2 * Math.PI * 45 * lang.proficiency_percentage) / 100,
                      }}
                    />
                  </svg>
                </div>
                <p className="language-admin-card__level">{levelFor(lang.proficiency_percentage)}</p>
              </div>

              <div className="language-admin-card__actions">
                <div
                  className="btn-icon primary btn-sm"
                  onClick={() => openModal(lang)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && openModal(lang)}
                  aria-label="Edit"
                >
                  <FiEdit2 />
                </div>
                <div
                  className="btn-icon danger btn-sm"
                  onClick={() => confirmDelete(lang.id)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      confirmDelete(lang.id);
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
        title={editingId ? 'Dili redaktə et' : 'Dil əlavə et'}
      >
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label className='form-group__label'>Dil adı</label>
            <input
              type="text"
              className="form-control form-group__input"
              value={formData.language_name}
              onChange={(e) => setFormData({ ...formData, language_name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className='form-group__label'>Səviyyə ({formData.proficiency_percentage}%)</label>
            <input
              type="range"
              min="0"
              max="100"
              className="form-range form-group__input"
              value={formData.proficiency_percentage}
              onChange={(e) => setFormData({ ...formData, proficiency_percentage: parseInt(e.target.value) })}
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
        title="Dili sil"
        message="Bu dili silmək istədiyinizdən əminsiniz? Bu əməliyyat geri qaytarıla bilməz."
      />
    </div>
  );
};

export default LanguagesAdmin;
