import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar';
import SRSUpload from './pages/SRSUpload';
import TestCases from './pages/TestCases';
import Scripts from './pages/Scripts';
import Execute from './pages/Execute';
import Reports from './pages/Reports';

// PUBLIC_INTERFACE
function App() {
  /** Main App with sidebar layout, theme toggle, and route rendering. */
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));

  return (
    <div className="app-shell" data-theme={theme}>
      <aside className="sidebar">
        <div className="brand">V&V Automation</div>
        <nav className="nav-group">
          <Sidebar />
        </nav>
        <div className="sidebar-footer">Navy Blue Theme</div>
      </aside>

      <section className="main">
        <div className="topbar">
          <div>
            <strong>AI-enabled Verification & Validation</strong>
          </div>
          <div>
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
        </div>

        <div className="content">
          <Routes>
            <Route path="/" element={<SRSUpload />} />
            <Route path="/srs" element={<SRSUpload />} />
            <Route path="/testcases" element={<TestCases />} />
            <Route path="/scripts" element={<Scripts />} />
            <Route path="/execute" element={<Execute />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </section>
    </div>
  );
}

export default App;
