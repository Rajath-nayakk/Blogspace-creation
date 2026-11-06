import api from './api';

export const getComments = async (blogId) => {
  const response = await api.get(`/comments/${blogId}`);
  return response.data;
};

export const createComment = async (blogId, content) => {
  const response = await api.post(`/comments/${blogId}`, { content });
  return response.data;
};

export const updateComment = async (commentId, content) => {
  const response = await api.put(`/comments/${commentId}`, { content });
  return response.data;
};

export const deleteComment = async (commentId) => {
  const response = await api.delete(`/comments/${commentId}`);
  return response.data;
};

