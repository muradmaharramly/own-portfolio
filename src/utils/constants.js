// src/utils/constants.js
export const ITEMS_PER_PAGE = 6;

export const EMPLOYMENT_TYPES = [
  { value: 'full-time', label: 'Tam ştat' },
  { value: 'part-time', label: 'Yarım ştat' },
  { value: 'self-employed', label: 'Fərdi sahibkar' },
  { value: 'freelance', label: 'Frilans' },
  { value: 'remote', label: 'Məsafədən' },
  { value: 'contract', label: 'Müqaviləli' },
   { value: 'hybrid', label: 'Hibrid' }
];

export const EXPERIENCE_TYPES = [
  { value: 'work', label: 'İş' },
  { value: 'intern', label: 'Təcrübə' },
  { value: 'volunteer', label: 'Könüllü' }
];

export const LANGUAGE_LEVELS = [
  { value: 'native', label: 'Ana dili' },
  { value: 'fluent', label: 'Səlis' },
  { value: 'advanced', label: 'Qabaqcıl' },
  { value: 'intermediate', label: 'Orta' },
  { value: 'beginner', label: 'Başlanğıc' }
];

export const SOCIAL_MEDIA_PLATFORMS = [
  { value: 'github', label: 'GitHub', icon: 'github' },
  { value: 'linkedin', label: 'LinkedIn', icon: 'linkedin' },
  { value: 'twitter', label: 'Twitter', icon: 'twitter' },
  { value: 'instagram', label: 'Instagram', icon: 'instagram' },
  { value: 'facebook', label: 'Facebook', icon: 'facebook' },
  { value: 'youtube', label: 'YouTube', icon: 'youtube' },
  { value: 'behance', label: 'Behance', icon: 'behance' },
  { value: 'dribbble', label: 'Dribbble', icon: 'dribbble' }
];

export const FILE_SIZE_LIMITS = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  PDF: 10 * 1024 * 1024, // 10MB
};

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
export const ALLOWED_PDF_TYPE = ['application/pdf'];