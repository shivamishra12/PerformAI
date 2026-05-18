// Dashboard page - main overview with stats, charts, and recent employees
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { HiOutlineUsers, HiOutlineCheckCircle, HiOutlineClock, HiOutlineChartBar, HiOutlineSparkles } from 'react-icons/hi';
import StatCard from '../components/StatCard';
import { SkeletonCard, SkeletonChart, SkeletonTable } from '../components/LoadingSkeleton';
import API from '../utils/api';
import toast from 'react-hot-toast';

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'];

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/employees/stats/dashboard');
      setStats(data);
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container gradient-mesh">
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>Loading your performance overview...</p>
        </div>
        <div className="stats-grid">
          {[0, 1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <SkeletonChart />
          <SkeletonChart />
        </div>
      </div>
    );
  }

  const scoreData = stats?.scoreDistribution?.length > 0
    ? stats.scoreDistribution
    : [
        { range: '0-19%', count: 0 },
        { range: '20-39%', count: 0 },
        { range: '40-59%', count: 0 },
        { range: '60-79%', count: 0 },
        { range: '80-100%', count: 0 },
      ];

  return (
    <div className="page-container gradient-mesh">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Your AI-powered performance command center</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard title="Total Employees" value={stats?.total || 0} icon={HiOutlineUsers}
          gradient="linear-gradient(135deg, #6366f1, #8b5cf6)" delay={0} />
        <StatCard title="Reviewed" value={stats?.reviewed || 0} icon={HiOutlineCheckCircle}
          gradient="linear-gradient(135deg, #22c55e, #059669)" delay={0.1} />
        <StatCard title="Avg Performance Score" value={stats?.avgPerformanceScore || 0} icon={HiOutlineChartBar}
          gradient="linear-gradient(135deg, #0ea5e9, #6366f1)" delay={0.2} suffix="%" />
        <StatCard title="Pending Review" value={stats?.pending || 0} icon={HiOutlineClock}
          gradient="linear-gradient(135deg, #f59e0b, #ef4444)" delay={0.3} />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {/* Score Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="chart-container">
          <h3>📊 Performance Score Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={scoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="range" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                  borderRadius: '10px', boxShadow: '0 8px 24px var(--shadow-color)',
                  color: 'var(--text-primary)'
                }}
              />
              <Bar dataKey="count" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Skill Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="chart-container">
          <h3>🎯 Top Skills Distribution</h3>
          {stats?.skillDistribution?.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={stats.skillDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                  paddingAngle={4} dataKey="count" nameKey="name"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={{ stroke: 'var(--text-muted)' }}>
                  {stats.skillDistribution.map((_, index) => (
                    <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                    borderRadius: '10px', color: 'var(--text-primary)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '40px' }}>
              <p>No skill data available yet</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent & Top Employees */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {/* Top Employees */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HiOutlineSparkles style={{ color: '#f59e0b' }} /> Top Employees
          </h3>
          {stats?.topEmployees?.length > 0 ? (
            <div>
              {stats.topEmployees.map((c, i) => (
                <div key={c._id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px', borderRadius: '12px', marginBottom: '8px',
                  background: i === 0 ? 'rgba(99,102,241,0.06)' : 'transparent',
                  transition: 'background 0.2s',
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = i === 0 ? 'rgba(99,102,241,0.06)' : 'transparent'}
                >
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: `linear-gradient(135deg, ${CHART_COLORS[i]}, ${CHART_COLORS[i + 1] || CHART_COLORS[0]})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: '700', fontSize: '13px', flexShrink: 0,
                  }}>
                    #{i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>{c.name}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.skills?.slice(0, 3).join(', ')}
                    </p>
                  </div>
                  <div className={`score-circle ${c.performanceScore >= 75 ? 'score-high' : c.performanceScore >= 50 ? 'score-medium' : 'score-low'}`}
                    style={{ width: '42px', height: '42px', fontSize: '13px', flexShrink: 0 }}>
                    {c.performanceScore}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '30px' }}>
              <p>Run matching to see top employees</p>
            </div>
          )}
        </motion.div>

        {/* Recent Employees */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>
            📋 Recent Employees
          </h3>
          {stats?.recentEmployees?.length > 0 ? (
            <div>
              {stats.recentEmployees.map((c) => (
                <div key={c._id} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px', borderRadius: '12px', marginBottom: '8px',
                  transition: 'background 0.2s',
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: '700', fontSize: '14px', flexShrink: 0,
                  }}>
                    {c.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>{c.name}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {c.experience}y exp • {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`badge ${c.status === 'reviewed' ? 'badge-success' : c.status === 'interviewed' ? 'badge-info' : c.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '30px' }}>
              <p>No employees added yet</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
