import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import ProjectCard from '../components/ProjectCard';
import { getErrorMessage } from '../utils/errors';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', search: '', tech: '' });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;
      if (filters.tech) params.tech = filters.tech;
      const { data } = await api.get('/projects/', { params });
      setProjects(data.results || data);
    } catch (err) {
      console.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  return (
    <div className="devboard-page">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="devboard-heading text-2xl font-bold">Projects</h1>
          <Link to="/projects/new"><Button>New Project</Button></Link>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <select
            className="devboard-select"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Statuses</option>
            <option value="planned">Planned</option>
            <option value="building">Building</option>
            <option value="completed">Completed</option>
          </select>
          <input
            placeholder="Search by title..."
            className="devboard-input w-auto min-w-[200px]"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <input
            placeholder="Filter by tech..."
            className="devboard-input w-auto min-w-[160px]"
            value={filters.tech}
            onChange={(e) => setFilters({ ...filters, tech: e.target.value })}
          />
        </div>

        {loading ? (
          <Loader />
        ) : projects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            description="Create your first project or import from GitHub."
            action={<Link to="/projects/new"><Button>Create Project</Button></Link>}
          />
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </main>
    </div>
  );
}
