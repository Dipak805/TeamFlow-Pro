import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../api/axios';
import { avatarColor, initials, formatDate, statusLabel } from '../../utils/helpers';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { CheckSquare, Users, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

export default function TeamLeadDashboard() {
  const [stats, setStats] = useState(null);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/teamlead/dashboard'),
      api.get('/teamlead/my-team')
    ]).then(([s, t]) => { setStats(s.data); setTeam(t.data); }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout title="Dashboard"><div className="loading-spinner"><div className="spinner"></div></div></Layout>;

  const pieData = [
    { name: 'To Do', value: stats?.todoTasks || 0, color: '#94a3b8' },
    { name: 'In Progress', value: stats?.inProgressTasks || 0, color: '#3b82f6' },
    { name: 'Review', value: stats?.reviewTasks || 0, color: '#f59e0b' },
    { name: 'Done', value: stats?.doneTasks || 0, color: '#10b981' },
  ];

  const perfData = (stats?.memberPerformances || []).map(p => ({
    name: p.memberName?.split(' ')[0] || 'User',
    completed: p.completedTasks || 0,
    total: p.totalTasks || 0,
  }));

  const statCards = [
    { icon: Users, label: 'Team Members', value: team?.members?.length || 0, color: '#6366f1', bg: '#ede9fe' },
    { icon: CheckSquare, label: 'Total Tasks', value: stats?.totalTasks || 0, color: '#0ea5e9', bg: '#e0f2fe' },
    { icon: TrendingUp, label: 'Completed', value: stats?.doneTasks || 0, color: '#10b981', bg: '#d1fae5' },
    { icon: Clock, label: 'In Progress', value: stats?.inProgressTasks || 0, color: '#f59e0b', bg: '#fef3c7' },
    { icon: AlertTriangle, label: 'Overdue', value: stats?.overdueTasks || 0, color: '#ef4444', bg: '#fee2e2' },
  ];

  return (
    <Layout title="Team Dashboard" subtitle={team ? `Managing: ${team.name}` : 'Your team overview'}>

      <div className="stats-grid">
        {statCards.map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg }}><s.icon size={22} color={s.color} /></div>
            <div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, marginBottom: 24 }}>
        <div className="card">
          <div className="card-header"><span className="card-title">Member Performance</span></div>
          <div className="card-body" style={{ padding: '12px 8px' }}>
            {perfData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={perfData} margin={{ top: 0, right: 16, bottom: 0, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
                  <Bar dataKey="total" fill="#e0e7ff" radius={[6,6,0,0]} name="Total" />
                  <Bar dataKey="completed" fill="#6366f1" radius={[6,6,0,0]} name="Completed" />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="empty-state"><p>No data yet</p></div>}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Task Status</span></div>
          <div className="card-body" style={{ padding: 8 }}>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3}>
                  {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="card">
        <div className="card-header"><span className="card-title">Recent Tasks</span></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Task</th><th>Assigned To</th><th>Status</th><th>Priority</th><th>Due Date</th></tr></thead>
            <tbody>
              {(stats?.recentTasks || []).slice(0, 6).map(t => (
                <tr key={t.id}>
                  <td style={{ fontWeight: 600 }}>{t.title}</td>
                  <td>
                    {t.assignedTo ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div className="avatar avatar-sm" style={{ background: avatarColor(t.assignedTo.name || ''), color: '#fff' }}>{initials(t.assignedTo.name || '')}</div>
                        {t.assignedTo.name}
                      </div>
                    ) : '—'}
                  </td>
                  <td><span className={`badge badge-${t.status?.toLowerCase()}`}>{statusLabel(t.status)}</span></td>
                  <td><span className={`badge badge-${t.priority?.toLowerCase()}`}>{t.priority}</span></td>
                  <td style={{ color: t.overdue ? '#ef4444' : undefined, fontSize: 13 }}>{formatDate(t.dueDate)}</td>
                </tr>
              ))}
              {!stats?.recentTasks?.length && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8', padding: 24 }}>No tasks yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
