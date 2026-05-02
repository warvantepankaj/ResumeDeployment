import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Resume APIs
export const resumeAPI = {
  create: (data) => api.post('/resumes', data),
  getAll: () => api.get('/resumes'),
  getOne: (id) => api.get(`/resumes/${id}`),
  update: (id, data) => api.put(`/resumes/${id}`, data),
  delete: (id) => api.delete(`/resumes/${id}`),
  downloadDocx: (id) => api.get(`/resumes/${id}/download/docx`, { responseType: 'blob' }),
  downloadPdf: (id) => api.get(`/resumes/${id}/download/pdf`, { responseType: 'blob' }),
  parse: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/resumes/parse', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Score APIs
export const scoreAPI = {
  scoreFile: (file, jobDescription) => {
    const formData = new FormData();
    formData.append('file', file);
    if (jobDescription) formData.append('job_description', jobDescription);
    return api.post('/score', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  scoreFromDB: (resumeId, jobDescription) =>
    api.post(`/score/from-db/${resumeId}`, { job_description: jobDescription }),
  parseForScoring: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/score/parse-for-scoring', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default api;
