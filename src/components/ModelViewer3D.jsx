import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls, Html, useGLTF, Environment } from '@react-three/drei';
import AIExplanationPanel from './AIExplanationPanel';
import './ModelViewer3D.css';

/* ─── Procedural models (fallback when no fileUrl) ─── */

function GeneratorModel({ highlightedPart, onPartClick }) {
  const rotorRef = useRef();
  const timerRef = useRef(new THREE.Timer());
  useFrame(() => {
    timerRef.current.update();
    const delta = timerRef.current.getDelta();
    if (rotorRef.current) rotorRef.current.rotation.y += delta * 1.5;
  });

  const isH = (n) => highlightedPart === n;

  return (
    <group>
      {/* Shaft */}
      <mesh onClick={() => onPartClick('Shaft')}>
        <cylinderGeometry args={[0.08, 0.08, 3.5, 16]} />
        <meshStandardMaterial color="#F5F5F0" emissive={isH('Shaft') ? '#A8A8A0' : '#000'} emissiveIntensity={isH('Shaft') ? 1.5 : 0} metalness={0.6} roughness={0.3} />
        {isH('Shaft') && <Html distanceFactor={6} position={[0.5, 0, 0]}><div className="part-label"><strong>Shaft</strong><p>Connects to external power source, rotates the rotor.</p></div></Html>}
      </mesh>

      {/* Rotor (spinning) */}
      <group ref={rotorRef}>
        <mesh onClick={() => onPartClick('Rotor')}>
          <cylinderGeometry args={[0.6, 0.6, 1.6, 32]} />
          <meshStandardMaterial color="#5EEAD4" emissive={isH('Rotor') ? '#2DD4BF' : '#000'} emissiveIntensity={isH('Rotor') ? 1.5 : 0.2} metalness={0.4} roughness={0.4} />
          {isH('Rotor') && <Html distanceFactor={6} position={[0.9, 0, 0]}><div className="part-label"><strong>Rotor</strong><p>Spins inside the magnetic field, generating EMF.</p></div></Html>}
        </mesh>
      </group>

      {/* Stator Coil */}
      <mesh rotation={[Math.PI / 2, 0, 0]} onClick={() => onPartClick('Stator Coil')}>
        <torusGeometry args={[1.1, 0.2, 16, 48]} />
        <meshStandardMaterial color="#FBBF24" emissive={isH('Stator Coil') ? '#F59E0B' : '#000'} emissiveIntensity={isH('Stator Coil') ? 1.2 : 0.1} metalness={0.3} roughness={0.5} />
        {isH('Stator Coil') && <Html distanceFactor={6} position={[1.2, 0, 0]}><div className="part-label"><strong>Stator Coil</strong><p>Stationary coil that creates the magnetic field.</p></div></Html>}
      </mesh>
      <mesh rotation={[0, Math.PI / 4, Math.PI / 2]} onClick={() => onPartClick('Stator Coil')}>
        <torusGeometry args={[1.1, 0.12, 12, 48]} />
        <meshStandardMaterial color="#FBBF24" emissive={isH('Stator Coil') ? '#F59E0B' : '#000'} emissiveIntensity={isH('Stator Coil') ? 1.2 : 0.1} metalness={0.3} roughness={0.5} transparent opacity={0.7} />
      </mesh>

      {/* Carbon Brushes */}
      {[0.75, -0.75].map((x, i) => (
        <mesh key={i} position={[x, -0.8, 0]} onClick={() => onPartClick('Carbon Brushes')}>
          <boxGeometry args={[0.15, 0.35, 0.15]} />
          <meshStandardMaterial color="#94A3B8" emissive={isH('Carbon Brushes') ? '#64748B' : '#000'} emissiveIntensity={isH('Carbon Brushes') ? 1.5 : 0} />
          {i === 0 && isH('Carbon Brushes') && <Html distanceFactor={6} position={[0.4, 0, 0]}><div className="part-label"><strong>Carbon Brushes</strong><p>Conduct current from rotor to external circuit.</p></div></Html>}
        </mesh>
      ))}
    </group>
  );
}

