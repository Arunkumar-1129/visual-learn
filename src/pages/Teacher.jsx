import React, { useState } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { studentFeedback } from '../data/mockData';
import ModelViewer3D from '../components/ModelViewer3D';
import Toast from '../components/Toast';
import './Teacher.css';

const THUMB_GRADIENTS = [
  'linear-gradient(135deg, #1e3a5f, #0e4d3e)',
  'linear-gradient(135deg, #3b1f5e, #1a3a5e)',
  'linear-gradient(135deg, #4a1a2a, #1a2a4a)',
  'linear-gradient(135deg, #1a3a1a, #2a2a5e)',
  'linear-gradient(135deg, #3a2a1a, #1a3a4a)',
  'linear-gradient(135deg, #1a2a3a, #2a1a3a)',
];

const MODEL_ICONS = { Physics: '⚡', Biology: '🧬', Chemistry: '⚗️' };

export default function Teacher() {
  const {
    licensedModelIds,
    licenseModel,
    classrooms,
    assignModelToClassroom,
    getLicensedModels,
    getClassroomModels,
    marketplaceModels
  } = useMarketplace();

  const [processingId, setProcessingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [activeViewer, setActiveViewer] = useState(null);
  const [assignSelections, setAssignSelections] = useState({});

  const licensedModels = getLicensedModels();

  const handleLicense = (modelId) => {
    setProcessingId(modelId);
    setTimeout(() => {
      licenseModel(modelId);
      setProcessingId(null);
      const model = marketplaceModels.find(m => m.id === modelId);
      setToast({ message: `"${model?.name}" licensed successfully! It's now in your library.`, type: 'success' });
    }, 1000);
  };

  const handleAssign = (classroomId) => {
    const modelId = assignSelections[classroomId];
    if (!modelId) return;
    assignModelToClassroom(classroomId, modelId);
    setAssignSelections(prev => ({ ...prev, [classroomId]: '' }));
    const model = marketplaceModels.find(m => m.id === modelId);
    setToast({ message: `"${model?.name}" assigned to classroom!`, type: 'cyan' });
  };

  const totalStudents = classrooms.reduce((s, c) => s + c.studentCount, 0);

  return (
    <div className="teacher-page">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {activeViewer && (
        <div className="modal-overlay" onClick={() => setActiveViewer(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>{activeViewer.name}</h3>
                <p className="modal-subtitle">{activeViewer.subject} › {activeViewer.chapter}</p>
              </div>
              <button className="modal-close" onClick={() => setActiveViewer(null)}>✕</button>
            </div>
            <div className="modal-body">
              <ModelViewer3D model={activeViewer} />
            </div>
          </div>
        </div>
      )}

      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Teacher Dashboard</h1>
            <p className="page-subtitle">License models, build classrooms, and teach with 3D</p>
          </div>
        </div>

        {/* Overview stats */}
        <div className="overview-stats">
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--accent-cyan)' }}>{classrooms.length}</div>
            <div className="stat-label">My Classrooms</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--accent-amber)' }}>{licensedModelIds.length}</div>
            <div className="stat-label">Models Licensed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: 'var(--success)' }}>{totalStudents}</div>
            <div className="stat-label">Total Students</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#A78BFA' }}>78%</div>
            <div className="stat-label">Avg. Engagement</div>
          </div>
        </div>

        <div className="divider" />

        {/* Marketplace */}
        <section className="teacher-section">
          <h2 className="section-title">Marketplace — License a Model</h2>
          <p className="section-subtitle">Browse models from creators and add them to your classroom</p>

          <div className="marketplace-grid">
            {marketplaceModels.map((model, i) => {
              const isLicensed = licensedModelIds.includes(model.id);
              const isProcessing = processingId === model.id;

              return (
                <div key={model.id} className={`marketplace-card ${isLicensed ? 'is-licensed' : ''}`}>
                  <div
                    className="model-thumb"
                    style={{ background: THUMB_GRADIENTS[i % THUMB_GRADIENTS.length], cursor: 'pointer' }}
                    onClick={() => setActiveViewer(model)}
                  >
                    <span>{MODEL_ICONS[model.subject] || '📦'}</span>
                    {isLicensed && <div className="licensed-overlay">✓ Licensed</div>}
                    <div className="preview-hint">Click to preview</div>
                  </div>

                  <div className="marketplace-card-info">
                    <div className="flex-between">
                      <div className="model-name">{model.name}</div>
                      <div className="model-price-tag">₹{model.price}</div>
                    </div>
                    <div className="model-tag tag">{model.subject} › {model.chapter}</div>
                    <div className="creator-name">by {model.creator}</div>
                    <div className="model-stats" style={{ marginTop: 8 }}>
                      <span>🧑‍🏫 {model.purchases} purchases</span>
                      <span>👁 {model.views} views</span>
                    </div>

                    <button
                      className={`btn ${isLicensed ? 'btn-success' : 'btn-primary'} license-btn`}
                      onClick={() => !isLicensed && !isProcessing && handleLicense(model.id)}
                      disabled={isLicensed || isProcessing}
                    >
                      {isProcessing ? (
                        <><div className="spinner" /> Processing payment...</>
                      ) : isLicensed ? (
                        '✓ Licensed'
                      ) : (
                        `License for ₹${model.price}`
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="divider" />

        {/* Classrooms */}
        <section className="teacher-section">
          <h2 className="section-title">My Classrooms</h2>
          <p className="section-subtitle">Manage your classrooms and assign models to students</p>

          <div className="classrooms-list">
            {classrooms.map(classroom => {
              const assignedModels = getClassroomModels(classroom.id);
              const availableToAssign = licensedModels.filter(
                m => !classroom.assignedModelIds.includes(m.id)
              );

              return (
                <div key={classroom.id} className="classroom-card">
                  <div className="classroom-header">
                    <div>
                      <h3 className="classroom-name">{classroom.name}</h3>
                      <div className="classroom-meta">
                        <span>👥 {classroom.studentCount} students</span>
                        <div className="class-code">
                          <span>Class Code:</span>
                          <code>{classroom.code}</code>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="classroom-body">
                    {/* Assigned models */}
                    <div className="assigned-models">
                      <div className="subsection-label">Assigned Models</div>
                      {assignedModels.length === 0 ? (
                        <div className="empty-models">No models assigned yet. License models above and assign them here.</div>
                      ) : (
                        <div className="assigned-model-tags">
                          {assignedModels.map(m => (
                            <div key={m.id} className="assigned-model-tag">
                              <span>{MODEL_ICONS[m.subject] || '📦'}</span>
                              {m.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Assign model control */}
                    {availableToAssign.length > 0 && (
                      <div className="assign-control">
                        <select
                          className="form-input assign-select"
                          value={assignSelections[classroom.id] || ''}
                          onChange={e => setAssignSelections(prev => ({ ...prev, [classroom.id]: e.target.value }))}
                        >
                          <option value="">Select a licensed model...</option>
                          {availableToAssign.map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                          ))}
                        </select>
                        <button
                          className="btn btn-ghost"
                          onClick={() => handleAssign(classroom.id)}
                          disabled={!assignSelections[classroom.id]}
                        >
                          + Assign
                        </button>
                      </div>
                    )}

                    {/* Feedback */}
                    <div className="feedback-section">
                      <div className="subsection-label">Recent Student Feedback</div>
                      <table className="feedback-table">
                        <thead>
                          <tr>
                            <th>Student</th>
                            <th>Model Viewed</th>
                            <th>Feedback</th>
                          </tr>
                        </thead>
                        <tbody>
                          {studentFeedback.slice(0, 4).map((fb, i) => (
                            <tr key={i}>
                              <td>{fb.student}</td>
                              <td className="feedback-model">{fb.model}</td>
                              <td>{fb.emoji} {fb.comment}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
