import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineUserAdd, HiOutlineArrowLeft } from 'react-icons/hi';
import TagInput from '../components/TagInput';
import API from '../utils/api';
import toast from 'react-hot-toast';

export default function AddEmployeePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', department: '', skills: [], experience: '', performanceScore: '', bio: '', resumeUrl: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.skills.length === 0) { toast.error('Add at least one skill'); return; }
    setLoading(true);
    try {
      await API.post('/employees', { ...form, experience: Number(form.experience), performanceScore: Number(form.performanceScore) });
      toast.success('Employee added! 🎉');
      navigate('/employees');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="page-container gradient-mesh">
      <div className="page-header">
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ marginBottom: 12 }}>
          <HiOutlineArrowLeft size={16} /> Back
        </button>
        <h1>Add New Employee</h1>
        <p>Enter employee details to add them to your organization</p>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ maxWidth: 700, padding: 36 }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" type="text" placeholder="Aarav Sharma" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="form-input" type="email" placeholder="aarav@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Department *</label>
              <input className="form-input" type="text" placeholder="Development" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Performance Score *</label>
              <input className="form-input" type="number" min="0" max="100" placeholder="85" value={form.performanceScore} onChange={e => setForm({ ...form, performanceScore: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Skills * (press Enter to add)</label>
            <TagInput tags={form.skills} onChange={skills => setForm({ ...form, skills })} placeholder="React, Node.js..." />
          </div>
          <div className="form-group">
            <label className="form-label">Experience (years) *</label>
            <input className="form-input" type="number" min="0" max="50" placeholder="4" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Bio / Projects</label>
            <textarea className="form-input" placeholder="Background, projects, achievements..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={4} />
          </div>
          <div className="form-group">
            <label className="form-label">Resume URL (optional)</label>
            <input className="form-input" type="url" placeholder="https://..." value={form.resumeUrl} onChange={e => setForm({ ...form, resumeUrl: e.target.value })} />
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Adding...' : <><HiOutlineUserAdd size={18} /> Add Employee</>}
            </button>
            <button type="button" className="btn btn-secondary btn-lg" onClick={() => navigate('/employees')}>Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
