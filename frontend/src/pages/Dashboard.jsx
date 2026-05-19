import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Button from '../components/Button';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import ProjectCard from '../components/ProjectCard';
import StatCard from '../components/StatCard';
import { getErrorMessage } from '../utils/errors';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, projectsRes] = await Promise.all([
          api.get('/dashboard/stats/'),
          api.get('/projects/?status=building'),
        ]);
        setStats(statsRes.data);
        setProjects(projectsRes.data.results || projectsRes.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <><Navbar /><Loader /></>;

  return (
    <div className="devboard-page">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex items-center justify-between">
          <h1 className="devboard-heading text-2xl font-bold">Dashboard</h1>
          <Link to="/projects/new"><Button>New Project</Button></Link>
        </div>

        {error && <p className="mt-4 text-red-400">{error}</p>}

        {stats && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Projects" value={stats.total_projects} />
            <StatCard label="Completed" value={stats.completed_projects} />
            <StatCard label="Building" value={stats.building_projects} />
            <StatCard label="Total Tasks" value={stats.total_tasks} />
            <StatCard label="Completed Tasks" value={stats.completed_tasks} />
            <StatCard label="Pending Tasks" value={stats.pending_tasks} />
            <StatCard label="High Priority" value={stats.high_priority_tasks} />
          </div>
        )}

        <section className="mt-12">
          <h2 className="devboard-heading text-lg font-semibold">Projects In Progress</h2>
          {projects.length === 0 ? (
            <p className="mt-4 devboard-muted">No building projects. Start one today!</p>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
