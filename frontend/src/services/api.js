import axios from 'axios';

const normalizeApiBaseUrl = (rawUrl) => {
  const fallback = 'http://localhost:5000/api';
  const url = (rawUrl || fallback).trim().replace(/\/+$/, '');
  return url.endsWith('/api') ? url : `${url}/api`;
};

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

// Projects API
export const projectsAPI = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (projectData) => api.post('/projects', projectData),
  update: (id, projectData) => api.put(`/projects/${id}`, projectData),
  delete: (id) => api.delete(`/projects/${id}`),
};

// Tasks API
export const tasksAPI = {
  getAll: (params) => api.get('/tasks', params ? { params } : undefined),
  getById: (id) => api.get(`/tasks/${id}`),
  // Prefer getAll({ project: projectId }) since backend supports query params
  getByProject: (projectId) => api.get('/tasks', { params: { project: projectId } }),
  create: (taskData) => api.post('/tasks', taskData),
  update: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  move: (id, status) => api.patch(`/tasks/${id}/move`, { status }),
  delete: (id) => api.delete(`/tasks/${id}`),
};

// Todos API
export const todosAPI = {
  getAll: () => api.get('/todos'),
  getById: (id) => api.get(`/todos/${id}`),
  create: (todoData) => api.post('/todos', todoData),
  update: (id, todoData) => api.put(`/todos/${id}`, todoData),
  delete: (id) => api.delete(`/todos/${id}`),
};

// Time Entries API
export const timeEntriesAPI = {
  getAll: (params) => api.get('/time-entries', params ? { params } : undefined),
  getById: (id) => api.get(`/time-entries/${id}`),
  create: (entryData) => api.post('/time-entries', entryData),
  update: (id, entryData) => api.put(`/time-entries/${id}`, entryData),
  delete: (id) => api.delete(`/time-entries/${id}`),
};

// Timetable API
export const timetableAPI = {
  getWeek: (weekStart) => api.get('/timetable', { params: { weekStart } }),
  createRow: (row) => api.post('/timetable', row),
  updateRow: (id, patch) => api.put(`/timetable/${id}`, patch),
  deleteRow: (id) => api.delete(`/timetable/${id}`),
};

export default api;