function HeartModel({ highlightedPart, onPartClick }) {
  const parts = [
    { name: 'Left Atrium', color: '#F472B6', emissive: '#EC4899', pos: [-0.55, 0.55, 0], scale: [0.7, 0.6, 0.65], desc: 'Receives oxygenated blood from the pulmonary veins.' },
    { name: 'Right Atrium', color: '#60A5FA', emissive: '#3B82F6', pos: [0.55, 0.55, 0], scale: [0.7, 0.6, 0.65], desc: 'Receives deoxygenated blood from the body.' },
    { name: 'Left Ventricle', color: '#EF4444', emissive: '#DC2626', pos: [-0.55, -0.5, 0], scale: [0.7, 0.75, 0.65], desc: 'Pumps oxygenated blood to the body via the aorta.' },
    { name: 'Right Ventricle', color: '#3B82F6', emissive: '#2563EB', pos: [0.55, -0.5, 0], scale: [0.65, 0.75, 0.65], desc: 'Pumps deoxygenated blood to the lungs.' },
  ];
  return (
    <group>
      {parts.map(p => (
        <mesh key={p.name} position={p.pos} scale={p.scale} onClick={() => onPartClick(p.name)}>
          <sphereGeometry args={[0.65, 24, 24]} />
          <meshStandardMaterial color={p.color} emissive={highlightedPart === p.name ? p.emissive : '#000'} emissiveIntensity={highlightedPart === p.name ? 1.2 : 0.15} transparent opacity={0.92} />
          {highlightedPart === p.name && <Html distanceFactor={6} position={[0.8, 0, 0]}><div className="part-label"><strong>{p.name}</strong><p>{p.desc}</p></div></Html>}
        </mesh>
      ))}
      <mesh position={[0, 1.1, 0]} rotation={[0.3, 0, 0.15]}>
        <cylinderGeometry args={[0.12, 0.18, 0.5, 12]} />
        <meshStandardMaterial color="#EF4444" />
      </mesh>
    </group>
  );
}

function DCMotorModel({ highlightedPart, onPartClick }) {
  const armatureRef = useRef();
  const timerRef = useRef(new THREE.Timer());
  useFrame(() => {
    timerRef.current.update();
    const delta = timerRef.current.getDelta();
    if (armatureRef.current) armatureRef.current.rotation.y += delta * 2;
  });
  const isH = (n) => highlightedPart === n;

  return (
    <group>
      {[-1.3, 1.3].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]} onClick={() => onPartClick('Field Magnet')}>
          <boxGeometry args={[0.45, 1.4, 0.6]} />
          <meshStandardMaterial color="#FBBF24" emissive={isH('Field Magnet') ? '#F59E0B' : '#000'} emissiveIntensity={isH('Field Magnet') ? 1.2 : 0.1} metalness={0.5} roughness={0.3} />
          {i === 0 && isH('Field Magnet') && <Html distanceFactor={6} position={[-0.6, 0, 0]}><div className="part-label"><strong>Field Magnet</strong><p>Produces the static magnetic field the armature rotates within.</p></div></Html>}
        </mesh>
      ))}
      <group ref={armatureRef}>
        <mesh onClick={() => onPartClick('Armature')}>
          <cylinderGeometry args={[0.55, 0.55, 1.4, 32]} />
          <meshStandardMaterial color="#5EEAD4" emissive={isH('Armature') ? '#2DD4BF' : '#000'} emissiveIntensity={isH('Armature') ? 1.5 : 0.2} />
          {isH('Armature') && <Html distanceFactor={6} position={[0.8, 0, 0]}><div className="part-label"><strong>Armature</strong><p>Rotating coil experiencing electromagnetic force.</p></div></Html>}
        </mesh>
        <mesh position={[0, -0.85, 0]} onClick={() => onPartClick('Commutator')}>
          <cylinderGeometry args={[0.3, 0.3, 0.25, 16]} />
          <meshStandardMaterial color="#A1A1AA" emissive={isH('Commutator') ? '#71717A' : '#000'} emissiveIntensity={isH('Commutator') ? 1.5 : 0} metalness={0.7} roughness={0.2} />
          {isH('Commutator') && <Html distanceFactor={6} position={[0.5, 0, 0]}><div className="part-label"><strong>Commutator</strong><p>Reverses current direction every half rotation.</p></div></Html>}
        </mesh>
      </group>
      {[0.4, -0.4].map((x, i) => (
        <mesh key={i} position={[x, -0.85, 0]} onClick={() => onPartClick('Brushes')}>
          <boxGeometry args={[0.14, 0.3, 0.14]} />
          <meshStandardMaterial color="#94A3B8" emissive={isH('Brushes') ? '#64748B' : '#000'} emissiveIntensity={isH('Brushes') ? 1.5 : 0} />
          {i === 0 && isH('Brushes') && <Html distanceFactor={6} position={[0.4, 0, 0]}><div className="part-label"><strong>Brushes</strong><p>Maintain electrical contact with the commutator.</p></div></Html>}
        </mesh>
      ))}
    </group>
  );
}

