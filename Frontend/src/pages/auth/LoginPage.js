import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { LogIn, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ usernameOrEmail: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.fullName || user.username}!`);
      const role = user.role;
      if (role === 'MANAGER') navigate('/manager/dashboard');
      else if (role === 'TEAM_LEAD') navigate('/teamlead/dashboard');
      else navigate('/member/tasks');
    } catch (err) {
      if (err.response) {
        toast.error(err.response?.data?.message || 'Invalid credentials');
      } else {
        toast.error(err.message === 'Network Error' 
           ? 'Network Error: The server might be waking up (can take 50s). Please wait and try again.' 
           : err.message || 'Network Error: Cannot reach server', { duration: 6000 });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="logo">Team<span>Flow</span></div>
          <p>Collaborate. Manage. Deliver.</p>
        </div>

        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username or Email</label>
            <input
              className="form-input"
              placeholder="Enter your username"
              value={form.usernameOrEmail}
              onChange={e => setForm({ ...form, usernameOrEmail: e.target.value })}
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="form-input"
                type={showPw ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                style={{ paddingRight: 42 }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button className="btn btn-primary w-full" style={{ marginTop: 8, justifyContent: 'center', height: 44 }} disabled={loading}>
            <LogIn size={16} />
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#64748b' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#6366f1', fontWeight: 600 }}>Register</Link>
        </p>

        <div style={{ marginTop: 24, padding: 14, background: '#f8fafc', borderRadius: 10, fontSize: 12, color: '#64748b' }}>
          <strong>Demo accounts:</strong><br />
          Manager: admin / admin123<br />
          Team Lead: teamlead / pass123<br />
          Member: member / pass123
        </div>
      </div>
    </div>
  );
}
