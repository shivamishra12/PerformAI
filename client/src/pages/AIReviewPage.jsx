import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineSparkles, HiOutlineChevronDown, HiOutlineChevronUp } from 'react-icons/hi';
import TagInput from '../components/TagInput';
import API from '../utils/api';
import toast from 'react-hot-toast';

export default function AIReviewPage() {
  const [customSkills, setCustomSkills] = useState([]);
  const [customPreferred, setCustomPreferred] = useState([]);
  const [minExp, setMinExp] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setResults(null);
    try {
      const payload = {
        requiredSkills: customSkills,
        preferredSkills: customPreferred,
        minimumExperience: Number(minExp) || 0,
        title: title || 'General Performance Review',
        description
      };

      const { data } = await API.post('/ai/recommend', payload);
      setResults(data);
      toast.success('AI recommendations generated! 🤖');
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI analysis failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="page-container gradient-mesh">
      <div className="page-header">
        <h1>AI Recommendations</h1>
        <p>Generate AI-powered promotion, training, and performance recommendations for your employees</p>
      </div>

      {/* Input Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: 28, marginBottom: 24, maxWidth: 700 }}>
        <div className="form-group">
          <label className="form-label">Review Title</label>
          <input className="form-input" placeholder="e.g. Q2 Performance Review" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Key Skills to Evaluate</label>
          <TagInput tags={customSkills} onChange={setCustomSkills} placeholder="React, Node.js, Leadership..." />
        </div>
        <div className="form-group">
          <label className="form-label">Preferred Skills</label>
          <TagInput tags={customPreferred} onChange={setCustomPreferred} placeholder="Docker, AWS..." />
        </div>
        <div className="form-group">
          <label className="form-label">Min Experience (years)</label>
          <input className="form-input" type="number" min="0" placeholder="0" value={minExp} onChange={e => setMinExp(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Description / Notes</label>
          <textarea className="form-input" placeholder="Any specific criteria or context for the AI..." value={description} onChange={e => setDescription(e.target.value)} rows={3} />
        </div>

        <button className="btn btn-primary" onClick={handleAnalyze} disabled={loading}
          style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', boxShadow: '0 4px 14px rgba(139,92,246,0.35)' }}>
          <HiOutlineSparkles size={18} /> {loading ? 'Analyzing...' : 'Generate AI Recommendations'}
        </button>

        {loading && (
          <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 20, height: 20, border: '2px solid var(--border-color)', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />
            <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>AI is analyzing employees... This may take a few seconds</span>
          </div>
        )}
      </motion.div>

      {/* Results */}
      {results && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* AI Summary */}
          {results.aiAnalysis && (
            <div className="glass-card" style={{ padding: 24, marginBottom: 20, borderLeft: '4px solid #8b5cf6' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                <HiOutlineSparkles style={{ color: '#8b5cf6' }} /> AI Summary
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{results.aiAnalysis.summary}</p>
              {results.aiAnalysis.topPick && (
                <p style={{ marginTop: 12, fontSize: 14, color: '#8b5cf6', fontWeight: 600 }}>🏆 Top Performer: {results.aiAnalysis.topPick}</p>
              )}
            </div>
          )}

          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
            📋 Employee Rankings ({results.totalEmployees || 0} employees analyzed)
          </h3>

          {/* AI Rankings */}
          {results.aiAnalysis?.rankings?.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card" style={{ padding: 20, marginBottom: 12, cursor: 'pointer' }}
              onClick={() => setExpandedCard(expandedCard === i ? null : i)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: i === 0 ? 'linear-gradient(135deg,#22c55e,#059669)' : i < 3 ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'linear-gradient(135deg,#64748b,#475569)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                  #{r.rank}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: 16, fontWeight: 700 }}>{r.name}</h4>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{r.promotionRecommendation?.slice(0, 100)}...</p>
                </div>
                <div className={`score-circle ${r.suitabilityScore >= 75 ? 'score-high' : r.suitabilityScore >= 50 ? 'score-medium' : 'score-low'}`}>
                  {r.suitabilityScore}%
                </div>
                {expandedCard === i ? <HiOutlineChevronUp /> : <HiOutlineChevronDown />}
              </div>

              {expandedCard === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
                  {/* Promotion Recommendation */}
                  <div style={{ marginBottom: 14 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#22c55e' }}>🚀 Promotion Recommendation:</span>
                    <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>{r.promotionRecommendation}</p>
                  </div>

                  {/* Training Suggestions */}
                  {r.trainingSuggestions?.length > 0 && (
                    <div style={{ marginBottom: 14 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#f59e0b' }}>📚 Training Suggestions:</span>
                      <ul style={{ paddingLeft: 20, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginTop: 4 }}>
                        {r.trainingSuggestions.map((s, j) => <li key={j}>{s}</li>)}
                      </ul>
                    </div>
                  )}

                  {/* Feedback */}
                  {r.feedback && (
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#6366f1' }}>💬 Feedback:</span>
                      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.7 }}>{r.feedback}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
