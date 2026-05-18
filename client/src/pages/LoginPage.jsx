// Login page with register/login toggle
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineOfficeBuilding, HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '' });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
        toast.success('Welcome back! 🎉');
      } else {
        await register(form.name, form.email, form.password, form.company);
        toast.success('Account created! Welcome to PerformAI 🚀');
      }
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: theme === 'dark'
        ? 'linear-gradient(135deg, #0b1120 0%, #1e1b4b 50%, #0f172a 100%)'
        : 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 50%, #f8fafc 100%)',
      padding: '20px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Animated background orbs */}
      <div style={{
        position: 'absolute', width: '400px', height: '400px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent)',
        top: '-100px', right: '-100px', animation: 'float 6s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', width: '300px', height: '300px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.1), transparent)',
        bottom: '-50px', left: '-50px', animation: 'float 8s ease-in-out infinite reverse',
      }} />

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        style={{
          position: 'absolute', top: '20px', right: '20px',
          background: 'var(--glass-bg)', backdropFilter: 'blur(12px)',
          border: '1px solid var(--glass-border)', borderRadius: '12px',
          padding: '12px', cursor: 'pointer', color: 'var(--text-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 10,
        }}
      >
        {theme === 'dark' ? <HiOutlineSun size={20} /> : <HiOutlineMoon size={20} />}
      </button>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%', maxWidth: '440px',
          background: 'var(--glass-bg)', backdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          borderRadius: '24px', padding: '40px',
          boxShadow: '0 20px 60px var(--shadow-color)',
          position: 'relative', zIndex: 5,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', fontSize: '24px', fontWeight: '800', color: '#fff',
            boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
          }}>
            P
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '4px' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            {isLogin ? 'Sign in to your PerformAI account' : 'Get started with AI-powered performance analytics'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <HiOutlineUser size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="form-input" style={{ paddingLeft: '42px' }} type="text" placeholder="John Doe"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required={!isLogin} />
              </div>
            </motion.div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <HiOutlineMail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="form-input" style={{ paddingLeft: '42px' }} type="email" placeholder="you@company.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <HiOutlineLockClosed size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="form-input" style={{ paddingLeft: '42px' }} type="password" placeholder="••••••••"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
            </div>
          </div>

          {!isLogin && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="form-group">
              <label className="form-label">Company (Optional)</label>
              <div style={{ position: 'relative' }}>
                <HiOutlineOfficeBuilding size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="form-input" style={{ paddingLeft: '42px' }} type="text" placeholder="Your Company"
                  value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
              </div>
            </motion.div>
          )}

          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}
            style={{ width: '100%', marginTop: '8px', fontSize: '15px' }}>
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />
                {isLogin ? 'Signing in...' : 'Creating account...'}
              </span>
            ) : (
              isLogin ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#6366f1', fontWeight: '600', fontSize: '14px',
              }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        {/* Demo Credentials */}
        {isLogin && (
          <div style={{
            marginTop: '20px', padding: '14px 18px',
            background: 'rgba(99,102,241,0.08)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '12px',
          }}>
            <p style={{ fontSize: '12px', fontWeight: '700', color: '#6366f1', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Demo Credentials
            </p>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Email: <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>admin@performai.com</span><br />
              Password: <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Admin@123</span>
            </p>
          </div>
        )}

      </motion.div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
