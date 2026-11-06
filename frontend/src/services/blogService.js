import api from './api';

export const getBlogs = async (params = {}) => {
  const response = await api.get('/blogs', { params });
  return response.data;
};

export const getBlogBySlug = async (slug) => {
  const response = await api.get(`/blogs/${slug}`);
  return response.data;
};

export const createBlog = async (formData) => {
  // If formData is FormData instance, send multipart
  const isMultipart = formData instanceof FormData;
  const response = await api.post('/blogs', formData, {
    headers: isMultipart ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return response.data;
};

export const updateBlog = async (id, formData) => {
  const isMultipart = formData instanceof FormData;
  const response = await api.put(`/blogs/${id}`, formData, {
    headers: isMultipart ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return response.data;
};

export const deleteBlog = async (id) => {
  const response = await api.delete(`/blogs/${id}`);
  return response.data;
};

export const toggleLike = async (id) => {
  const response = await api.post(`/blogs/${id}/like`);
  return response.data;
};

export const getMyPosts = async (params = {}) => {
  const response = await api.get('/blogs/my-posts', { params });
  return response.data;
};

export const getTrendingBlogs = async () => {
  const response = await api.get('/blogs/trending');
  return response.data;
};

export const getFeaturedBlogs = async () => {
  const response = await api.get('/blogs/featured');
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/blogs/stats/dashboard');
  return response.data;
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/blogs/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

