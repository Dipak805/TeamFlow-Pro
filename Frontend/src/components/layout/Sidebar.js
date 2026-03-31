import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { avatarColor, initials } from '../../utils/helpers';
import {
  LayoutDashboard, CheckSquare, Users, UsersRound, Bell,
  LogOut, ChevronRight, BarChart3, Folder
} from 'lucide-react';
import api from '../../api/axios';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    fetchUnread();
    const t = setInterval(fetchUnread, 30000);
    return () => clearInterval(t);
  }, []);

  const fetchUnread = async () => {
    try {
      const res = await api.get('/member/notifications/unread-count');
      setUnread(res.data);
    } catch {}
  };

  const role = user?.role;
  const base = role === 'MANAGER' ? '/manager' : role === 'TEAM_LEAD' ? '/teamlead' : '/member';

  const navGroups = {
    MANAGER: [
      { label: 'Overview', items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/manager/dashboard' },
        { icon: BarChart3, label: 'Analytics', path: '/manager/analytics' },
      ]},
      { label: 'Management', items: [
        { icon: UsersRound, label: 'Teams', path: '/manager/teams' },
        { icon: Users, label: 'Users', path: '/manager/users' },
        { icon: CheckSquare, label: 'All Tasks', path: '/manager/tasks' },
      ]},
      { label: 'Account', items: [
        { icon: Bell, label: 'Notifications', path: '/member/notifications', badge: unread },
      ]},
    ],
    TEAM_LEAD: [
      { label: 'Overview', items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/teamlead/dashboard' },
      ]},
      { label: 'My Team', items: [
        { icon: Users, label: 'Team Members', path: '/teamlead/team' },
        { icon: CheckSquare, label: 'Tasks', path: '/teamlead/tasks' },
      ]},
      { label: 'Account', items: [
        { icon: Bell, label: 'Notifications', path: '/member/notifications', badge: unread },
      ]},
    ],
    MEMBER: [
      { label: 'My Work', items: [
        { icon: CheckSquare, label: 'My Tasks', path: '/member/tasks' },
        { icon: Folder, label: 'Files', path: '/member/files' },
        { icon: Bell, label: 'Notifications', path: '/member/notifications', badge: unread },
      ]},
    ],
  };

  const groups = navGroups[role] || navGroups.MEMBER;
  const roleColors = { MANAGER: '#7c3aed', TEAM_LEAD: '#0369a1', MEMBER: '#059669' };

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-text">Team<span>Flow</span></div>
        <span className="role-badge">{role?.replace('_', ' ')}</span>
      </div>

      <div className="sidebar-nav">
        {groups.map(group => (
          <div key={group.label}>
            <div className="nav-section-label">{group.label}</div>
            {group.items.map(item => {
              const Icon = item.icon;
              const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              return (
                <button
                  key={item.path}
                  className={`nav-item ${active ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <Icon className="nav-icon" size={18} />
                  {item.label}
                  {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
                  {active && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="avatar" style={{ background: avatarColor(user?.fullName || ''), color: '#fff' }}>
            {initials(user?.fullName || user?.username || '')}
          </div>
          <div>
            <div className="user-name">{user?.fullName || user?.username}</div>
            <div className="user-email">{user?.email}</div>
          </div>
          <button className="logout-btn" onClick={logout} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}
