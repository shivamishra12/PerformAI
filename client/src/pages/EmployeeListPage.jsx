// Employee list page with search, filters, pagination, and actions
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  HiOutlineSearch, HiOutlineFilter, HiOutlineTrash, HiOutlinePencil,
  HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineSortDescending,
  HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineUserAdd,
  HiOutlineDownload
} from 'react-icons/hi';
import { SkeletonTable } from '../components/LoadingSkeleton';
import API from '../utils/api';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function EmployeeListPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchEmployees();
  }, [search, status, sortBy, order, page]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/employees', {
        params: { search, status, sortBy, order, page, limit }
      });
      setEmployees(data.employees);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete employee ${name}?`)) return;
    try {
      await API.delete(`/employees/${id}`);
      toast.success('Employee deleted');
      fetchEmployees();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'reviewed' ? 'pending' : 'reviewed';
    const reviewed = newStatus === 'reviewed';
    try {
      await API.put(`/employees/${id}`, { status: newStatus, reviewed });
      toast.success(reviewed ? 'Employee reviewed! ✅' : 'Moved to pending');
      fetchEmployees();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(99, 102, 241);
    doc.text('PerformAI - Employee Report', 14, 22);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

    const tableData = employees.map(c => [
      c.name, c.email, c.skills?.join(', '), `${c.experience}y`,
      `${c.performanceScore}%`, c.status
    ]);

    doc.autoTable({
      head: [['Name', 'Email', 'Skills', 'Exp', 'Match', 'Status']],
      body: tableData,
      startY: 36,
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [99, 102, 241], textColor: 255 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });

    doc.save('PerformAI_Employees.pdf');
    toast.success('PDF exported! 📄');
  };

  const getScoreClass = (score) => {
    if (score >= 75) return 'score-high';
    if (score >= 50) return 'score-medium';
    return 'score-low';
  };

  const getStatusBadge = (s) => {
    switch (s) {
      case 'reviewed': return 'badge-success';
      case 'interviewed': return 'badge-info';
      case 'rejected': return 'badge-danger';
      default: return 'badge-warning';
    }
  };

  return (
    <div className="page-container gradient-mesh">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1>Employees</h1>
            <p>{total} total employees in your organization</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={exportPDF} className="btn btn-secondary btn-sm">
              <HiOutlineDownload size={16} /> Export PDF
            </button>
            <Link to="/add-employee" className="btn btn-primary">
              <HiOutlineUserAdd size={18} /> Add Employee
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
            <HiOutlineSearch size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" style={{ paddingLeft: '38px', margin: 0 }} type="text"
              placeholder="Search by name, email, or skill..."
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          </div>
          {/* Status filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <HiOutlineFilter size={16} style={{ color: 'var(--text-muted)' }} />
            <select className="form-input" style={{ width: '150px', margin: 0 }}
              value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}>
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="interviewed">Interviewed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          {/* Sort */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <HiOutlineSortDescending size={16} style={{ color: 'var(--text-muted)' }} />
            <select className="form-input" style={{ width: '150px', margin: 0 }}
              value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="createdAt">Date Added</option>
              <option value="performanceScore">Performance Score</option>
              <option value="experience">Experience</option>
              <option value="name">Name</option>
            </select>
            <button className="btn btn-ghost btn-sm"
              onClick={() => setOrder(o => o === 'desc' ? 'asc' : 'desc')}
              title={order === 'desc' ? 'Descending' : 'Ascending'}>
              {order === 'desc' ? '↓' : '↑'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Table */}
      {loading ? <SkeletonTable rows={8} /> : employees.length === 0 ? (
        <div className="glass-card empty-state">
          <HiOutlineUserAdd size={48} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
          <h3>No Employees Found</h3>
          <p>{search || status !== 'all' ? 'Try adjusting your filters' : 'Start by adding your first employee'}</p>
          <Link to="/add-employee" className="btn btn-primary" style={{ marginTop: '16px' }}>
            <HiOutlineUserAdd size={18} /> Add First Employee
          </Link>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ overflow: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Skills</th>
                <th>Experience</th>
                <th>Performance Score</th>
                <th>Status</th>
                <th>AI Recommendation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((c, i) => (
                <motion.tr key={c._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '10px',
                        background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: '700', fontSize: '14px', flexShrink: 0,
                      }}>
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p style={{ fontWeight: '600', fontSize: '14px' }}>{c.name}</p>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '200px' }}>
                      {c.skills?.slice(0, 3).map((s, i) => (
                        <span key={i} className="skill-tag">{s}</span>
                      ))}
                      {c.skills?.length > 3 && (
                        <span className="skill-tag" style={{ background: 'rgba(100,116,139,0.1)', color: 'var(--text-muted)' }}>
                          +{c.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: '600' }}>{c.experience}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}> years</span>
                  </td>
                  <td>
                    <div className={`score-circle ${getScoreClass(c.performanceScore)}`} style={{ width: '44px', height: '44px', fontSize: '13px' }}>
                      {c.performanceScore}%
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(c.status)}`}>{c.status}</span>
                  </td>
                  <td>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.aiRecommendation || '—'}
                    </p>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button className="btn btn-ghost btn-sm"
                        onClick={() => handleStatusToggle(c._id, c.status)}
                        title={c.status === 'reviewed' ? 'Remove from review' : 'Review'}>
                        {c.status === 'reviewed'
                          ? <HiOutlineXCircle size={18} style={{ color: '#f59e0b' }} />
                          : <HiOutlineCheckCircle size={18} style={{ color: '#22c55e' }} />
                        }
                      </button>
                      <button className="btn btn-ghost btn-sm"
                        onClick={() => handleDelete(c._id, c.name)}
                        title="Delete">
                        <HiOutlineTrash size={18} style={{ color: '#ef4444' }} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {pages > 1 && (
            <div style={{
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px',
              padding: '16px', borderTop: '1px solid var(--border-color)'
            }}>
              <button className="btn btn-ghost btn-sm" disabled={page === 1}
                onClick={() => setPage(p => p - 1)}>
                <HiOutlineChevronLeft size={16} /> Prev
              </button>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                Page {page} of {pages}
              </span>
              <button className="btn btn-ghost btn-sm" disabled={page === pages}
                onClick={() => setPage(p => p + 1)}>
                Next <HiOutlineChevronRight size={16} />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
