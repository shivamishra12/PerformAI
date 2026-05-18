// Sidebar navigation component
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  HiOutlineHome, HiOutlineUsers, HiOutlineUserAdd,
  HiOutlineSparkles, HiOutlineChartBar, HiOutlineLogout, HiOutlineMenu, HiOutlineX
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/', icon: HiOutlineHome, label: 'Dashboard' },
  { path: '/employees', icon: HiOutlineUsers, label: 'Employees' },
  { path: '/add-employee', icon: HiOutlineUserAdd, label: 'Add Employee' },
  { path: '/ai-recommend', icon: HiOutlineSparkles, label: 'AI Recommendations' },
  { path: '/analytics', icon: HiOutlineChartBar, label: 'Analytics' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px', fontWeight: '800', color: '#fff',
            boxShadow: '0 4px 14px rgba(99,102,241,0.4)'
          }}>
            P
          </div>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#f1f5f9', letterSpacing: '-0.3px' }}>PerformAI</h1>
            <p style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>AI Performance Hub</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        <div style={{ marginBottom: '8px', padding: '0 8px' }}>
          <span style={{ fontSize: '11px', fontWeight: '600', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Menu
          </span>
        </div>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '11px 14px', borderRadius: '10px',
                textDecoration: 'none', marginBottom: '4px',
                background: isActive ? 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))' : 'transparent',
                color: isActive ? '#a5b4fc' : '#94a3b8',
                fontWeight: isActive ? '600' : '500',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
              onMouseEnter={(e) => { if (!isActive) e.target.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={(e) => { if (!isActive) e.target.style.background = 'transparent'; }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  style={{
                    position: 'absolute', left: '-12px', top: '50%', transform: 'translateY(-50%)',
                    width: '3px', height: '24px', borderRadius: '0 4px 4px 0',
                    background: 'linear-gradient(180deg, #6366f1, #8b5cf6)',
                  }}
                />
              )}
              <item.icon size={20} style={{ flexShrink: 0 }} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Section */}
      <div style={{
        padding: '16px 12px',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '12px', borderRadius: '12px',
          background: 'rgba(255,255,255,0.03)'
        }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: '700', fontSize: '14px'
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name || 'Admin'}
            </p>
            <p style={{ fontSize: '11px', color: '#64748b' }}>{user?.role || 'admin'}</p>
          </div>
          <button
            onClick={logout}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#64748b', padding: '6px', borderRadius: '8px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => { e.target.style.color = '#ef4444'; e.target.style.background = 'rgba(239,68,68,0.1)'; }}
            onMouseLeave={(e) => { e.target.style.color = '#64748b'; e.target.style.background = 'none'; }}
            title="Logout"
          >
            <HiOutlineLogout size={18} />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        style={{
          display: 'none', position: 'fixed', top: '16px', left: '16px',
          zIndex: 1001, background: '#1e293b', border: 'none',
          borderRadius: '10px', padding: '10px', cursor: 'pointer', color: '#f1f5f9',
        }}
        className="mobile-menu-btn"
      >
        {mobileOpen ? <HiOutlineX size={22} /> : <HiOutlineMenu size={22} />}
      </button>

      {/* Desktop sidebar */}
      <aside style={{
        width: '260px', height: '100vh', position: 'fixed',
        left: 0, top: 0, background: '#0f172a',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column',
        zIndex: 1000, overflowY: 'auto',
      }}
        className="desktop-sidebar"
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                zIndex: 999, display: 'none'
              }}
              className="mobile-overlay"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              style={{
                width: '260px', height: '100vh', position: 'fixed',
                left: 0, top: 0, background: '#0f172a',
                display: 'none', flexDirection: 'column',
                zIndex: 1000, overflowY: 'auto',
              }}
              className="mobile-sidebar"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          .mobile-overlay { display: block !important; }
          .mobile-sidebar { display: flex !important; }
        }
      `}</style>
    </>
  );
}
