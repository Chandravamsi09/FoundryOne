const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[\d\s\-()]{7,20}$/;

export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  if (!EMAIL_REGEX.test(email)) return 'Please enter a valid email address';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must contain at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
  return '';
};

export const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required';
  if (!PHONE_REGEX.test(phone.replace(/\s/g, ''))) return 'Please enter a valid phone number';
  return '';
};

export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || !value.toString().trim()) return `${fieldName} is required`;
  return '';
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return '';
};

export const validateName = (name) => {
  if (!name) return 'Full name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  return '';
};