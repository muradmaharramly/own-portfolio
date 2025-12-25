// src/pages/admin/EducationAdmin.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes,
  FaGraduationCap 
} from 'react-icons/fa';
import { 
  fetchEducation, 
  createEducation, 
  updateEducation, 
  deleteEducation 
} from '../../redux/slices/educationSlice';
import Modal from '../../components/Common/Modal';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import Tag from '../../components/Common/Tag';
import LoadMore from '../../components/Common/LoadMore';
import EmptyState from '../../components/Common/EmptyState';
import { formatDateRange } from '../../utils/formatters';
import { ITEMS_PER_PAGE } from '../../utils/constants';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash } from 'react-icons/fi';

const EducationAdmin = () => {
  const dispatch = useDispatch();
  const { items, loading, hasMore, currentPage } = useSelector((state) => state.education);

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    institution_name: '',
    institution_logo: '',
    degree: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    is_ongoing: false,
    description: '',
    skills: []
  });

  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    dispatch(fetchEducation({ page: 1, limit: ITEMS_PER_PAGE }));
  }, [dispatch]);

  const handleLoadMore = () => {
    dispatch(fetchEducation({ page: currentPage + 1, limit: ITEMS_PER_PAGE }));
  };

  const resetForm = () => {
    setFormData({
      institution_name: '',
      institution_logo: '',
      degree: '',
      field_of_study: '',
      start_date: '',
      end_date: '',
      is_ongoing: false,
      description: '',
      skills: []
    });
    setSkillInput('');
    setEditingId(null);
  };

  const openModal = (item = null) => {
    if (item) {
      setFormData({
        institution_name: item.institution_name || '',
        institution_logo: item.institution_logo || '',
        degree: item.degree || '',
        field_of_study: item.field_of_study || '',
        start_date: item.start_date || '',
        end_date: item.end_date || '',
        is_ongoing: item.is_ongoing || false,
        description: item.description || '',
        skills: item.skills ? item.skills.map(s => s.skill_name) : []
      });
      setEditingId(item.id);
    } else {
      resetForm();
    }
    setModalOpen(true);
  };

  const  closeModal = () => {
    setModalOpen(false);
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.institution_name.trim()) {
      toast.error('Müəssisənin adını daxil edin');
      return;
    }

    if (!formData.degree.trim()) {
      toast.error('Dərəcə daxil edin');
      return;
    }

    if (!formData.start_date) {
      toast.error('Başlama tarixini seçin');
      return;
    }

    if (!formData.is_ongoing && !formData.end_date) {
      toast.error('Bitmə tarixini seçin və ya "Davam edir" seçin');
      return;
    }

    try {
      if (editingId) {
        await dispatch(updateEducation({ id: editingId, data: formData })).unwrap();
        toast.success('Təhsil məlumatı yeniləndi');
      } else {
        await dispatch(createEducation(formData)).unwrap();
        toast.success('Təhsil məlumatı əlavə edildi');
      }
      closeModal();
    } catch (error) {
      toast.error(error.message || 'Xəta baş verdi');
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteEducation(deleteId)).unwrap();
      toast.success('Təhsil məlumatı silindi');
      setDeleteId(null);
    } catch {
      toast.error('Silinərkən xəta baş verdi');
    }
  };

  return (
    <div className="education-admin">
      <div className="education-admin__header">
        <div>
          <h1 className="education-admin__title">Təhsil</h1>
          <p className="education-admin__subtitle">Təhsil məlumatlarınızı idarə edin</p>
        </div>
        <button className="btn-primary" onClick={() => openModal()}>
          <FaPlus />
          <span>Təhsil əlavə et</span>
        </button>
      </div>

      {loading && items.length === 0 ? (
        <div className="education-admin__loading">
          <div className="spinner"></div>
          <p>Yüklənir...</p>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<FaGraduationCap />}
          title="Təhsil məlumatı yoxdur"
          description="Təhsil məlumatlarınızı əlavə edin"
          action={
            <button className="btn-primary" onClick={() => openModal()}>
              <FaPlus />
              <span>İlk təhsili əlavə et</span>
            </button>
          }
        />
      ) : (
        <>
          <div className="education-list">
            {items.map((item) => (
              <div key={item.id} className="education-card">
                <div className="education-card__header">
                  {item.institution_logo && (
                    <img 
                      src={item.institution_logo} 
                      alt={item.institution_name}
                      className="education-card__logo"
                    />
                  )}
                  <div className="education-card__info">
                    <h3 className="education-card__institution">{item.institution_name}</h3>
                    <p className="education-card__degree">
                      {item.degree} {item.field_of_study && `· ${item.field_of_study}`}
                    </p>
                    <p className="education-card__date">
                      {formatDateRange(item.start_date, item.end_date, item.is_ongoing)}
                    </p>
                  </div>
                  <div className="education-card__actions">
                    <button 
                      className="btn-icon btn-icon primary"
                      onClick={() => openModal(item)}
                      aria-label="Edit"
                    >
                      <FiEdit2 />
                    </button>
                    <button 
                      className="btn-icon btn-icon danger"
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

                {item.description && (
                  <p className="education-card__description">{item.description}</p>
                )}

                {item.skills && item.skills.length > 0 && (
                  <div className="education-card__skills">
                    {item.skills.map((skill, index) => (
                      <Tag key={index} variant="primary">{skill.skill_name || skill}</Tag>
                    ))}
                  </div>
                )}
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
        title={editingId ? 'Təhsili Redaktə et' : 'Təhsil əlavə et'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="education-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-group__label">
                Müəssisə <span className="required">*</span>
              </label>
              <input
                type="text"
                name="institution_name"
                value={formData.institution_name}
                onChange={handleChange}
                className="form-group__input"
                placeholder="Universitet adı"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-group__label">Logo URL</label>
              <input
                type="url"
                name="institution_logo"
                value={formData.institution_logo}
                onChange={handleChange}
                className="form-group__input"
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-group__label">
                Dərəcə <span className="required">*</span>
              </label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                className="form-group__input"
                placeholder="Bakalavr, Magistr və s."
                required
              />
            </div>

            <div className="form-group">
              <label className="form-group__label">İxtisas</label>
              <input
                type="text"
                name="field_of_study"
                value={formData.field_of_study}
                onChange={handleChange}
                className="form-group__input"
                placeholder="Computer Science"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-group__label">
                Başlama tarixi <span className="required">*</span>
              </label>
              <input
                type="month"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="form-group__input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-group__label">
                Bitmə tarixi {!formData.is_ongoing && <span className="required">*</span>}
              </label>
              <input
                type="month"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="form-group__input"
                disabled={formData.is_ongoing}
                required={!formData.is_ongoing}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-group__checkbox">
              <input
                type="checkbox"
                name="is_ongoing"
                checked={formData.is_ongoing}
                onChange={handleChange}
              />
              <span>Davam edir</span>
            </label>
          </div>

          <div className="form-group">
            <label className="form-group__label">Təsvir</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-group__textarea"
              rows="4"
              placeholder="Təhsil haqqında əlavə məlumat..."
            />
          </div>

          <div className="form-group">
            <label className="form-group__label">Bacarıqlar</label>
            <div className="skill-input">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                className="form-group__input"
                placeholder="Bacarıq daxil edin və Enter basın"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddSkill(e);
                  }
                }}
              />
              <button 
                type="button"
                onClick={handleAddSkill}
                className="btn-secondary btn-sm"
              >
                <FaPlus />
              </button>
            </div>
            {formData.skills.length > 0 && (
              <div className="skills-list">
                {formData.skills.map((skill, index) => (
                  <Tag 
                    key={index} 
                    variant="primary"
                    onRemove={() => handleRemoveSkill(skill)}
                  >
                    {skill}
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
              disabled={loading}
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
        title="Təhsili sil"
        message="Bu təhsil məlumatını silmək istədiyinizdən əminsiniz?"
        confirmText="Sil"
        variant="danger"
      />
    </div>
  );
};

export default EducationAdmin;
