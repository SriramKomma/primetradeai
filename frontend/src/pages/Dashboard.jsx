import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Layout from '../components/Layout';
import Spinner from '../components/Spinner';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';
import taskService from '../services/taskService';

const Dashboard = () => {
  const { user, isLoading: authLoading, clearError } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchTasks = useCallback(async (searchQuery, statusQuery) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await taskService.getTasks(searchQuery, statusQuery);
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error fetching tasks');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      fetchTasks(debouncedSearch, statusFilter);
    }
  }, [user, fetchTasks, debouncedSearch, statusFilter]);

  const addTask = async (taskData) => {
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      setError('Failed to add task');
    }
  };

  const deleteTask = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await taskService.deleteTask(id);
        setTasks((prev) => prev.filter((task) => task._id !== id));
      } catch (err) {
        setError('Failed to delete task');
      }
    }
  };

  const updateTask = async (id, updatedData) => {
    try {
      const updatedTask = await taskService.updateTask(id, updatedData);
      setTasks((prev) => prev.map((task) => (task._id === id ? updatedTask : task)));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  if (authLoading) {
    return <Spinner fullScreen />;
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;

  const StatCard = ({ title, count, icon, colorClass, borderClass }) => (
    <div className={`bg-white rounded-xl border ${borderClass} p-5 shadow-sm hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">{count}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClass}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back, {user.name}!</h1>
        <p className="text-slate-500 mt-2 text-lg">Here's what's happening with your projects properly.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
        <StatCard
          title="Total Tasks"
          count={totalTasks}
          borderClass="border-slate-200"
          colorClass="bg-slate-100 text-slate-600"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <StatCard
          title="Pending"
          count={pendingTasks}
          borderClass="border-amber-100"
          colorClass="bg-amber-100 text-amber-600"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="In Progress"
          count={inProgressTasks}
          borderClass="border-indigo-100"
          colorClass="bg-indigo-100 text-indigo-600"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />
        <StatCard
          title="Completed"
          count={completedTasks}
          borderClass="border-emerald-100"
          colorClass="bg-emerald-100 text-emerald-600"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky top-20 z-10 transition-all duration-300">
             <div className="relative flex-1 w-full sm:w-auto">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-400 transition-shadow bg-slate-50 focus:bg-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-48 px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white cursor-pointer transition-shadow"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2 animate-fade-in">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Spinner />
              </div>
            ) : tasks.length > 0 ? (
              <div className="space-y-4 animate-fade-in">
                {tasks.map((task) => (
                  <TaskItem
                    key={task._id}
                    task={task}
                    onDelete={deleteTask}
                    onUpdate={updateTask}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 border-dashed p-12 text-center animate-fade-in h-64 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-1">No tasks found</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">
                  {search || statusFilter ? 'Try adjusting your search or filters to find what you are looking for.' : 'Get started by creating your first task using the form.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar / Add Task */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
             <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200">
                <h3 className="text-xl font-bold mb-2">Pro Tip</h3>
                <p className="text-indigo-100 text-sm leading-relaxed">
                  Break down large projects into smaller tasks to keep your momentum going visible progress is key to productivity.
                </p>
             </div>
            <TaskForm onAdd={addTask} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
