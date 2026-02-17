import api from './api';

const API_URL = '/tasks';

// Create new task
const createTask = async (taskData) => {
  const response = await api.post(API_URL, taskData);
  return response.data;
};

// Get user tasks with optional search and filter
const getTasks = async (search, status) => {
  const params = {};
  if (search) params.search = search;
  if (status) params.status = status;
  const response = await api.get(API_URL, { params });
  return response.data;
};

// Update task
const updateTask = async (taskId, taskData) => {
  const response = await api.put(API_URL + '/' + taskId, taskData);
  return response.data;
};

// Delete task
const deleteTask = async (taskId) => {
  const response = await api.delete(API_URL + '/' + taskId);
  return response.data;
};

const taskService = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};

export default taskService;
