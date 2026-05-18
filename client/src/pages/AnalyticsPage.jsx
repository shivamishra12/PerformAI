import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { HiOutlineChartBar } from 'react-icons/hi';
import { SkeletonChart } from '../components/LoadingSkeleton';
import API from '../utils/api';
import toast from 'react-hot-toast';

const COLORS = ['#6366f1', '#8b5cf6', '#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#f97316', '#a855f7'];

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/employees/stats/dashboard'),
      API.get('/employees', { params: { limit: 100 } })
    ]).then(([statsRes, candRes]) => {
      setStats(statsRes.data);
      setEmployees(candRes.data.employees);
    }).catch(() => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-container gradient-mesh">
        <div className="page-header"><h1>Analytics</h1><p>Loading...</p></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <SkeletonChart /><SkeletonChart /><SkeletonChart /><SkeletonChart />
        </div>
      </div>
    );
  }

  // Prepare data
  const statusData = [
    { name: 'Pending', value: stats?.pending || 0 },
    { name: 'Reviewed', value: stats?.reviewed || 0 },
    { name: 'Interviewed', value: stats?.interviewed || 0 },
    { name: 'Rejected', value: employees.filter(c => c.status === 'rejected').length },
  ].filter(d => d.value > 0);

  const expData = [
    { range: '0-1y', count: employees.filter(c => c.experience <= 1).length },
    { range: '2-3y', count: employees.filter(c => c.experience >= 2 && c.experience <= 3).length },
    { range: '4-5y', count: employees.filter(c => c.experience >= 4 && c.experience <= 5).length },
    { range: '6-8y', count: employees.filter(c => c.experience >= 6 && c.experience <= 8).length },
    { range: '8+y', count: employees.filter(c => c.experience > 8).length },
  ];

  const scoreTimeline = employees
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map(c => ({ name: c.name?.split(' ')[0], score: c.performanceScore, date: new Date(c.createdAt).toLocaleDateString() }));

  return (
    <div className="page-container gradient-mesh">
      <div className="page-header"><h1>Analytics</h1><p>Deep dive into your performance metrics</p></div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20 }}>
        {/* Skill Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="chart-container">
          <h3>🎯 Skill Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.skillDistribution || []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} width={80} />
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 10, color: 'var(--text-primary)' }} />
              <Bar dataKey="count" fill="url(#skillGrad)" radius={[0, 6, 6, 0]} />
              <defs>
                <linearGradient id="skillGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Status Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="chart-container">
          <h3>📊 Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={4} dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 10, color: 'var(--text-primary)' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Experience Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="chart-container">
          <h3>📈 Experience Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={expData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="range" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 10, color: 'var(--text-primary)' }} />
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="count" stroke="#0ea5e9" fill="url(#areaGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Performance Score Timeline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="chart-container">
          <h3>⚡ Performance Scores by Employee</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scoreTimeline.slice(0, 12)}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 10, color: 'var(--text-primary)' }} />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {scoreTimeline.slice(0, 12).map((entry, i) => (
                  <Cell key={i} fill={entry.score >= 75 ? '#22c55e' : entry.score >= 50 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
