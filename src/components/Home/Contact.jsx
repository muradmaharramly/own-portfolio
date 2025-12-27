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
    sender_name: '',
    sender_email: '',
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
    if (!formData.sender_name.trim()) {
      toast.error('Please enter your name');
      return false;
    }
    if (!formData.sender_email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.sender_email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!formData.subject.trim()) {
      toast.error('Please enter a subject');
      return false;
    }
    if (!formData.message.trim()) {
      toast.error('Please enter your message');
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
      toast.success('Message sent successfully! I will reply soon.');
      setFormData({
        sender_name: '',
        sender_email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again later.');
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
          <h2 className="section-title">Contact</h2>
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
            <h3 className="contact__subtitle">Let's Talk</h3>
            <p className="contact__text">
              I am currently open to new opportunities and collaborations. If you have a question or just want to say hi, I will reply as soon as possible.
            </p>

            <div className="contact__details">
              <div className="contact__item">
                <div className="contact__icon">
                  <FiMail />
                </div>
                <div className="contact__item-content">
                  <h4>Email</h4>
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
                    <h4>Phone</h4>
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
                    <h4>Location</h4>
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
                  name="sender_name"
                  placeholder="Your Name"
                  value={formData.sender_name}
                  onChange={handleChange}
                  className="form-control"
                />
                <input
                  type="email"
                  name="sender_email"
                  placeholder="Your Email"
                  value={formData.sender_email}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Your Message"
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
                    Send Message
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
