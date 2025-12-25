// ============================================
// components/Home/Contact.jsx
// ============================================

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createContactMessage, fetchContactInfo } from '../../redux/slices/contactSlice';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Contact = () => {
  const dispatch = useDispatch();
  const { info: contactInfo } = useSelector((state) => state.contact);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  useEffect(() => {
    dispatch(fetchContactInfo());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Zəhmət olmasa adınızı daxil edin');
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Zəhmət olmasa düzgün e-poçt ünvanı daxil edin');
      return false;
    }
    if (!formData.subject.trim()) {
      toast.error('Zəhmət olmasa mövzu daxil edin');
      return false;
    }
    if (!formData.message.trim()) {
      toast.error('Zəhmət olmasa mesajınızı daxil edin');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await dispatch(createContactMessage(formData)).unwrap();
      toast.success('Mesaj uğurla göndərildi! Tezliklə cavab verəcəyəm.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error('Mesaj göndərilə bilmədi. Zəhmət olmasa sonra yenidən cəhd edin.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section-title">Əlaqə</h2>
          <div className="section-divider"></div>
        </motion.div>

        <div className="contact__content">
          <motion.div
            className="contact__info"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="contact__subtitle">Gəlin danışaq</h3>
            <p className="contact__text">
              Hal-hazırda yeni imkanlara və əməkdaşlıqlara açığam. 
              Sualınız varsa və ya sadəcə salam demək istəyirsinizsə, ən qısa zamanda cavab verəcəyəm.
            </p>

            <div className="contact__details">
              <div className="contact__item">
                <div className="contact__icon">
                  <FiMail />
                </div>
                <div className="contact__item-content">
                  <h4>E-poçt</h4>
                  <a href={`mailto:${contactInfo?.email || 'example@email.com'}`}>
                    {contactInfo?.email || 'example@email.com'}
                  </a>
                </div>
              </div>

              {contactInfo?.phone && (
                <div className="contact__item">
                  <div className="contact__icon">
                    <FiPhone />
                  </div>
                  <div className="contact__item-content">
                    <h4>Telefon</h4>
                    <a href={`tel:${contactInfo.phone}`}>
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>
              )}

              {contactInfo?.location && (
                <div className="contact__item">
                  <div className="contact__icon">
                    <FiMapPin />
                  </div>
                  <div className="contact__item-content">
                    <h4>Məkan</h4>
                    <p>{contactInfo.location}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            className="contact__form-wrapper"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <form className="contact__form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Adınız"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="E-poçtunuz"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  placeholder="Mövzu"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Mesajınız"
                  value={formData.message}
                  onChange={handleChange}
                  className="form-control"
                  rows="5"
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn-primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-sm"></span>
                ) : (
                  <>
                    <FiSend />
                    Mesajı göndər
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
