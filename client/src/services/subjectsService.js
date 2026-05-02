import api from './api';

export const getSubjects = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.branch) params.append('branch', filters.branch);
  if (filters.year) params.append('year', filters.year);
  if (filters.semester) params.append('semester', filters.semester);
  
  const response = await api.get(`/subjects/all?${params.toString()}`);
  return response.data;
};

export const createSubject = async (subjectData) => {
  const response = await api.post('/subjects', subjectData);
  return response.data;
};

export const updateSubject = async (id, subjectData) => {
  const response = await api.patch(`/subjects/${id}`, subjectData);
  return response.data;
};

export const deleteSubject = async (id) => {
  const response = await api.delete(`/subjects/${id}`);
  return response.data;
};
