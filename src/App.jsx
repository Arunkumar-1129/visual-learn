import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MarketplaceProvider } from './context/MarketplaceContext';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Creator from './pages/Creator';
import LearnerHub from './pages/LearnerHub';
import Teacher from './pages/Teacher';
import Student from './pages/Student';

export default function App() {
  return (
    <BrowserRouter>
      <MarketplaceProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/creator" element={<Creator />} />
          <Route path="/learner" element={<LearnerHub />} />
          <Route path="/learner/teacher" element={<Teacher />} />
          <Route path="/learner/student" element={<Student />} />
        </Routes>
      </MarketplaceProvider>
    </BrowserRouter>
  );
}
