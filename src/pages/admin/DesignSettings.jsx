import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaPalette, FaFont, FaSave, FaUndo, FaDesktop, FaMobileAlt, FaCheck, FaPaintBrush } from 'react-icons/fa';
import { fetchDesignSettings, updateDesignSettings, previewSettings } from '../../redux/slices/designSlice';
import { toast } from 'react-toastify';
import { IoIosCheckmarkCircleOutline, IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { RxReset } from 'react-icons/rx';
import { VscSymbolColor } from 'react-icons/vsc';

const DesignSettings = () => {
  const dispatch = useDispatch();
  const { settings, loading } = useSelector((state) => state.design);
  const [localSettings, setLocalSettings] = useState(settings);
  
  useEffect(() => {
    dispatch(fetchDesignSettings());
  }, [dispatch]);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleColorChange = (key, value) => {
    const newSettings = {
      ...localSettings,
      colors: {
        ...localSettings.colors,
        [key]: value
      }
    };
    setLocalSettings(newSettings);
    dispatch(previewSettings(newSettings));
  };

  const handleFontChange = (font) => {
    const newSettings = {
      ...localSettings,
      typography: {
        ...localSettings.typography,
        fontFamily: font
      }
    };
    setLocalSettings(newSettings);
    dispatch(previewSettings(newSettings));
  };

  const handleSave = async () => {
    try {
      await dispatch(updateDesignSettings(localSettings)).unwrap();
      toast.success('Dizayn parametrləri uğurla yadda saxlanıldı!');
    } catch (error) {
      toast.error('Parametrləri yadda saxlamaq mümkün olmadı.');
    }
  };

  const handleReset = () => {
    setLocalSettings(settings);
    dispatch(previewSettings(settings));
    toast('Dəyişikliklər son yadda saxlanılan vəziyyətə qaytarıldı', { icon: '↩️' });
  };

  const fonts = [
    { name: 'Inter', value: "'Inter', sans-serif" },
    { name: 'Roboto', value: "'Roboto', sans-serif" },
    { name: 'Open Sans', value: "'Open Sans', sans-serif" },
    { name: 'Poppins', value: "'Poppins', sans-serif" },
    { name: 'Montserrat', value: "'Montserrat', sans-serif" },
    { name: 'Lato', value: "'Lato', sans-serif" },
  ];

  const colorCategories = [
    {
      title: 'Brend Rəngləri',
      description: 'Əsas brend elementləri üçün istifadə olunan rənglər.',
      items: [
        { key: 'primary', label: 'Əsas Rəng' },
        { key: 'secondary', label: 'İkinci Rəng' },
      ]
    },
    {
      title: 'Status və Vurğular',
      description: 'Vurğular, xəbərdarlıqlar və aksentlər üçün istifadə olunan rənglər.',
      items: [
        { key: 'accent', label: 'Vurğu Rəngi' },
      ]
    }
  ];

  return (
    <div className="design-settings-container">
      {/* Header */}
      <div className="settings-header">
        <div>
          <h1>
            Dizayn Sistemi
          </h1>
          <p>
            Portfelinizin görünüşünü və hissini real vaxt rejimində fərdiləşdirin.
          </p>
        </div>
        <div className="header-actions">
          <button
            onClick={handleReset}
            className="btn-reset"
          >
            <RxReset />

            <span>Sıfırla</span>
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="btn-save"
          >
            {loading ? (
              <span className="spinner-xs" />
            ) : (
              <IoMdCheckmarkCircleOutline />
            )}
            <span>Yadda Saxla</span>
          </button>
        </div>
      </div>

      <div className="settings-grid">
        {/* Settings Panel */}
        <div className="settings-panel">
          
          {/* Colors Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="settings-card"
          >
            <div className="card-header">
              <div className="icon-box colors-icon">
                <VscSymbolColor />
              </div>
              <h2>
                Rəng Palitrası
                <span className="subtitle">Brendinizin vizual kimliyini təyin edin</span>
              </h2>
            </div>

            <div className="card-content">
              {colorCategories.map((category, idx) => (
                <div key={idx} className="color-section">
                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                  <div className="color-grid">
                    {category.items.map((item) => (
                      <div key={item.key} className="color-item group">
                        <div className="color-preview">
                          <div 
                             style={{ 
                               position: 'absolute', 
                               top: 0, 
                               left: 0, 
                               width: '100%', 
                               height: '100%', 
                               backgroundColor: localSettings.colors?.[item.key] || '#000000',
                               pointerEvents: 'none'
                             }} 
                          />
                          <input
                            type="color"
                            value={localSettings.colors?.[item.key] || '#000000'}
                            onChange={(e) => handleColorChange(item.key, e.target.value)}
                          />
                        </div>
                        <div className="color-info">
                          <label>{item.label}</label>
                          <div className="color-value">
                            {localSettings.colors?.[item.key]}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Typography Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="settings-card"
          >
            <div className="card-header">
              <div className="icon-box typography-icon">
                <FaFont />
              </div>
              <h2>
                Tipoqrafiya
                <span className="subtitle">Əsas şrifti seçin</span>
              </h2>
            </div>

            <div className="typography-grid">
              {fonts.map((font) => (
                <button
                  key={font.name}
                  onClick={() => handleFontChange(font.value)}
                  className={`font-option ${
                    localSettings.typography?.fontFamily === font.value ? 'active' : ''
                  }`}
                >
                  <div className="font-preview">
                    <span style={{ fontFamily: font.value }}>Aa</span>
                    {localSettings.typography?.fontFamily === font.value && (
                      <div className="check-icon">
                        <FaCheck />
                      </div>
                    )}
                  </div>
                  <p className="font-name">{font.name}</p>
                  <p className="font-sample" style={{ fontFamily: font.value }}>
                    Zəfər, jaketini dəyiş, boz rəng al.
                  </p>
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Live Preview Panel - Sticky */}
        <div className="preview-panel">
          <div className="preview-box">
            <div className="browser-bar">
              <div className="dots">
                <div />
                <div />
                <div />
              </div>
              <div className="url-bar">
                your-portfolio.com
              </div>
            </div>

            <div className="preview-content" style={{ 
              fontFamily: localSettings.typography?.fontFamily,
            }}>
              {/* Hero Preview */}
              <div className="mock-hero">
                <span className="badge">
                  İş təklifləri üçün açıq
                </span>
                <h3>
                  Kreativ <span>Developer</span>
                </h3>
                <p>
                  Rəqəmsal məhsullar, brendlər və təcrübələr qurur.
                </p>
                <div className="actions">
                  <button className="primary">
                    Əlaqə
                  </button>
                  <button className="secondary">
                    İşlərim
                  </button>
                </div>
              </div>

              {/* Card Preview */}
              <div className="mock-cards">
                <div className="mock-card">
                  <div className="icon desktop">
                    <FaDesktop />
                  </div>
                  <h4>Veb Dizayn</h4>
                  <p>Müasir və Adaptiv</p>
                </div>
                <div className="mock-card">
                  <div className="icon mobile">
                    <FaMobileAlt />
                  </div>
                  <h4>Mobil Tətbiq</h4>
                  <p>iOS və Android</p>
                </div>
              </div>

              {/* Color Swatches Mini */}
              <div className="theme-summary">
                <p>Aktiv Mövzu</p>
                <div className="swatches">
                  {Object.entries(localSettings.colors || {}).map(([key, value]) => (
                    <div key={key} className="swatch-item">
                      <div 
                        className="circle"
                        style={{ backgroundColor: value }}
                      />
                      <span>{key}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="pro-tip">
            <h4>Tövsiyə</h4>
            <p>
              Dəyişikliklər real vaxt rejimində göstərilir, lakin "Yadda Saxla" düyməsini klikləyənə qədər ziyarətçilərə görünməyəcək.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignSettings;
