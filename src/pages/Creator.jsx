import React, { useState, useRef } from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { marketplaceModels, subjects, earningsData } from '../data/mockData';
import Toast from '../components/Toast';
import ModelViewer3D from '../components/ModelViewer3D';
import './Creator.css';

const THUMB_GRADIENTS = [
  'linear-gradient(135deg, #1e3a5f, #0e4d3e)',
  'linear-gradient(135deg, #3b1f5e, #1a3a5e)',
  'linear-gradient(135deg, #4a1a2a, #1a2a4a)',
  'linear-gradient(135deg, #1a3a1a, #2a2a5e)',
  'linear-gradient(135deg, #3a2a1a, #1a3a4a)',
];

const MODEL_ICONS = {
  'Physics': '⚡',
  'Biology': '🧬',
  'Chemistry': '⚗️',
  'Mathematics': '📐',
};

function EarningsBar({ week, amount, maxAmount }) {
  const height = Math.round((amount / maxAmount) * 120);
  return (
    <div className="earnings-bar-wrap">
      <div className="earnings-bar-track">
        <div
          className="earnings-bar-fill"
          style={{ height: `${height}px` }}
          title={`₹${amount.toLocaleString()}`}
        />
      </div>
      <div className="earnings-bar-label">₹{(amount / 1000).toFixed(1)}k</div>
      <div className="earnings-bar-week">{week}</div>
    </div>
  );
}

