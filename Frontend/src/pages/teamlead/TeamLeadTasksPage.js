import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../api/axios';
import TaskModal from '../../components/tasks/TaskModal';
import toast from 'react-hot-toast';
import { avatarColor, initials, formatDate, statusLabel } from '../../utils/helpers';
import { Plus, X, Search } from 'lucide-react';

export default function TeamLeadTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('kanban');
  const [form, setForm] = useState({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assignedToId: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [t, m] = await Promise.all([api.get('/teamlead/tasks'), api.get('/teamlead/my-team/members')]);
      setTasks(t.data); setMembers(m.data);
    } catch (e) { toast.error('Error loading tasks'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      await api.post('/teamlead/tasks', form);
      toast.success('Task created!');
      setShowCreate(false);
      setForm({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assignedToId: '' });
      load();
    } catch (e) { toast.error(e.response?.data?.message || 'Error creating task'); }
    setSaving(false);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this task?')) return;
    try { await api.delete(`/teamlead/tasks/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Error deleting'); }
  };

  const kanbanCols = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];
  const colColors = { TODO: '#94a3b8', IN_PROGRESS: '#3b82f6', REVIEW: '#f59e0b', DONE: '#10b981' };
  const filtered = tasks.filter(t => !search || t.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <Layout title="Team Tasks" subtitle="Create and manage your team's work"
      actions={
        <div style={{ display: 'flex', gap: 10 }}>
          <div className="search-box">
            <Search size={15} color="#94a3b8" />
            <input placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="tabs" style={{ margin: 0, padding: 3 }}>
            <button className={`tab ${viewMode === 'kanban' ? 'active' : ''}`} onClick={() => setViewMode('kanban')}>Kanban</button>
            <button className={`tab ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>List</button>
          </div>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}><Plus size={16}/>New Task</button>
        </div>
      }>

      {loading ? <div className="loading-spinner"><div className="spinner"></div></div> : (
        <>
          {viewMode === 'kanban' ? (
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
                          {t.description && <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{t.description}</div>}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span className={`badge badge-${t.priority?.toLowerCase()}`}>{t.priority}</span>
                            {t.assignedTo && (
                              <div className="avatar avatar-sm" title={t.assignedTo.name} style={{ background: avatarColor(t.assignedTo.name || ''), color: '#fff' }}>
                                {initials(t.assignedTo.name || '')}
                              </div>
                            )}
                          </div>
                          {t.dueDate && (
                            <div style={{ fontSize: 11, color: t.overdue ? '#ef4444' : '#94a3b8', marginTop: 6 }}>Due {formatDate(t.dueDate)}</div>
                          )}
                          <button
                            style={{ marginTop: 8, fontSize: 11, color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0' }}
                            onClick={(e) => handleDelete(t.id, e)}
                          >🗑 Delete</button>
                        </div>
                      ))}
                      {colTasks.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '16px 0', color: '#cbd5e1', fontSize: 12 }}>No tasks</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card">
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Title</th><th>Assigned</th><th>Status</th><th>Priority</th><th>Due</th><th></th></tr>
                  </thead>
                  <tbody>
                    {filtered.map(t => (
                      <tr key={t.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(t)}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{t.title}</div>
                          {t.description && <div style={{ fontSize: 12, color: '#94a3b8' }}>{t.description.slice(0, 50)}{t.description.length > 50 ? '…' : ''}</div>}
                        </td>
                        <td>
                          {t.assignedTo ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <div className="avatar avatar-sm" style={{ background: avatarColor(t.assignedTo.name || ''), color: '#fff' }}>{initials(t.assignedTo.name || '')}</div>
                              {t.assignedTo.name}
                            </div>
                          ) : <span style={{ color: '#94a3b8' }}>Unassigned</span>}
                        </td>
                        <td><span className={`badge badge-${t.status?.toLowerCase()}`}>{statusLabel(t.status)}</span></td>
                        <td><span className={`badge badge-${t.priority?.toLowerCase()}`}>{t.priority}</span></td>
                        <td style={{ color: t.overdue ? '#ef4444' : undefined, fontSize: 13 }}>{formatDate(t.dueDate)}</td>
                        <td onClick={e => e.stopPropagation()}>
                          <button className="btn btn-danger btn-sm" onClick={(e) => handleDelete(t.id, e)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={6} style={{ textAlign: 'center', color: '#94a3b8', padding: 32 }}>No tasks found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Task Detail Modal */}
      {selected && (
        <TaskModal task={selected} onClose={() => setSelected(null)} onUpdate={load} teamMembers={members} canEdit={true} />
      )}

      {/* Create Task Modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Create New Task</span>
              <button className="close-btn" onClick={() => setShowCreate(false)}><X size={18}/></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Implement login API" autoFocus />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe the task..." />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="form-select" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input className="form-input" type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Assign To</label>
                <select className="form-select" value={form.assignedToId} onChange={e => setForm({...form, assignedToId: e.target.value})}>
                  <option value="">Unassigned</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={saving}>
                {saving ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
