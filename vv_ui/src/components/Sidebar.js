import React from 'react';
import { NavLink } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Sidebar() {
  /** Sidebar navigation between routes */
  const items = [
    { to: '/srs', label: 'SRS Upload', emoji: '📄' },
    { to: '/testcases', label: 'Test Cases', emoji: '🧪' },
    { to: '/scripts', label: 'Scripts', emoji: '📜' },
    { to: '/execute', label: 'Execute', emoji: '▶️' },
    { to: '/reports', label: 'Reports', emoji: '📊' },
  ];

  return (
    <div>
      {items.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <span aria-hidden="true">{it.emoji}</span>
          <span>{it.label}</span>
        </NavLink>
      ))}
    </div>
  );
}
