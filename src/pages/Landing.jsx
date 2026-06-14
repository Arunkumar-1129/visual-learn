import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import './Landing.css';

function HeroGenerator() {
  const rotorRef = useRef();

  useFrame((state, delta) => {
    if (rotorRef.current) {
      rotorRef.current.rotation.y += delta * 1.8;
    }
  });

  return (
    <group>
      {/* Shaft */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 4, 16]} />
        <meshStandardMaterial color="#F5F5F0" metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Rotor */}
      <group ref={rotorRef}>
        <mesh>
          <cylinderGeometry args={[0.65, 0.65, 1.8, 32]} />
          <meshStandardMaterial
            color="#5EEAD4"
            emissive="#2DD4BF"
            emissiveIntensity={0.3}
            metalness={0.4}
            roughness={0.4}
          />
        </mesh>
      </group>

      {/* Stator Coil 1 */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.2, 0.22, 16, 60]} />
        <meshStandardMaterial
          color="#FBBF24"
          emissive="#F59E0B"
          emissiveIntensity={0.2}
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>

      {/* Stator Coil 2 */}
      <mesh rotation={[0, Math.PI / 3, Math.PI / 2]}>
        <torusGeometry args={[1.2, 0.13, 12, 60]} />
        <meshStandardMaterial
          color="#FBBF24"
          emissive="#F59E0B"
          emissiveIntensity={0.15}
          metalness={0.3}
          roughness={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Carbon Brush 1 */}
      <mesh position={[0.8, -0.9, 0]}>
        <boxGeometry args={[0.16, 0.38, 0.16]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.2} roughness={0.8} />
      </mesh>

      {/* Carbon Brush 2 */}
      <mesh position={[-0.8, -0.9, 0]}>
        <boxGeometry args={[0.16, 0.38, 0.16]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.2} roughness={0.8} />
      </mesh>
    </group>
  );
}

const steps = [
  {
    number: "01",
    title: "Create an Account",
    description: "Sign up as a Learner or Creator and set up your profile in minutes.",
    icon: "👤",
    color: "var(--accent-cyan)"
  },
  {
    number: "02",
    title: "Browse or Upload",
    description: "Discover and license 3D models as a Learner, or upload your creations as a Creator.",
    icon: "🔭",
    color: "var(--accent-amber)"
  },
  {
    number: "03",
    title: "Learn or Earn",
    description: "Use models in your classroom to teach and learn, or earn money by licensing your creations.",
    icon: "🚀",
    color: "var(--success)"
  }
];

export default function Landing() {
  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero">
        <div className="hero-glow hero-glow-cyan" />
        <div className="hero-glow hero-glow-amber" />

        <div className="hero-content">
          <div className="hero-badge">
            <span>✨</span> Powered by AI-tagged 3D models
          </div>
          <h1 className="hero-headline">
            See how it <span className="gradient-text-cyan">actually works.</span>
          </h1>
          <p className="hero-subheadline">
            VisualLearn turns textbook theory into interactive 3D experiences —
            for students, teachers, and creators.
          </p>
          <div className="hero-ctas">
            <Link to="/learner" className="hero-btn-learner">
              I'm a Learner →
            </Link>
            <Link to="/creator" className="hero-btn-creator">
              I'm a Creator →
            </Link>
          </div>
        </div>

        <div className="hero-3d">
          <div className="hero-3d-label">Electric Generator · Drag to rotate</div>
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} />
            <directionalLight position={[-4, -2, -3]} intensity={0.4} color="#5EEAD4" />
            <pointLight position={[0, 3, 0]} intensity={0.5} color="#FBBF24" />
            <HeroGenerator />
            <OrbitControls enableZoom enablePan autoRotate autoRotateSpeed={0.8} />
          </Canvas>
        </div>
      </section>

      {/* 3-step Onboarding */}
      <section className="onboarding-section container">
        <div className="section-header">
          <h2 className="section-title">How VisualLearn works</h2>
          <p className="section-subtitle">From signup to learning — three simple steps</p>
        </div>
        <div className="steps-grid">
          {steps.map((step, i) => (
            <div key={i} className="step-card">
              <div className="step-number" style={{ color: step.color }}>
                {step.number}
              </div>
              <div className="step-icon">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.description}</p>
              <div className="step-line" style={{ background: step.color }} />
            </div>
          ))}
        </div>
      </section>

      {/* Role CTA Cards */}
      <section className="role-cta-section container">
        <div className="role-cards">
          <Link to="/learner" className="role-card role-card-learner">
            <div className="role-card-glow" />
            <div className="role-emoji">🎓</div>
            <h2>I'm a Learner</h2>
            <p>Teachers build classrooms and license models. Students explore, visualize, and understand concepts in 3D.</p>
            <div className="role-card-tags">
              <span>Teachers</span>
              <span>Students</span>
              <span>Classrooms</span>
            </div>
            <div className="role-card-cta">Get started as a Learner →</div>
          </Link>

          <Link to="/creator" className="role-card role-card-creator">
            <div className="role-card-glow role-card-glow-amber" />
            <div className="role-emoji">🔬</div>
            <h2>I'm a Creator</h2>
            <p>Upload interactive 3D STEM models, set your price, and earn every time a teacher licenses your content.</p>
            <div className="role-card-tags">
              <span>Upload Models</span>
              <span>Set Pricing</span>
              <span>Earn Revenue</span>
            </div>
            <div className="role-card-cta role-card-cta-amber">Start creating →</div>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-inner container">
          <div className="footer-logo">
            <span>⬡</span> VisualLearn
          </div>
          <p className="footer-tagline">Creators sell. Teachers buy. Students learn. Everyone wins.</p>
          <p className="footer-copy">© 2025 VisualLearn 2.0 — Portfolio Prototype</p>
        </div>
      </footer>
    </div>
  );
}
