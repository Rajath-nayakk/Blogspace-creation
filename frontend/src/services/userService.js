import api from './api';

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const updateProfile = async (formData) => {
  const isMultipart = formData instanceof FormData;
  const response = await api.put('/users/profile', formData, {
    headers: isMultipart ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return response.data;
};

export const getUserPosts = async (id, params = {}) => {
  const response = await api.get(`/users/${id}/posts`, { params });
  return response.data;
};

export const getPopularAuthors = async () => {
  const response = await api.get('/users/popular-authors');
  return response.data;
};

