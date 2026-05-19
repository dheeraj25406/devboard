import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/errors';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!form.username.trim()) {
      setErrors({ username: 'Username is required' });
      return;
    }
    if (!form.password) {
      setErrors({ password: 'Password is required' });
      return;
    }
    setLoading(true);
    try {
      await login(form.username, form.password);
      navigate('/dashboard');
    } catch (err) {
      setErrors({ general: getErrorMessage(err, 'Invalid username or password.') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="devboard-page flex items-center justify-center px-4">
      <div className="devboard-panel w-full max-w-md p-8">
        <h1 className="devboard-heading text-center text-2xl font-bold">
          Dev<span className="text-indigo-400">Board</span>
        </h1>
        <p className="mt-2 text-center text-sm devboard-muted">Sign in to your account</p>
        <form onSubmit={handleSubmit} className="mt-8">
          {errors.general && (
            <div className="mb-4 rounded-lg bg-red-900/30 px-3 py-2 text-sm text-red-300">
              {errors.general}
            </div>
          )}
          <Input
            label="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            error={errors.username}
            autoComplete="username"
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
            autoComplete="current-password"
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm devboard-muted">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-indigo-400 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
