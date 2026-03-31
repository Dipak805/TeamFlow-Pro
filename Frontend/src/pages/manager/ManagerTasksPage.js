import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../api/axios';
import TaskModal from '../../components/tasks/TaskModal';
import { avatarColor, initials, formatDate, statusLabel } from '../../utils/helpers';
import { Search, Filter } from 'lucide-react';

export default function ManagerTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  const load = () => api.get('/manager/tasks').then(r => { setTasks(r.data); setLoading(false); });
  useEffect(() => { load(); }, []);

  const filtered = tasks.filter(t => {
    const matchSearch = !search || t.title?.toLowerCase().includes(search.toLowerCase()) || t.assignedTo?.fullName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || t.status === filterStatus;
    const matchPriority = !filterPriority || t.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  const kanbanCols = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];
  const colColors = { TODO: '#94a3b8', IN_PROGRESS: '#3b82f6', REVIEW: '#f59e0b', DONE: '#10b981' };

  return (
    <Layout title="All Tasks" subtitle="View and monitor tasks across all teams"
      actions={
        <div style={{ display: 'flex', gap: 10 }}>
          <div className="search-box">
            <Search size={15} color="#94a3b8" />
            <input placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ width: 140 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            {kanbanCols.map(s => <option key={s} value={s}>{statusLabel(s)}</option>)}
          </select>
          <select className="form-select" style={{ width: 130 }} value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
            <option value="">All Priority</option>
            {['LOW','MEDIUM','HIGH'].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      }>

      {loading ? <div className="loading-spinner"><div className="spinner"></div></div> : (
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
                      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{t.title}</div>
                      {t.teamName && <div style={{ fontSize: 11, color: '#6366f1', fontWeight: 600, marginBottom: 6 }}>{t.teamName}</div>}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                        <span className={`badge badge-${t.priority?.toLowerCase()}`}>{t.priority}</span>
                        {t.assignedTo && (
                          <div className="avatar avatar-sm" title={t.assignedTo.name} style={{ background: avatarColor(t.assignedTo.name || ''), color: '#fff' }}>
                            {initials(t.assignedTo.name || '')}
                          </div>
                        )}
                      </div>
                      {t.dueDate && (
                        <div style={{ fontSize: 11, color: t.overdue ? '#ef4444' : '#94a3b8', marginTop: 6 }}>
                          Due {formatDate(t.dueDate)}
                        </div>
                      )}
                    </div>
                  ))}
                  {colTasks.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '20px 0', color: '#cbd5e1', fontSize: 12 }}>No tasks</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && (
        <TaskModal task={selected} onClose={() => setSelected(null)} onUpdate={load} canEdit={false} />
      )}
    </Layout>
  );
}
