// src/utils/validation.js

export const validateTitle = (title) => {
  if (!title || title.trim() === '') {
    return 'Title is required';
  }
  if (title.length < 3) {
    return 'Title must be at least 3 characters long';
  }
  if (title.length > 100) {
    return 'Title must be less than 100 characters';
  }
  return '';
};

export const validateContent = (content) => {
  if (!content || content.trim() === '') {
    return 'Content is required';
  }
  if (content.length < 10) {
    return 'Content must be at least 10 characters long';
  }
  if (content.length > 1000) {
    return 'Content must be less than 1000 characters';
  }
  return '';
};