function GenericProceduralModel({ model, highlightedPart, onPartClick }) {
  const positions = [[-0.8, 0.6, 0], [0.8, 0.6, 0], [-0.8, -0.6, 0], [0.8, -0.6, 0], [0, 0, 0], [1.2, 0, 0], [-1.2, 0, 0], [0, 1.2, 0]];
  return (
    <group>
      {model.parts.map((part, i) => (
        <mesh key={part.name} position={positions[i] || [0, 0, 0]} onClick={() => onPartClick(part.name)}>
          <sphereGeometry args={[0.4, 24, 24]} />
          <meshStandardMaterial color={part.color} emissive={highlightedPart === part.name ? part.color : '#000'} emissiveIntensity={highlightedPart === part.name ? 1.2 : 0.1} />
          {highlightedPart === part.name && (
            <Html distanceFactor={6} position={[0.6, 0, 0]}>
              <div className="part-label"><strong>{part.name}</strong><p>{part.description}</p></div>
            </Html>
          )}
        </mesh>
      ))}
    </group>
  );
}

/* ─── Real GLB model loader ─── */

function GLBModel({ fileUrl, model, highlightedPart }) {
  const { scene } = useGLTF(fileUrl);
  return (
    <group>
      <primitive object={scene} />
      {model && model.parts && model.parts.map((part, i) => {
        // Fallback positions if part doesn't have pos
        const defaultPos = [[-0.8, 0.6, 0], [0.8, 0.6, 0], [-0.8, -0.5, 0], [0.8, -0.5, 0]];
        const pos = part.pos || defaultPos[i] || [0, 0, 0];
        
        if (highlightedPart === part.name) {
          return (
            <Html key={part.name} distanceFactor={6} position={pos}>
              <div className="part-label">
                <strong>{part.name}</strong>
                <p>{part.description}</p>
              </div>
            </Html>
          );
        }
        return null;
      })}
    </group>
  );
}

function GLBModelLoader({ fileUrl, model, highlightedPart }) {
  return (
    <Suspense fallback={<LoadingMesh />}>
      <GLBModel fileUrl={fileUrl} model={model} highlightedPart={highlightedPart} />
    </Suspense>
  );
}

function LoadingMesh() {
  const ref = useRef();
  const timerRef = useRef(new THREE.Timer());
  useFrame(() => {
    timerRef.current.update();
    const delta = timerRef.current.getDelta();
    if (ref.current) ref.current.rotation.y += delta;
  });
  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[0.8]} />
      <meshStandardMaterial color="#5EEAD4" wireframe />
    </mesh>
  );
}

/* ─── Scene dispatcher ─── */

