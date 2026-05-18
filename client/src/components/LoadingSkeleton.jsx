// Loading skeleton components for loading states
export function SkeletonCard() {
  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ width: '80px', height: '12px', marginBottom: '12px' }} />
          <div className="skeleton" style={{ width: '120px', height: '32px' }} />
        </div>
        <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '14px' }} />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }) {
  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div className="skeleton" style={{ width: '200px', height: '20px', marginBottom: '20px' }} />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'center' }}>
          <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '10px' }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ width: '60%', height: '14px', marginBottom: '8px' }} />
            <div className="skeleton" style={{ width: '40%', height: '12px' }} />
          </div>
          <div className="skeleton" style={{ width: '60px', height: '28px', borderRadius: '14px' }} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <div className="skeleton" style={{ width: '150px', height: '20px', marginBottom: '20px' }} />
      <div className="skeleton" style={{ width: '100%', height: '250px', borderRadius: '12px' }} />
    </div>
  );
}

export function SkeletonForm() {
  return (
    <div className="glass-card" style={{ padding: '32px' }}>
      <div className="skeleton" style={{ width: '200px', height: '24px', marginBottom: '32px' }} />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} style={{ marginBottom: '24px' }}>
          <div className="skeleton" style={{ width: '100px', height: '12px', marginBottom: '8px' }} />
          <div className="skeleton" style={{ width: '100%', height: '44px', borderRadius: '10px' }} />
        </div>
      ))}
      <div className="skeleton" style={{ width: '140px', height: '44px', borderRadius: '10px' }} />
    </div>
  );
}
