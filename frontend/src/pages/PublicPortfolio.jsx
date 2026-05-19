import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';
import { getErrorMessage } from '../utils/errors';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export default function PublicPortfolio() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${API_BASE}/public/${username}/`)
      .then(({ data: portfolio }) => setData(portfolio))
      .catch((err) => setError(getErrorMessage(err, 'Portfolio not found.')))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return <Loader message="Loading portfolio..." />;
  if (error) {
    return (
      <div className="devboard-page flex flex-col items-center justify-center px-4">
        <p className="text-red-400">{error}</p>
        <Link to="/login" className="mt-4 text-indigo-400 hover:underline">Go to DevBoard</Link>
      </div>
    );
  }

  const fullName = [data.first_name, data.last_name].filter(Boolean).join(' ') || data.username;

  return (
    <div className="devboard-page">
      <header className="devboard-header">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <p className="text-sm text-indigo-400">@{data.username}</p>
          <h1 className="devboard-heading mt-2 text-4xl font-bold">{fullName}</h1>
          {data.bio && <p className="mt-4 max-w-2xl devboard-muted">{data.bio}</p>}
          <div className="mt-4 flex flex-wrap gap-4 text-sm devboard-muted">
            {data.location && <span>{data.location}</span>}
            {data.github_username && (
              <a href={`https://github.com/${data.github_username}`} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
                GitHub: @{data.github_username}
              </a>
            )}
            {data.website && (
              <a href={data.website} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
                Website
              </a>
            )}
          </div>
          {data.tech_stacks?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {data.tech_stacks.map((tech) => (
                <span key={tech} className="devboard-badge px-3 py-1">
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h2 className="devboard-heading text-xl font-semibold">Completed Projects</h2>
        {data.projects?.length === 0 ? (
          <p className="mt-4 devboard-muted">No completed projects to showcase yet.</p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {data.projects.map((project) => (
              <article key={project.id} className="devboard-card p-6">
                <h3 className="devboard-heading text-lg font-semibold">{project.title}</h3>
                <p className="mt-2 text-sm devboard-muted">{project.description}</p>
                {project.tech_stack_list?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {project.tech_stack_list.map((t) => (
                      <span key={t} className="devboard-tag">{t}</span>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex gap-4 text-sm">
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">GitHub</a>
                  )}
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Live Demo</a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <footer className="devboard-footer py-6 text-center text-sm devboard-dim">
        Built with <Link to="/login" className="text-indigo-400 hover:underline">DevBoard</Link>
      </footer>
    </div>
  );
}
