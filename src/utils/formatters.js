// src/utils/formatters.js
export const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const months = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun',
    'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'
  ];
  
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
};

export const formatDateRange = (startDate, endDate, isCurrent = false) => {
  if (isCurrent) {
    return `${formatDate(startDate)} - Davam edir`;
  }
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

export const truncateText = (text, length = 150) => {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + '...';
};

export const generateSlug = (text) => {
  const turkishMap = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
  };

  return text
    .split('')
    .map(char => turkishMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};