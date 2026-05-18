// Tag input component for skills entry
import { useState } from 'react';
import { HiOutlineX } from 'react-icons/hi';

export default function TagInput({ tags = [], onChange, placeholder = 'Type and press Enter' }) {
  const [input, setInput] = useState('');

  const addTag = (tag) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput('');
  };

  const removeTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    onChange(newTags);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: '6px',
      padding: '8px 12px', minHeight: '48px',
      background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)',
      borderRadius: '10px', alignItems: 'center',
      transition: 'border-color 0.2s',
      cursor: 'text',
    }}
      onClick={(e) => e.currentTarget.querySelector('input')?.focus()}
    >
      {tags.map((tag, index) => (
        <span key={index} style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          padding: '4px 10px', borderRadius: '6px',
          background: 'rgba(99,102,241,0.12)', color: '#818cf8',
          fontSize: '13px', fontWeight: '500',
        }}>
          {tag}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); removeTag(index); }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#818cf8', padding: '0', display: 'flex',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.color = '#ef4444'}
            onMouseLeave={(e) => e.target.style.color = '#818cf8'}
          >
            <HiOutlineX size={14} />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (input) addTag(input); }}
        placeholder={tags.length === 0 ? placeholder : ''}
        style={{
          flex: 1, minWidth: '120px', border: 'none', outline: 'none',
          background: 'transparent', color: 'var(--text-primary)',
          fontSize: '14px', fontFamily: 'inherit',
        }}
      />
    </div>
  );
}