function SceneModel({ model, highlightedPart, onPartClick }) {
  if (model.fileUrl) return <GLBModelLoader fileUrl={model.fileUrl} model={model} highlightedPart={highlightedPart} />;
  if (model.id === 'gen-001') return <GeneratorModel highlightedPart={highlightedPart} onPartClick={onPartClick} />;
  if (model.id === 'heart-001') return <HeartModel highlightedPart={highlightedPart} onPartClick={onPartClick} />;
  if (model.id === 'motor-001') return <DCMotorModel highlightedPart={highlightedPart} onPartClick={onPartClick} />;
  return <GenericProceduralModel model={model} highlightedPart={highlightedPart} onPartClick={onPartClick} />;
}

/* ─── Main component ─── */

export default function ModelViewer3D({ model, showAIBanner = false, onMarkUnderstood }) {
  const [highlightedPart, setHighlightedPart] = useState(null);
  const [understood, setUnderstood] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const focusedPartObj = highlightedPart
    ? model.parts?.find(p => p.name === highlightedPart) || { name: highlightedPart, description: '' }
    : null;

  const handleMarkUnderstood = () => {
    setUnderstood(true);
    setShowConfirm(true);
    setTimeout(() => setShowConfirm(false), 2500);
    if (onMarkUnderstood) onMarkUnderstood(model.id);
  };

  return (
    <div className="model-viewer-wrap">
      <div className="model-left-col">
        {showAIBanner && (
          <div className="ai-banner">
            <span className="ai-icon">✨</span>
            <div>
              <strong>Recommended for you</strong>
              <span className="ai-reason">Because you're studying {model.chapter} — 95% match</span>
            </div>
            <a href="#" className="ai-feedback-link" onClick={e => e.preventDefault()}>Not relevant? Tell us</a>
          </div>
        )}

        <div className="canvas-wrap">
          <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
            <directionalLight position={[-3, -2, -3]} intensity={0.3} color="#5EEAD4" />
            <SceneModel model={model} highlightedPart={highlightedPart} onPartClick={setHighlightedPart} />
            <OrbitControls enableZoom enablePan autoRotate autoRotateSpeed={0.5} makeDefault />
          </Canvas>
          <div className="canvas-hint">Drag to rotate · Scroll to zoom</div>
        </div>

        {/* Explore Parts (only for models with parts array) */}
        {model.parts && model.parts.length > 0 && (
          <div className="explore-parts">
            <div className="explore-parts-title">Explore Parts</div>
            <div className="parts-buttons">
              {model.parts.map(part => (
                <button
                  key={part.name}
                  className={`part-btn ${highlightedPart === part.name ? 'active' : ''}`}
                  style={{ '--part-color': part.color, borderColor: highlightedPart === part.name ? part.color : 'transparent' }}
                  onClick={() => setHighlightedPart(prev => prev === part.name ? null : part.name)}
                >
                  <span className="part-dot" style={{ background: part.color }} />
                  {part.name}
                </button>
              ))}
            </div>
            {highlightedPart && (() => {
              const part = model.parts.find(p => p.name === highlightedPart);
              return part ? (
                <div className="part-description-card">
                  <strong style={{ color: part.color }}>{part.name}</strong>
                  <p>{part.description}</p>
                </div>
              ) : null;
            })()}
          </div>
        )}

        {/* For GLB models without parts — just a plain bottom border */}
        {model.fileUrl && (!model.parts || model.parts.length === 0) && (
          <div className="explore-parts">
            <div className="explore-parts-title" style={{ color: 'var(--text-secondary)' }}>
              🗂 Drag to rotate · Scroll to zoom · This is your custom model
            </div>
          </div>
        )}

        {/* Mark as Understood */}
        {onMarkUnderstood && (
          <div className="understood-section">
            <button
              className={`btn ${understood ? 'btn-success' : 'btn-primary'}`}
              onClick={handleMarkUnderstood}
              disabled={understood}
            >
              {understood ? '✓ Understood!' : '✓ Mark as Understood'}
            </button>
            {showConfirm && (
              <div className="confirm-msg">🎉 Great! This counts toward your learning streak!</div>
            )}
          </div>
        )}
      </div>

      <div className="model-right-col">
        {/* ✦ Gemini AI Explanation Panel */}
        <AIExplanationPanel model={model} focusedPart={focusedPartObj} />
      </div>
    </div>
  );
}

