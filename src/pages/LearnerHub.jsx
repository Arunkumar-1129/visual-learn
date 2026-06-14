import React from 'react';
import { Link } from 'react-router-dom';
import './LearnerHub.css';

export default function LearnerHub() {
  return (
    <div className="learner-hub">
      <div className="container">
        <div className="hub-header">
          <h1 className="page-title">Welcome to VisualLearn</h1>
          <p className="page-subtitle">Tell us how you're using VisualLearn today</p>
        </div>

        <div className="hub-cards">
          <Link to="/learner/teacher" className="hub-card hub-card-teacher">
            <div className="hub-card-glow" />
            <div className="hub-emoji">👩‍🏫</div>
            <h2>I'm a Teacher</h2>
            <p>Build classrooms, license 3D models from the marketplace, and assign them to your students.</p>
            <ul className="hub-features">
              <li>✓ Browse & license models</li>
              <li>✓ Create and manage classrooms</li>
              <li>✓ Assign models to students</li>
              <li>✓ Track student engagement</li>
            </ul>
            <div className="hub-cta">Enter Teacher Dashboard →</div>
          </Link>

          <Link to="/learner/student" className="hub-card hub-card-student">
            <div className="hub-card-glow hub-card-glow-student" />
            <div className="hub-emoji">🎒</div>
            <h2>I'm a Student</h2>
            <p>Join your teacher's classroom, explore interactive 3D models, and learn concepts visually.</p>
            <ul className="hub-features">
              <li>✓ Join classroom with class code</li>
              <li>✓ Explore interactive 3D models</li>
              <li>✓ AI-recommended content</li>
              <li>✓ Track your learning progress</li>
            </ul>
            <div className="hub-cta hub-cta-student">Enter Student View →</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
