// src/pages/admin/ProfileAdmin.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {FaSave, FaFilePdf, FaTrash } from 'react-icons/fa';
import { fetchProfile, updateProfile } from '../../redux/slices/profileSlice';
import { uploadFile, deleteFile, validateFile } from '../../utils/fileUpload';
import { toast } from 'react-toastify';
import { CgArrowsExchange } from 'react-icons/cg';
import { GoUpload } from 'react-icons/go';

const ProfileAdmin = () => {
  const dispatch = useDispatch();
  const { data: profile, loading } = useSelector((state) => state.profile);

  const [formData, setFormData] = useState({
    id: null,
    full_name: '',
    headline: '',
    about: '',
    profile_image: '',
    cv_file: ''
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [imageProgress, setImageProgress] = useState(0);
  const [cvProgress, setCvProgress] = useState(0);
  const imageTickerRef = useRef(null);
  const cvTickerRef = useRef(null);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        id: profile.id,
        full_name: profile.full_name || '',
        headline: profile.headline || '',
        about: profile.about || '',
        profile_image: profile.profile_image || '',
        cv_file: profile.cv_file || ''
      });
      setImagePreview(profile.profile_image);
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      validateFile(file, { maxSize: 5 * 1024 * 1024 });
      setUploadingImage(true);
      setImageProgress(0);
      if (imageTickerRef.current) clearInterval(imageTickerRef.current);
      imageTickerRef.current = setInterval(() => {
        setImageProgress((p) => (p < 95 ? Math.min(95, p + Math.floor(Math.random() * 12) + 3) : p));
      }, 120);

      // Delete old image if exists
      if (formData.profile_image) {
        const oldPath = formData.profile_image.split('/').slice(-2).join('/');
        await deleteFile('profile-images', oldPath);
      }

      // Upload new image
      const { url } = await uploadFile(file, 'profile-images', 'avatars');
      
      setFormData(prev => ({ ...prev, profile_image: url }));
      const img = new Image();
      img.onload = () => {
        setImagePreview(url);
        setImageProgress(100);
        if (imageTickerRef.current) clearInterval(imageTickerRef.current);
        setUploadingImage(false);
        toast.success('Şəkil yükləndi');
      };
      img.onerror = () => {
        if (imageTickerRef.current) clearInterval(imageTickerRef.current);
        setUploadingImage(false);
        setImageProgress(0);
        toast.error('Şəkil yüklənərkən xəta baş verdi');
      };
      img.src = url;
    } catch (error) {
      toast.error(error.message || 'Şəkil yüklənərkən xəta baş verdi');
    } finally {
      // handled in onload/onerror
    }
  };

  const handleCVChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      if (file.type !== 'application/pdf') {
        throw new Error('Yalnız PDF formatı qəbul edilir');
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error('CV fayl ölçüsü 10MB-dan böyük ola bilməz');
      }

      setUploadingCv(true);
      setCvProgress(0);
      if (cvTickerRef.current) clearInterval(cvTickerRef.current);
      cvTickerRef.current = setInterval(() => {
        setCvProgress((p) => (p < 95 ? Math.min(95, p + Math.floor(Math.random() * 12) + 3) : p));
      }, 120);

      // Delete old CV if exists
      if (formData.cv_file) {
        const oldPath = formData.cv_file.split('/').slice(-2).join('/');
        await deleteFile('cv-files', oldPath);
      }

      // Upload new CV
      const { url } = await uploadFile(file, 'cv-files', 'resumes');
      
      setFormData(prev => ({ ...prev, cv_file: url }));
      setCvProgress(100);
      if (cvTickerRef.current) clearInterval(cvTickerRef.current);
      setUploadingCv(false);
      toast.success('CV yükləndi');
    } catch (error) {
      toast.error(error.message || 'CV yüklənərkən xəta baş verdi');
    } finally {
      // handled above
    }
  };

  const handleDeleteImage = async () => {
    if (!formData.profile_image) return;

    try {
      const path = formData.profile_image.split('/').slice(-2).join('/');
      await deleteFile('profile-images', path);
      
      setFormData(prev => ({ ...prev, profile_image: '' }));
      setImagePreview(null);
      toast.success('Şəkil silindi');
    } catch {
      toast.error('Şəkil silinərkən xəta baş verdi');
    }
  };

  const handleDeleteCV = async () => {
    if (!formData.cv_file) return;

    try {
      const path = formData.cv_file.split('/').slice(-2).join('/');
      await deleteFile('cv-files', path);
      
      setFormData(prev => ({ ...prev, cv_file: '' }));
      toast.success('CV silindi');
    } catch (error) {
      toast.error('CV silinərkən xəta baş verdi');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.full_name.trim()) {
      toast.error('Ad və soyad daxil edin');
      return;
    }

    try {
      await dispatch(updateProfile(formData)).unwrap();
      toast.success('Profil yeniləndi');
    } catch (error) {
  console.error('UPDATE PROFILE ERROR:', error);
  toast.error(
    error?.message ||
    error?.error ||
    'Profil yenilənərkən xəta baş verdi'
  );
}
  };

  return (
    <div className="profile-admin">
      <div className="profile-admin__header">
        <h1 className="profile-admin__title">Profil Parametrləri</h1>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        {/* Profile Image */}
        <div className='section-fl'>
          <div className="profile-form__section image">
          
          <div className="image-upload">
          <h2 className="profile-form__section-title">Profil Şəkli</h2>
            {imagePreview ? (
              <div className="image-upload__preview">
                <img src={imagePreview} alt="Profile" />
                {uploadingImage && (
                  <div className="image-upload__progress">
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
                            strokeDashoffset: (2 * Math.PI * 54) * (1 - imageProgress / 100)
                          }}
                        />
                      </svg>
                      <div className="upload-circular__text">{imageProgress}%</div>
                    </div>
                  </div>
                )}
                <div className="image-upload__overlay">
                  <label className="image-upload__btn btn-sm">
                    <GoUpload />
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      disabled={uploadingImage}
                    />
                  </label>
                  <div 
                    type="button"
                    className="image-upload__btn image-upload__btn--danger btn-sm"
                    onClick={handleDeleteImage}
                    disabled={uploadingImage}
                  >
                    <FaTrash />
                  </div>
                </div>
              </div>
            ) : (
              <label className="image-upload__placeholder">
                <GoUpload />
                <span>Şəkil yükləyin</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  disabled={uploadingImage}
                />
                {uploadingImage && (
                  <div className="image-upload__progress">
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
                            strokeDashoffset: (2 * Math.PI * 54) * (1 - imageProgress / 100)
                          }}
                        />
                      </svg>
                      <div className="upload-circular__text">{imageProgress}%</div>
                    </div>
                  </div>
                )}
              </label>
            )}
          </div>
          
          
          
          
        </div>
        <div className="profile-form__section cv">
        <h2 className="profile-form__section-title">CV (Resume)</h2>
          {formData.cv_file ? (
            <div className="cv-uploaded">
            
              <div className="cv-uploaded__info">
                <FaFilePdf className="cv-uploaded__icon" />
                <div>
                  <p className="cv-uploaded__name">CV yüklənib</p>
                  <a 
                    href={formData.cv_file} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="cv-uploaded__link"
                  >
                    Baxmaq və ya yükləmək
                  </a>
                </div>
              </div>
              <div className="cv-uploaded__actions">
                <label className="btn-secondary btn-sm">
                  <GoUpload size={20} />
                  <span>Dəyişdir</span>
                  <input 
                    type="file" 
                    accept=".pdf" 
                    onChange={handleCVChange}
                    disabled={uploadingCv}
                  />
                </label>
                <button 
                  type="button"
                  className="btn-danger btn-sm"
                  onClick={handleDeleteCV}
                  disabled={uploadingCv}
                >
                  <FaTrash />
                  <span>Sil</span>
                </button>
              </div>
              {uploadingCv && (
                <div className="cv-uploaded__progress">
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
                          strokeDashoffset: (2 * Math.PI * 54) * (1 - cvProgress / 100)
                        }}
                      />
                    </svg>
                    <div className="upload-circular__text">{cvProgress}%</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <label className="cv-upload">
              <FaFilePdf />
              <span>CV yükləyin (PDF)</span>
              <input 
                type="file" 
                accept=".pdf" 
                onChange={handleCVChange}
                disabled={uploadingCv}
              />
              {uploadingCv && (
                <div className="cv-uploaded__progress">
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
                          strokeDashoffset: (2 * Math.PI * 54) * (1 - cvProgress / 100)
                        }}
                      />
                    </svg>
                    <div className="upload-circular__text">{cvProgress}%</div>
                  </div>
                </div>
              )}
            </label>
          )}
        </div>
        </div>
        

        {/* Basic Info */}
        <div className="profile-form__section">
          <h2 className="profile-form__section-title">Əsas Məlumatlar</h2>
          
          <div className="form-group">
            <label className="form-group__label">
              Ad və Soyad <span className="required">*</span>
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="form-group__input"
              placeholder="Adınız və Soyadınız"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-group__label">
              Başlıq
            </label>
            <input
              type="text"
              name="headline"
              value={formData.headline}
              onChange={handleChange}
              className="form-group__input"
              placeholder="Məsələn: Full Stack Developer"
            />
          </div>

          <div className="form-group">
            <label className="form-group__label">
              Haqqımda
            </label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              className="form-group__textarea"
              rows="6"
              placeholder="Özünüz haqqında məlumat yazın..."
            />
          </div>
        </div>

        {/* CV Upload */}
        

        {/* Submit Button */}
        <div className="profile-form__actions">
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading || uploadingImage || uploadingCv}
          >
            <FaSave />
            <span>{loading ? 'Yadda saxlanılır...' : 'Yadda saxla'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileAdmin;
