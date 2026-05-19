import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Button from '../components/Button';
import Input from '../components/Input';
import Loader from '../components/Loader';
import Navbar from '../components/Navbar';
import { getErrorMessage } from '../utils/errors';

export default function GitHubImport() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(null);
  const [error, setError] = useState('');

  const fetchRepos = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('GitHub username is required');
      return;
    }
    setLoading(true);
    setError('');
    setRepos([]);
    try {
      const { data } = await api.get('/github/repos/', { params: { username: username.trim() } });
      setRepos(data.repos || []);
      if (!data.repos?.length) setError('No public repositories found for this user.');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to fetch GitHub repositories.'));
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (repo) => {
    setImporting(repo.name);
    setError('');
    try {
      const { data } = await api.post('/github/import/', {
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        language: repo.language,
        stars: repo.stars,
        forks: repo.forks,
      });
      navigate(`/projects/${data.id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setImporting(null);
    }
  };

  return (
    <div className="devboard-page">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <h1 className="devboard-heading text-2xl font-bold">Import from GitHub</h1>
        <p className="mt-2 devboard-muted">Fetch public repositories and import them as DevBoard projects.</p>

        <form onSubmit={fetchRepos} className="mt-8 flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <Input
              label="GitHub Username"
              placeholder="octocat"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex items-end pb-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Fetching...' : 'Fetch Repos'}
            </Button>
          </div>
        </form>

        {error && <p className="text-red-400">{error}</p>}
        {loading && <Loader message="Fetching repositories from GitHub..." />}

        {!loading && repos.length > 0 && (
          <div className="mt-8 space-y-3">
            {repos.map((repo) => (
              <div key={repo.html_url} className="devboard-card flex flex-wrap items-center justify-between gap-4 p-4">
                <div>
                  <h3 className="devboard-heading font-semibold">{repo.name}</h3>
                  <p className="text-sm devboard-muted">{repo.description || 'No description'}</p>
                  <div className="mt-2 flex gap-3 text-xs devboard-dim">
                    {repo.language && <span>{repo.language}</span>}
                    <span>★ {repo.stars}</span>
                    <span>⑂ {repo.forks}</span>
                  </div>
                </div>
                <Button
                  onClick={() => handleImport(repo)}
                  disabled={importing === repo.name}
                >
                  {importing === repo.name ? 'Importing...' : 'Import'}
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
