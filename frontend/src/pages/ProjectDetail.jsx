import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import Input from '../components/Input';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import { getErrorMessage } from '../utils/errors';

const emptyTask = { title: '', description: '', status: 'todo', priority: 'medium', deadline: '' };

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [taskForm, setTaskForm] = useState(emptyTask);
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [projRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}/`),
        api.get('/tasks/', { params: { project: id } }),
      ]);
      setProject(projRes.data);
      setTasks(tasksRes.data.results || tasksRes.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleDeleteProject = async () => {
    if (!window.confirm('Delete this project?')) return;
    await api.delete(`/projects/${id}/`);
    navigate('/projects');
  };

  const handleSaveTask = async (e) => {
    e.preventDefault();
    if (!taskForm.title.trim()) return;
    const payload = { ...taskForm, project: Number(id) };
    if (!payload.deadline) delete payload.deadline;
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}/`, payload);
      } else {
        await api.post('/tasks/', payload);
      }
      setTaskForm(emptyTask);
      setEditingTask(null);
      setShowForm(false);
      fetchData();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      deadline: task.deadline || '',
    });
    setShowForm(true);
  };

  const handleDeleteTask = async (task) => {
    if (!window.confirm('Delete this task?')) return;
    await api.delete(`/tasks/${task.id}/`);
    fetchData();
  };

  if (loading) return <><Navbar /><Loader /></>;
  if (!project) return <><Navbar /><p className="p-8 text-red-400">{error || 'Project not found'}</p></>;

  return (
    <div className="devboard-page">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="devboard-heading text-2xl font-bold">{project.title}</h1>
            <span className="devboard-badge mt-2 inline-block">
              {project.status}
            </span>
          </div>
          <div className="flex gap-2">
            <Link to={`/projects/${id}/edit`}><Button variant="secondary">Edit</Button></Link>
            <Button variant="danger" onClick={handleDeleteProject}>Delete</Button>
          </div>
        </div>

        <p className="mt-4 devboard-muted">{project.description}</p>

        {project.tech_stack_list?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tech_stack_list.map((t) => (
              <span key={t} className="devboard-tag">{t}</span>
            ))}
          </div>
        )}

        <div className="mt-4 flex gap-4 text-sm">
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
              GitHub
            </a>
          )}
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
              Live Demo
            </a>
          )}
        </div>

        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="devboard-heading text-lg font-semibold">Tasks</h2>
            <Button onClick={() => { setShowForm(!showForm); setEditingTask(null); setTaskForm(emptyTask); }}>
              {showForm ? 'Cancel' : 'Add Task'}
            </Button>
          </div>

          {showForm && (
            <form onSubmit={handleSaveTask} className="devboard-card mt-4 p-4">
              <Input label="Title" value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} />
              <div className="mb-4">
                <label className="devboard-label">Description</label>
                <textarea
                  className="devboard-textarea"
                  rows={2}
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="devboard-label">Status</label>
                  <select className="devboard-select" value={taskForm.status} onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}>
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
                <div>
                  <label className="devboard-label">Priority</label>
                  <select className="devboard-select" value={taskForm.priority} onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <Input label="Deadline" type="date" value={taskForm.deadline} onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })} />
              </div>
              <Button type="submit" className="mt-2">{editingTask ? 'Update Task' : 'Create Task'}</Button>
            </form>
          )}

          {tasks.length === 0 ? (
            <EmptyState title="No tasks" description="Add tasks to track your project progress." />
          ) : (
            <div className="mt-4 space-y-3">
              {tasks.map((t) => (
                <TaskCard key={t.id} task={t} onEdit={handleEditTask} onDelete={handleDeleteTask} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
