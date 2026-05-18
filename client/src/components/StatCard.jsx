// Stat card component with gradient icon backgrounds
import { motion } from 'framer-motion';

export default function StatCard({ title, value, icon: Icon, gradient, delay = 0, suffix = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card"
      style={{ padding: '24px', cursor: 'default' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{
            fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px'
          }}>
            {title}
          </p>
          <h3 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-primary)' }}>
            {value}{suffix}
          </h3>
        </div>
        <div style={{
          width: '48px', height: '48px', borderRadius: '14px',
          background: gradient || 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(99,102,241,0.3)'
        }}>
          {Icon && <Icon size={22} color="#fff" />}
        </div>
      </div>
    </motion.div>
  );
}
