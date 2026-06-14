import React, { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [onClose]);

  const icon = type === 'success' ? '✅' : type === 'amber' ? '⚡' : '💡';

  return (
    <div className={`toast toast-${type}`}>
      <span style={{ fontSize: '20px' }}>{icon}</span>
      <span>{message}</span>
    </div>
  );
}
