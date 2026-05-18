// Top navbar component
import { useTheme } from '../context/ThemeContext';
import { HiOutlineSun, HiOutlineMoon, HiOutlineBell } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 32px',
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky', top: 0, zIndex: 50,
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-primary)' }}>
          Welcome back, <span style={{ color: '#6366f1' }}>{user?.name?.split(' ')[0] || 'Manager'}</span> 👋
        </h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Notifications */}
        <button
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '10px', borderRadius: '10px', color: 'var(--text-secondary)',
            position: 'relative', transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.background = 'var(--bg-tertiary)'}
          onMouseLeave={(e) => e.target.style.background = 'none'}
        >
          <HiOutlineBell size={20} />
          <span style={{
            position: 'absolute', top: '6px', right: '6px',
            width: '8px', height: '8px', borderRadius: '50%',
            background: '#ef4444', border: '2px solid var(--bg-secondary)'
          }} />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
            cursor: 'pointer', padding: '10px', borderRadius: '10px',
            color: 'var(--text-secondary)', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <HiOutlineSun size={20} /> : <HiOutlineMoon size={20} />}
        </button>
      </div>
    </header>
  );
}
