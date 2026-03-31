import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../api/axios';
import TaskModal from '../../components/tasks/TaskModal';
import { formatDate, statusLabel, avatarColor, initials } from '../../utils/helpers';
import { CheckSquare, Clock, AlertTriangle, Search } from 'lucide-react';

export default function MemberTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const load = () => api.get('/member/tasks').then(r => { setTasks(r.data); setLoading(false); });
  useEffect(() => { load(); }, []);

  const filtered = tasks.filter(t => {
    const matchSearch = !search || t.title?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || t.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const todo = tasks.filter(t => t.status === 'TODO').length;
  const inProg = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const done = tasks.filter(t => t.status === 'DONE').length;
  const overdue = tasks.filter(t => t.overdue).length;

  const kanbanCols = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];
  const colColors = { TODO: '#94a3b8', IN_PROGRESS: '#3b82f6', REVIEW: '#f59e0b', DONE: '#10b981' };

  return (
    <Layout title="My Tasks" subtitle="Track and update your assigned tasks"
      actions={
        <div style={{ display: 'flex', gap: 10 }}>
          <div className="search-box">
            <Search size={15} color="#94a3b8" />
            <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ width: 140 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            {kanbanCols.map(s => <option key={s} value={s}>{statusLabel(s)}</option>)}
          </select>
        </div>
      }>

      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {[
          { icon: CheckSquare, label: 'To Do', value: todo, color: '#6366f1', bg: '#ede9fe' },
          { icon: Clock, label: 'In Progress', value: inProg, color: '#0ea5e9', bg: '#e0f2fe' },
          { icon: CheckSquare, label: 'Done', value: done, color: '#10b981', bg: '#d1fae5' },
          { icon: AlertTriangle, label: 'Overdue', value: overdue, color: '#ef4444', bg: '#fee2e2' },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg }}><s.icon size={22} color={s.color} /></div>
            <div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {loading ? <div className="loading-spinner"><div className="spinner"></div></div> : (
        filterStatus ? (
          /* List view when filtering */
          <div className="card">
            <div className="table-wrap">
              <table>
                <thead><tr><th>Task</th><th>Team</th><th>Status</th><th>Priority</th><th>Due</th></tr></thead>
                <tbody>
                  {filtered.map(t => (
                    <tr key={t.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(t)}>
                      <td style={{ fontWeight: 600 }}>{t.title}</td>
                      <td style={{ color: '#6366f1', fontWeight: 600, fontSize: 13 }}>{t.teamName || '—'}</td>
                      <td><span className={`badge badge-${t.status?.toLowerCase()}`}>{statusLabel(t.status)}</span></td>
                      <td><span className={`badge badge-${t.priority?.toLowerCase()}`}>{t.priority}</span></td>
                      <td style={{ color: t.overdue ? '#ef4444' : undefined, fontSize: 13 }}>{formatDate(t.dueDate)}</td>
                    </tr>
                  ))}
                  {filtered.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8', padding: 24 }}>No tasks found</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Kanban view */
          <div className="kanban-board">
            {kanbanCols.map(col => {
              const colTasks = filtered.filter(t => t.status === col);
              return (
                <div className="kanban-col" key={col}>
                  <div className="kanban-col-header">
                    <span className="kanban-col-title" style={{ color: colColors[col] }}>{statusLabel(col)}</span>
                    <span className="kanban-count">{colTasks.length}</span>
                  </div>
                  <div className="kanban-tasks">
                    {colTasks.map(t => (
                      <div key={t.id} className={`task-card ${t.overdue ? 'overdue' : ''}`} onClick={() => setSelected(t)}>
                        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{t.title}</div>
                        {t.teamName && <div style={{ fontSize: 11, color: '#6366f1', fontWeight: 600, marginBottom: 6 }}>{t.teamName}</div>}
                        {t.description && (
                          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {t.description}
                          </div>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span className={`badge badge-${t.priority?.toLowerCase()}`}>{t.priority}</span>
                          {t.dueDate && (
                            <span style={{ fontSize: 11, color: t.overdue ? '#ef4444' : '#94a3b8' }}>
                              {formatDate(t.dueDate)}
                            </span>
                          )}
                        </div>
                        <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid #f1f5f9', fontSize: 12, color: '#94a3b8' }}>
                          Click to update status
                        </div>
                      </div>
                    ))}
                    {colTasks.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '16px 0', color: '#cbd5e1', fontSize: 12 }}>Empty</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {selected && (
        <TaskModal task={selected} onClose={() => setSelected(null)} onUpdate={load} canEdit={false} />
      )}
    </Layout>
  );
}
