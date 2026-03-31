import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../api/axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area
} from 'recharts';
import { Award, TrendingUp, AlertTriangle } from 'lucide-react';
import { avatarColor, initials } from '../../utils/helpers';

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/manager/dashboard').then(r => setStats(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout title="Analytics"><div className="loading-spinner"><div className="spinner"></div></div></Layout>;

  const pieData = [
    { name: 'To Do', value: stats?.todoTasks || 0, color: '#94a3b8' },
    { name: 'In Progress', value: stats?.inProgressTasks || 0, color: '#3b82f6' },
    { name: 'Review', value: stats?.reviewTasks || 0, color: '#f59e0b' },
    { name: 'Done', value: stats?.doneTasks || 0, color: '#10b981' },
  ];

  const priorityData = [
    { name: 'High Priority', value: stats?.highPriorityTasks || 0, color: '#ef4444' },
    { name: 'Overdue', value: stats?.overdueTasks || 0, color: '#f97316' },
    { name: 'Completed', value: stats?.doneTasks || 0, color: '#10b981' },
  ];

  const perfData = (stats?.memberPerformances || []).map(p => ({
    name: p.memberName?.split(' ')[0] || 'User',
    completed: p.completedTasks || 0,
    total: p.totalTasks || 0,
    rate: p.totalTasks > 0 ? Math.round((p.completedTasks / p.totalTasks) * 100) : 0,
  }));

  const completionRate = stats?.totalTasks > 0
    ? Math.round((stats.doneTasks / stats.totalTasks) * 100) : 0;

  return (
    <Layout title="Analytics" subtitle="Performance insights and task metrics">
      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 48, fontWeight: 900, color: '#6366f1' }}>{completionRate}%</div>
          <div style={{ color: '#64748b', fontWeight: 600, marginTop: 4 }}>Overall Completion Rate</div>
          <div className="progress-bar" style={{ marginTop: 12 }}>
            <div className="progress-fill" style={{ width: `${completionRate}%`, background: '#6366f1' }}></div>
          </div>
        </div>
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
            <AlertTriangle size={20} color="#ef4444" />
            <div style={{ fontSize: 48, fontWeight: 900, color: '#ef4444' }}>{stats?.overdueTasks || 0}</div>
          </div>
          <div style={{ color: '#64748b', fontWeight: 600 }}>Overdue Tasks</div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Require immediate attention</div>
        </div>
        <div className="card" style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
            <TrendingUp size={20} color="#10b981" />
            <div style={{ fontSize: 48, fontWeight: 900, color: '#10b981' }}>{stats?.doneTasks || 0}</div>
          </div>
          <div style={{ color: '#64748b', fontWeight: 600 }}>Tasks Completed</div>
          <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>of {stats?.totalTasks || 0} total tasks</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div className="card">
          <div className="card-header"><span className="card-title">Task Distribution</span></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={90} paddingAngle={3} label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                  {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">Key Metrics</span></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={priorityData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={90} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
                <Bar dataKey="value" radius={[0,6,6,0]}>
                  {priorityData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Member Performance */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Member Performance</span>
          <Award size={18} color="#f59e0b" />
        </div>
        {perfData.length > 0 ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Member</th><th>Total Tasks</th><th>Completed</th><th>Completion Rate</th><th></th></tr>
              </thead>
              <tbody>
                {perfData.sort((a, b) => b.rate - a.rate).map((p, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="avatar avatar-sm" style={{ background: avatarColor(p.name), color: '#fff' }}>{initials(p.name)}</div>
                        {p.name}
                      </div>
                    </td>
                    <td>{p.total}</td>
                    <td style={{ color: '#10b981', fontWeight: 700 }}>{p.completed}</td>
                    <td style={{ minWidth: 150 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="progress-bar" style={{ flex: 1 }}>
                          <div className="progress-fill" style={{
                            width: `${p.rate}%`,
                            background: p.rate >= 75 ? '#10b981' : p.rate >= 50 ? '#f59e0b' : '#ef4444'
                          }}></div>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, width: 36 }}>{p.rate}%</span>
                      </div>
                    </td>
                    <td>
                      {i === 0 && <span className="badge" style={{ background: '#fef3c7', color: '#d97706' }}>⭐ Top</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state"><p>No performance data yet</p></div>
        )}
      </div>
    </Layout>
  );
}
