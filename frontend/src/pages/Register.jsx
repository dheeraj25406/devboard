import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/errors';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (form.password !== form.password_confirm) {
      setErrors({ password_confirm: 'Passwords do not match' });
      return;
    }
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      const data = err?.response?.data;
      if (data && typeof data === 'object') {
        const fieldErrors = {};
        Object.entries(data).forEach(([k, v]) => {
          fieldErrors[k] = Array.isArray(v) ? v[0] : v;
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ general: getErrorMessage(err) });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="devboard-page flex items-center justify-center px-4 py-12">
      <div className="devboard-panel w-full max-w-md p-8">
        <h1 className="devboard-heading text-center text-2xl font-bold">Create Account</h1>
        <form onSubmit={handleSubmit} className="mt-8">
          {errors.general && (
            <div className="mb-4 rounded-lg bg-red-900/30 px-3 py-2 text-sm text-red-300">
              {errors.general}
            </div>
          )}
          <Input label="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} error={errors.username} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
          <Input label="First Name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
          <Input label="Last Name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} />
          <Input label="Confirm Password" type="password" value={form.password_confirm} onChange={(e) => setForm({ ...form, password_confirm: e.target.value })} error={errors.password_confirm} />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm devboard-muted">
          Already have an account? <Link to="/login" className="text-indigo-400 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
