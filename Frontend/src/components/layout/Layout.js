import React from 'react';
import Sidebar from './Sidebar';

export default function Layout({ children, title, subtitle, actions }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <div className="topbar">
          <div>
            <div className="topbar-title">{title}</div>
            {subtitle && <div className="topbar-subtitle">{subtitle}</div>}
          </div>
          {actions && <div className="topbar-actions">{actions}</div>}
        </div>
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}
