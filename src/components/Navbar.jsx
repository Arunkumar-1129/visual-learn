import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();

  const isLearner = location.pathname.startsWith('/learner');
  const isCreator = location.pathname.startsWith('/creator');

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">⬡</span>
          <span className="logo-text">VisualLearn</span>
        </Link>

        <div className="navbar-center">
          <Link
            to="/learner"
            className={`nav-role-btn ${isLearner ? 'active-learner' : ''}`}
          >
            <span>🎓</span>
            Learner
          </Link>
          <div className="nav-divider" />
          <Link
            to="/creator"
            className={`nav-role-btn ${isCreator ? 'active-creator' : ''}`}
          >
            <span>🔬</span>
            Creator
          </Link>
        </div>

        <div className="navbar-right">
          {isLearner && (
            <div className="learner-sub-nav">
              <Link
                to="/learner/teacher"
                className={`sub-nav-btn ${location.pathname === '/learner/teacher' ? 'active' : ''}`}
              >
                👩‍🏫 Teacher
              </Link>
              <Link
                to="/learner/student"
                className={`sub-nav-btn ${location.pathname === '/learner/student' ? 'active' : ''}`}
              >
                🎒 Student
              </Link>
            </div>
          )}
          {!isLearner && (
            <a href="/" className="nav-cta-btn">
              Get Started →
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
