import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import ModelViewer3D from '../components/ModelViewer3D';
import Toast from '../components/Toast';
import './Student.css';

const MODEL_ICONS = { Physics: '⚡', Biology: '🧬', Chemistry: '⚗️' };
const THUMB_GRADIENTS = [
  'linear-gradient(135deg, #1e3a5f, #0e4d3e)',
  'linear-gradient(135deg, #3b1f5e, #1a3a5e)',
  'linear-gradient(135deg, #4a1a2a, #1a2a4a)',
  'linear-gradient(135deg, #1a3a1a, #2a2a5e)',
  'linear-gradient(135deg, #3a2a1a, #1a3a4a)',
];

export default function Student() {
  const { classrooms, getClassroomByCode, getClassroomModels } = useMarketplace();

  const defaultCode = classrooms[0]?.code || '';
  const [codeInput, setCodeInput] = useState(defaultCode);
  const [joinedClassroom, setJoinedClassroom] = useState(null);
  const [activeViewer, setActiveViewer] = useState(null);
  const [understoodIds, setUnderstoodIds] = useState([]);
  const [toast, setToast] = useState(null);

  const handleJoin = () => {
    const classroom = getClassroomByCode(codeInput.trim());
    if (classroom) {
      setJoinedClassroom(classroom);
    } else {
      // Accept any code by defaulting to first classroom
      setJoinedClassroom(classrooms[0]);
    }
  };

  const handleMarkUnderstood = (modelId) => {
    setUnderstoodIds(prev => [...prev, modelId]);
    setToast({ message: 'Great! This counts toward your learning streak 🎉', type: 'success' });
  };

  const classroomModels = joinedClassroom ? getClassroomModels(joinedClassroom.id) : [];

  return (
    <div className="student-page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {activeViewer && (
        <div className="modal-overlay" onClick={() => setActiveViewer(null)}>
          <div className="modal-content viewer-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>{activeViewer.name}</h3>
                <p className="modal-subtitle">{activeViewer.subject} › {activeViewer.chapter}</p>
              </div>
              <button className="modal-close" onClick={() => setActiveViewer(null)}>✕</button>
            </div>
            <div className="modal-body">
              <ModelViewer3D
                model={activeViewer}
                showAIBanner
                onMarkUnderstood={handleMarkUnderstood}
              />
            </div>
          </div>
        </div>
      )}

      <div className="container">
        {/* North Star badge */}
        <div className="north-star-badge">
          🎯 North Star: 60% return rate
        </div>

        <div className="page-header">
          <div>
            <h1 className="page-title">Student View</h1>
            <p className="page-subtitle">Enter your class code to access your classroom's 3D models</p>
          </div>
        </div>

        {/* Join classroom */}
        {!joinedClassroom ? (
          <div className="join-section">
            <div className="join-card">
              <div className="join-icon">🏫</div>
              <h2>Join a Classroom</h2>
              <p>Enter the class code your teacher gave you to access your assigned 3D models.</p>
              <div className="join-input-row">
                <input
                  className="form-input join-input"
                  placeholder="e.g. PHY12A-7X9"
                  value={codeInput}
                  onChange={e => setCodeInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleJoin()}
                />
                <button className="btn btn-primary" onClick={handleJoin}>
                  Join →
                </button>
              </div>
              <div className="join-hint">
                Pre-filled with: <code>{defaultCode}</code> — just click Join!
              </div>
            </div>
          </div>
        ) : (
          <div className="classroom-view">
            <div className="classroom-view-header">
              <div>
                <div className="classroom-view-label">Your Classroom</div>
                <h2 className="classroom-view-name">{joinedClassroom.name}</h2>
              </div>
              <div className="classroom-view-meta">
                <div className="class-code-display">
                  <span>Class Code</span>
                  <code>{joinedClassroom.code}</code>
                </div>
                <button className="btn btn-outline" onClick={() => setJoinedClassroom(null)}>
                  Switch Class
                </button>
              </div>
            </div>

            {classroomModels.length === 0 ? (
              <div className="empty-classroom">
                <div className="empty-icon">📭</div>
                <h3>No models assigned yet</h3>
                <p>Your teacher hasn't assigned any 3D models to this classroom yet.<br />
                  Switch to the Teacher view to assign models, then come back here!</p>
              </div>
            ) : (
              <>
                <div className="models-section-label">
                  <span>🧠 AI-Curated for your syllabus</span>
                  <span className="model-count">{classroomModels.length} model{classroomModels.length !== 1 ? 's' : ''} available</span>
                </div>
                <div className="student-models-grid">
                  {classroomModels.map((model, i) => {
                    const isUnderstood = understoodIds.includes(model.id);
                    return (
                      <div
                        key={model.id}
                        className={`student-model-card ${isUnderstood ? 'understood' : ''}`}
                        onClick={() => setActiveViewer(model)}
                      >
                        <div
                          className="model-thumb"
                          style={{ background: THUMB_GRADIENTS[i % THUMB_GRADIENTS.length] }}
                        >
                          <span>{MODEL_ICONS[model.subject] || '📦'}</span>
                          {isUnderstood && <div className="understood-overlay">✓ Understood</div>}
                        </div>
                        <div className="student-model-info">
                          <div className="ai-match-badge">
                            ✨ 95% match — recommended for {model.chapter}
                          </div>
                          <div className="model-name">{model.name}</div>
                          <div className="model-tag tag">{model.subject} › {model.chapter}</div>
                          <div className="explore-hint">Click to explore in 3D →</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
