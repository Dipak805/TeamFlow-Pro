import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../api/axios';
import { avatarColor, initials, formatDate, statusLabel } from '../../utils/helpers';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Users, CheckSquare, UsersRound, AlertTriangle, Clock, TrendingUp, Award } from 'lucide-react';

export default function ManagerDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/manager/dashboard').then(r => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout title="Dashboard"><div className="loading-spinner"><div className="spinner"></div></div></Layout>;

  const taskStatus = [
    { name: 'To Do', value: stats?.todoTasks || 0, color: '#94a3b8' },
    { name: 'In Progress', value: stats?.inProgressTasks || 0, color: '#3b82f6' },
    { name: 'Review', value: stats?.reviewTasks || 0, color: '#f59e0b' },
    { name: 'Done', value: stats?.doneTasks || 0, color: '#10b981' },
  ];

  const perfData = (stats?.memberPerformances || []).slice(0, 8).map(p => ({
    name: p.memberName?.split(' ')[0] || 'User',
    done: p.completedTasks || 0,
    total: p.totalTasks || 0,
  }));

  const statCards = [
    { icon: UsersRound, label: 'Total Teams', value: stats?.totalTeams || 0, color: '#6366f1', bg: '#ede9fe' },
    { icon: Users, label: 'Total Users', value: stats?.totalUsers || 0, color: '#0ea5e9', bg: '#e0f2fe' },
    { icon: CheckSquare, label: 'Total Tasks', value: stats?.totalTasks || 0, color: '#10b981', bg: '#d1fae5' },
    { icon: TrendingUp, label: 'Completed', value: stats?.doneTasks || 0, color: '#8b5cf6', bg: '#ede9fe' },
    { icon: Clock, label: 'In Progress', value: stats?.inProgressTasks || 0, color: '#f59e0b', bg: '#fef3c7' },
    { icon: AlertTriangle, label: 'Overdue', value: stats?.overdueTasks || 0, color: '#ef4444', bg: '#fee2e2' },
  ];

  return (
    <Layout title="Dashboard" subtitle={`Overview of your organization · ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}>

      <div className="stats-grid">
        {statCards.map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg }}>
              <s.icon size={22} color={s.color} />
            </div>
            <div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 24 }}>
        <div className="card">
          <div className="card-header"><span className="card-title">Team Performance</span></div>
          <div className="card-body" style={{ padding: '16px 8px' }}>
            {perfData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={perfData} margin={{ top: 0, right: 16, bottom: 0, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
                  <Bar dataKey="total" fill="#e0e7ff" radius={[6,6,0,0]} name="Total" />
                  <Bar dataKey="done" fill="#6366f1" radius={[6,6,0,0]} name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="empty-state"><p>No performance data yet</p></div>}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Task Status</span></div>
          <div className="card-body" style={{ padding: '8px' }}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={taskStatus} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {taskStatus.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Recent Tasks</span>
          <span className="badge badge-in_progress">{stats?.recentTasks?.length || 0} tasks</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {(stats?.recentTasks || []).slice(0, 8).map(t => (
                <tr key={t.id}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{t.title}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{t.teamName}</div>
                  </td>
                  <td>
                    {t.assignedTo ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="avatar avatar-sm" style={{ background: avatarColor(t.assignedTo.name || ''), color: '#fff' }}>
                          {initials(t.assignedTo.name || '')}
                        </div>
                        {t.assignedTo.name}
                      </div>
                    ) : '—'}
                  </td>
                  <td><span className={`badge badge-${t.status?.toLowerCase()}`}>{statusLabel(t.status)}</span></td>
                  <td><span className={`badge badge-${t.priority?.toLowerCase()}`}>{t.priority}</span></td>
                  <td style={{ color: t.overdue ? '#ef4444' : undefined }}>{formatDate(t.dueDate)}</td>
                </tr>
              ))}
              {(!stats?.recentTasks?.length) && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8', padding: 32 }}>No tasks yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
