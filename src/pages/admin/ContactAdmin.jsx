import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiEdit2, FiMail, FiPhone, FiMapPin, FiSave, FiPlus } from 'react-icons/fi';
import Modal from '../../components/Common/Modal';
import EmptyState from '../../components/Common/EmptyState';
import { fetchContactInfo, updateContactInfo } from '../../redux/slices/contactSlice';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';

const ContactAdmin = () => {
  const dispatch = useDispatch();
  const { info } = useSelector((state) => state.contact);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    location: '',
  });

  useEffect(() => {
    dispatch(fetchContactInfo());
  }, [dispatch]);

  useEffect(() => {
    if (info) {
      setFormData({
        email: info.email ?? '',
        phone: info.phone ?? '',
        location: info.location ?? '',
      });
    }
  }, [info]);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      toast.error('Email daxil edin');
      return;
    }
    try {
      await dispatch(updateContactInfo(formData)).unwrap();
      toast.success('Əlaqə məlumatları yadda saxlandı');
      closeModal();
    } catch (error) {
      toast.error(error?.message || 'Əməliyyat alınmadı');
    }
  };

  return (
    <div className="contact-admin">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Əlaqə Məlumatları</h1>
          <p className="admin-subtitle">Email, telefon və məkan məlumatlarını idarə edin</p>
        </div>
        <button className="btn-primary" onClick={openModal}>
          {info ? <FiEdit2 /> : <FiPlus />}
          {info ? 'Redaktə et' : 'Əlavə et'}
        </button>
      </div>

      {!info ? (
        <EmptyState
          icon={<FiMail />}
          title="Əlaqə məlumatı yoxdur"
          description="Email, telefon və məkan məlumatı əlavə etmək üçün düyməyə klikləyin."
          action={
            <button className="btn-primary" onClick={openModal}>
              <FiPlus />
              Əlavə et
            </button>
          }
        />
      ) : (
        <div className="contact-admin__card">
          <div className="contact-admin__item">
            <div className="contact-admin__icon"><FiMail /></div>
            <div className="contact-admin__content">
              <h4>Email</h4>
              <a href={`mailto:${info.email}`}>{info.email}</a>
            </div>
          </div>
          {info.phone && (
            <div className="contact-admin__item">
              <div className="contact-admin__icon"><FiPhone /></div>
              <div className="contact-admin__content">
                <h4>Telefon</h4>
                <a href={`tel:${info.phone}`}>{info.phone}</a>
              </div>
            </div>
          )}
          {info.location && (
            <div className="contact-admin__item">
              <div className="contact-admin__icon"><FiMapPin /></div>
              <div className="contact-admin__content">
                <h4>Məkan</h4>
                <p>{info.location}</p>
              </div>
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title="Əlaqə Məlumatlarını Redaktə et"
      >
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label className="form-group__label">Email</label>
            <input
              type="email"
              className="form-control form-group__input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-group__label">Telefon</label>
            <input
              type="tel"
              className="form-control form-group__input"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-group__label">Məkan</label>
            <input
              type="text"
              className="form-control form-group__input"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={closeModal}>
              <FaTimes />
              Ləğv et
            </button>
            <button type="submit" className="btn-primary">
              <FiSave />
              Yadda saxla
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ContactAdmin;
