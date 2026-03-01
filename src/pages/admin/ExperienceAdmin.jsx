// src/pages/admin/ExperienceAdmin.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaTimes,
  FaBriefcase 
} from 'react-icons/fa';
import { 
  fetchExperience, 
  createExperience, 
  updateExperience, 
  deleteExperience 
} from '../../redux/slices/experienceSlice';
import Modal from '../../components/Common/Modal';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import Tag from '../../components/Common/Tag';
import LoadMore from '../../components/Common/LoadMore';
import EmptyState from '../../components/Common/EmptyState';
import { formatDateRange } from '../../utils/formatters';
import { ITEMS_PER_PAGE, EMPLOYMENT_TYPES, EXPERIENCE_TYPES } from '../../utils/constants';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash } from 'react-icons/fi';
import { IoBriefcaseOutline, IoSaveOutline } from 'react-icons/io5';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { IoMdClose } from 'react-icons/io';

const ExperienceAdmin = () => {
  const dispatch = useDispatch();
  const { items, loading, hasMore, currentPage } = useSelector((state) => state.experience);

  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    company_name: '',
    company_logo: '',
    position: '',
    employment_type: '',
    experience_type: '',
    location: '',
    start_date: '',
    end_date: '',
    is_current: false,
    description: '',
    skills: []
  });

  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    dispatch(fetchExperience({ page: 1, limit: ITEMS_PER_PAGE }));
  }, [dispatch]);

  const handleLoadMore = () => {
    dispatch(fetchExperience({ page: currentPage + 1, limit: ITEMS_PER_PAGE }));
  };

  const resetForm = () => {
    setFormData({
      company_name: '',
      company_logo: '',
      position: '',
      employment_type: '',
      experience_type: '',
      location: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: '',
      skills: []
    });
    setSkillInput('');
    setEditingId(null);
  };

  const openModal = (item = null) => {
    if (item) {
      setFormData({
        company_name: item.company_name || '',
        company_logo: item.company_logo || '',
        position: item.position || '',
        employment_type: item.employment_type || 'full-time',
        experience_type: item.experience_type || 'work',
        location: item.location || '',
        start_date: item.start_date || '',
        end_date: item.end_date || '',
        is_current: item.is_current || false,
        description: item.description || '',
        skills: item.skills ? item.skills.map(s => s.skill_name) : []
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

    if (!formData.company_name.trim()) {
      toast.error('Şirkət adını daxil edin');
      return;
    }

    if (!formData.position.trim()) {
      toast.error('Vəzifə daxil edin');
      return;
    }

    if (!formData.start_date) {
      toast.error('Başlama tarixini seçin');
      return;
    }

    if (!formData.is_current && !formData.end_date) {
      toast.error('Bitmə tarixini seçin və ya "Davam edir" seçin');
      return;
    }

    try {
      if (editingId) {
        await dispatch(updateExperience({ id: editingId, data: formData })).unwrap();
        toast.success('Təcrübə məlumatı yeniləndi');
      } else {
        await dispatch(createExperience(formData)).unwrap();
        toast.success('Təcrübə məlumatı əlavə edildi');
      }
      closeModal();
    } catch (error) {
      toast.error(error.message || 'Xəta baş verdi');
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteExperience(deleteId)).unwrap();
      toast.success('Təcrübə məlumatı silindi');
      setDeleteId(null);
    } catch {
      toast.error('Silinərkən xəta baş verdi');
    }
  };

  const getExperienceTypeBadge = (type) => {
    const badges = {
      work: { label: 'İş', color: '#10b981' },
      intern: { label: 'Təcrübə', color: '#3b82f6' },
      volunteer: { label: 'Könüllü', color: '#8b5cf6' }
    };
    return badges[type] || badges.work;
  };

  return (
    <div className="experience-admin">
      <div className="experience-admin__header">
        <div>
          <h1 className="experience-admin__title">Təcrübə</h1>
          <p className="experience-admin__subtitle">İş təcrübələrinizi idarə edin</p>
        </div>
        <button className="btn-primary" onClick={() => openModal()}>
          <AiOutlinePlusCircle />
          <span>Təcrübə əlavə et</span>
        </button>
      </div>

      {loading && items.length === 0 ? (
        <div className="experience-admin__loading">
          <div className="spinner"></div>
          <p>Yüklənir...</p>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<IoBriefcaseOutline />}
          title="Təcrübə məlumatı yoxdur"
          description="İş təcrübələrinizi əlavə edin"
          action={
            <button className="btn-primary" onClick={() => openModal()}>
              <FaPlus />
              <span>İlk təcrübəni əlavə et</span>
            </button>
          }
        />
      ) : (
        <>
          <div className="experience-list">
            {items.map((item) => {
              const badge = getExperienceTypeBadge(item.experience_type);
              return (
                <div key={item.id} className="experience-card">
                  <div className="experience-card__header">
                    {item.company_logo && (
                      <img 
                        src={item.company_logo} 
                        alt={item.company_name}
                        className="experience-card__logo"
                      />
                    )}
                    <div className="experience-card__info">
                      <div className="experience-card__title-row">
                        <h3 className="experience-card__position">{item.position}</h3>
                        <span 
                          className="experience-badge"
                          style={{ backgroundColor: badge.color }}
                        >
                          {badge.label}
                        </span>
                      </div>
                      <p className="experience-card__company">{item.company_name}</p>
                      <p className="experience-card__meta">
                        {formatDateRange(item.start_date, item.end_date, item.is_current)}
                        {item.location && ` · ${item.location}`}
                        {item.employment_type && ` · ${EMPLOYMENT_TYPES.find(t => t.value === item.employment_type)?.label}`}
                      </p>
                    </div>
                    <div className="experience-card__actions">
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
                        onClick={() => {
                          setDeleteId(item.id);
                          setConfirmOpen(true);
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setDeleteId(item.id);
                            setConfirmOpen(true);
                          }
                        }}
                        aria-label="Delete"
                      >
                        <FiTrash />
                      </div>
                    </div>
                  </div>

                  {item.description && (
                    <p className="experience-card__description">{item.description}</p>
                  )}

                  {item.skills && item.skills.length > 0 && (
                    <div className="experience-card__skills">
                      {item.skills.map((skill, index) => (
                        <Tag key={index} variant="accent">{skill.skill_name || skill}</Tag>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
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
    title={editingId ? 'Təcrübəni Redaktə et' : 'Təcrübə əlavə et'}
    size="lg"
  >
    <form onSubmit={handleSubmit} className="experience-form">
      <div className="form-row">
        <div className="form-group">
          <label className="form-group__label">
            Şirkət <span className="required">*</span>
          </label>
          <input
            type="text"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            className="form-group__input"
            placeholder="Şirkət adı"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-group__label">Logo URL</label>
          <input
            type="url"
            name="company_logo"
            value={formData.company_logo}
            onChange={handleChange}
            className="form-group__input"
            placeholder="https://example.com/logo.png"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-group__label">
            Vəzifə <span className="required">*</span>
          </label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="form-group__input"
            placeholder="Senior Developer"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-group__label">Yer</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="form-group__input"
            placeholder="Bakı, Azerbaijan"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-group__label">İş Növü</label>
          <select
            name="employment_type"
            value={formData.employment_type}
            onChange={handleChange}
            className="form-group__input"
          >
            {EMPLOYMENT_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-group__label">Təcrübə Tipi</label>
          <select
            name="experience_type"
            value={formData.experience_type}
            onChange={handleChange}
            className="form-group__input"
          >
            {EXPERIENCE_TYPES.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
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
            Bitmə tarixi {!formData.is_current && <span className="required">*</span>}
          </label>
          <input
            type="month"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
            className="form-group__input"
            disabled={formData.is_current}
            required={!formData.is_current}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-group__checkbox">
          <input
            type="checkbox"
            name="is_current"
            checked={formData.is_current}
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
          placeholder="İş təcrübəniz haqqında məlumat..."
        />
      </div>

      <div className="form-group">
        <label className="form-group__label">İstifadə etdiyiniz texnologiyalar</label>
        <div className="skill-input">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            className="form-group__input"
            placeholder="Texnologiya daxil edin və Enter basın"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddSkill(e);
              }
            }}
          />
          <button 
            type="button"
            onClick={handleAddSkill}
            className="btn-secondary"
          >
            <FaPlus />
          </button>
        </div>
        {formData.skills.length > 0 && (
          <div className="skills-list">
            {formData.skills.map((skill, index) => (
              <Tag 
                key={index} 
                variant="accent"
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
          <IoMdClose />
          <span>Ləğv et</span>
        </button>
        <button 
          type="submit" 
          className="btn-primary"
          disabled={loading}
        >
          <IoSaveOutline />
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
    title="Təcrübəni sil"
    message="Bu təcrübə məlumatını silmək istədiyinizdən əminsiniz?"
    confirmText="Sil"
    variant="danger"
  />
</div>
);
};
export default ExperienceAdmin;