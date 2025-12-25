// src/utils/constants.js
export const ITEMS_PER_PAGE = 6;

export const EMPLOYMENT_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'self-employed', label: 'Self-employed' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' }
];

export const EXPERIENCE_TYPES = [
  { value: 'work', label: 'Work' },
  { value: 'intern', label: 'Internship' },
  { value: 'volunteer', label: 'Volunteer' }
];

export const LANGUAGE_LEVELS = [
  { value: 'native', label: 'Native' },
  { value: 'fluent', label: 'Fluent' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'beginner', label: 'Beginner' }
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