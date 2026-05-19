import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import Button from '../components/Button';
import Input from '../components/Input';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import { getErrorMessage } from '../utils/errors';

const emptyForm = {
  title: '',
  description: '',
  status: 'planned',
  tech_stack: '',
  github_url: '',
  live_url: '',
  primary_language: '',
};

export default function ProjectForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/projects/${id}/`)
      .then(({ data }) => setForm(data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (isEdit) {
        await api.put(`/projects/${id}/`, form);
      } else {
        await api.post('/projects/', form);
      }
      navigate('/projects');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <><Navbar /><Loader /></>;

  return (
    <div className="devboard-page">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <h1 className="devboard-heading text-2xl font-bold">{isEdit ? 'Edit Project' : 'New Project'}</h1>
        {error && <p className="mt-4 text-red-400">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-8 space-y-2">
          <Input label="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <div className="mb-4">
            <label className="devboard-label">Description</label>
            <textarea
              className="devboard-textarea"
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="devboard-label">Status</label>
            <select
              className="devboard-select"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="planned">Planned</option>
              <option value="building">Building</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <Input label="Tech Stack (comma-separated)" value={form.tech_stack} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} />
          <Input label="GitHub URL" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} />
          <Input label="Live Demo URL" value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} />
          <Input label="Primary Language" value={form.primary_language} onChange={(e) => setForm({ ...form, primary_language: e.target.value })} />
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Project'}</Button>
            <Button variant="secondary" type="button" onClick={() => navigate(-1)}>Cancel</Button>
          </div>
        </form>
      </main>
    </div>
  );
}