export default function Creator() {
  const { creatorModels, addCreatorModel } = useMarketplace();
  const [toast, setToast] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fakeFile, setFakeFile] = useState(null);
  const [realFile, setRealFile] = useState(null);  // actual File object
  const [previewModel, setPreviewModel] = useState(null); // for preview in dropzone
  const [dragOver, setDragOver] = useState(false);
  const [activePreview, setActivePreview] = useState(null);

  const [form, setForm] = useState({
    name: '',
    subject: '',
    chapter: '',
    description: '',
    price: ''
  });

  const availableChapters = subjects.find(s => s.name === form.subject)?.chapters || [];

  const totalRevenue = creatorModels.reduce((sum, m) => sum + (m.purchases * m.price), 0);
  const totalLicenses = creatorModels.reduce((sum, m) => sum + m.purchases, 0);
  const totalViews = creatorModels.reduce((sum, m) => sum + m.views, 0);
  const maxEarning = Math.max(...earningsData.map(e => e.amount));

  const processFile = (file) => {
    if (!file) return;
    setFakeFile(file.name);
    setRealFile(file);
    // Create blob URL for preview immediately
    const blobUrl = URL.createObjectURL(file);
    setPreviewModel({
      id: `preview-${Date.now()}`,
      name: form.name || file.name.replace(/\.[^.]+$/, ''),
      subject: form.subject || 'Physics',
      chapter: form.chapter || 'Preview',
      fileUrl: blobUrl,
      parts: []
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  };

  const handlePublish = () => {
    if (!form.name || !form.subject || !form.chapter || !form.price) {
      setToast({ message: 'Please fill in all required fields.', type: 'amber' });
      return;
    }

    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      // Create a stable blob URL from the real file (or undefined for mock)
      const fileUrl = realFile ? URL.createObjectURL(realFile) : undefined;
      const newModel = {
        id: `model-${Date.now()}`,
        name: form.name,
        subject: form.subject,
        chapter: form.chapter,
        description: form.description,
        price: Number(form.price),
        purchases: 0,
        views: 0,
        autoTagged: true,
        fileUrl,         // real .glb blob URL if a file was dropped
        parts: []        // custom models start with no parts (Gemini explains the whole model)
      };
      addCreatorModel(newModel);
      setToast({ message: `Auto-tagged as: ${form.subject} > ${form.chapter} > Class 12 ✨`, type: 'amber' });
      setForm({ name: '', subject: '', chapter: '', description: '', price: '' });
      setFakeFile(null);
      setRealFile(null);
      setPreviewModel(null);
    }, 1800);
  };

  return (
    <div className="creator-page">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Creator Portal</h1>
            <p className="page-subtitle">Upload, manage, and earn from your 3D STEM models</p>
          </div>
          <div className="creator-badge">
            <span>🔬</span> Verified Creator
          </div>
        </div>

        {/* Your Models */}
        <section className="creator-section">
          <h2 className="section-title">Your Models</h2>
          <p className="section-subtitle">Models you've published to the marketplace</p>

          <div className="models-grid">
            {creatorModels.map((model, i) => (
              <div key={model.id} className="creator-model-card" onClick={() => setActivePreview(model)} style={{ cursor: 'pointer' }}>
                <div
                  className="model-thumb"
                  style={{ background: THUMB_GRADIENTS[i % THUMB_GRADIENTS.length] }}
                >
                  {model.fileUrl ? (
                    <span style={{ fontSize: 14, color: 'var(--accent-cyan)' }}>🗂 .glb</span>
                  ) : (
                    <span>{MODEL_ICONS[model.subject] || '📦'}</span>
                  )}
                  {model.autoTagged && (
                    <div className="auto-tagged-badge">Auto-tagged ✨</div>
                  )}
                  <div className="preview-hint">Click to preview</div>
                </div>
                <div className="model-info">
                  <div className="model-name">{model.name}</div>
                  <div className="model-tag tag">{model.subject} › {model.chapter} › Class 12</div>
                  <div className="model-price">₹{model.price.toLocaleString()}/license</div>
                  <div className="model-stats">
                    <span>🧑‍🏫 {model.purchases} teachers</span>
                    <span>👁 {model.views.toLocaleString()} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="divider" />

        {/* Upload Form */}
        <section className="creator-section">
          <h2 className="section-title">Upload a New Model</h2>
          <p className="section-subtitle">Publish your 3D model and let AI auto-tag it for the right audience</p>

          <div className="upload-layout">
            {/* Dropzone */}
            <div
              className={`dropzone ${dragOver ? 'drag-over' : ''} ${fakeFile ? 'has-file' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input').click()}
            >
              <input
                id="file-input"
                type="file"
                style={{ display: 'none' }}
                accept=".glb,.gltf"
                onChange={handleFileChange}
              />
              {fakeFile ? (
                <div className="dropzone-file">
                  <span className="dropzone-file-icon">🗂</span>
                  <div className="dropzone-file-name">{fakeFile}</div>
                  <div className="dropzone-file-sub" style={{ color: 'var(--accent-cyan)' }}>✓ Real .glb file loaded — will render in 3D viewer</div>
                  <div className="dropzone-file-sub" style={{ marginTop: 4 }}>Click to choose a different file</div>
                </div>
              ) : (
                <div className="dropzone-empty">
                  <div className="dropzone-icon">⬆️</div>
                  <div className="dropzone-title">Drop your .glb model here</div>
                  <div className="dropzone-sub">Supports .glb and .gltf (binary GLTF)</div>
                  <div className="dropzone-hint">or click to browse your laptop</div>
                </div>
              )}
            </div>

            {/* Form fields */}
            <div className="upload-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Model Name *</label>
                  <input
                    className="form-input"
                    placeholder="e.g. Electric Generator"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input
                    className="form-input"
                    type="number"
                    placeholder="499"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Subject *</label>
                  <select
                    className="form-input"
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value, chapter: '' })}
                  >
                    <option value="">Select subject...</option>
                    {subjects.map(s => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Chapter / Topic *</label>
                  <select
                    className="form-input"
                    value={form.chapter}
                    onChange={e => setForm({ ...form, chapter: e.target.value })}
                    disabled={!form.subject}
                  >
                    <option value="">Select chapter...</option>
                    {availableChapters.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  placeholder="Describe your model — what concepts does it teach? What makes it interactive?"
                  rows={4}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <button
                className="btn btn-amber publish-btn"
                onClick={handlePublish}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <div className="spinner" />
                    Analyzing model with AI...
                  </>
                ) : (
                  <>✨ Publish Model</>
                )}
              </button>
            </div>
          </div>
        </section>

        <div className="divider" />

        {/* Earnings */}
        <section className="creator-section earnings-section">
          <h2 className="section-title">Your Earnings</h2>
          <p className="section-subtitle">Revenue summary and weekly performance</p>

          <div className="earnings-stats">
            <div className="stat-card">
              <div className="stat-value" style={{ color: 'var(--accent-amber)' }}>
                ₹{totalRevenue.toLocaleString()}
              </div>
              <div className="stat-label">Total Revenue</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: 'var(--accent-cyan)' }}>
                {totalLicenses}
              </div>
              <div className="stat-label">Total Licenses Sold</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: 'var(--success)' }}>
                {totalViews.toLocaleString()}
              </div>
              <div className="stat-label">Total Student Views</div>
            </div>
          </div>

          <div className="earnings-chart-card">
            <div className="chart-title">Weekly Earnings (Last 4 Weeks)</div>
            <div className="earnings-chart">
              {earningsData.map(d => (
                <EarningsBar
                  key={d.week}
                  week={d.week}
                  amount={d.amount}
                  maxAmount={maxEarning}
                />
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Preview modal for creator models */}
      {activePreview && (
        <div className="modal-overlay" onClick={() => setActivePreview(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3>{activePreview.name}</h3>
                <p className="modal-subtitle">{activePreview.subject} › {activePreview.chapter} · Creator Preview</p>
              </div>
              <button className="modal-close" onClick={() => setActivePreview(null)}>✕</button>
            </div>
            <div className="modal-body">
              <ModelViewer3D model={activePreview} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
