import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { avatarColor, initials, formatDate, timeAgo, statusLabel } from '../../utils/helpers';
import { X, Send, Paperclip, Download, MessageSquare } from 'lucide-react';

export default function TaskModal({ task, onClose, onUpdate, teamMembers, canEdit }) {
  const [form, setForm] = useState({
    status: task?.status || 'TODO',
    priority: task?.priority || 'MEDIUM',
    title: task?.title || '',
    description: task?.description || '',
    dueDate: task?.dueDate || '',
    assignedToId: task?.assignedTo?.id || '',
  });
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(task?.comments || []);
  const [files, setFiles] = useState(task?.attachments || []);
  const [tab, setTab] = useState('details');
  const [saving, setSaving] = useState(false);

  const loadComments = async () => {
    try {
      const r = await api.get(`/member/tasks/${task.id}/comments`);
      setComments(r.data);
    } catch {}
  };

  const loadFiles = async () => {
    try {
      const r = await api.get(`/member/tasks/${task.id}/files`);
      setFiles(r.data);
    } catch {}
  };

  useEffect(() => {
    if (task?.id) { loadComments(); loadFiles(); }
  }, [task?.id]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await api.put(`/teamlead/tasks/${task.id}`, form);
      toast.success('Task updated');
      onUpdate && onUpdate();
      onClose();
    } catch (e) {
      toast.error(e.response?.data?.message || 'Error updating');
    } finally { setSaving(false); }
  };

  const handleStatusUpdate = async (status) => {
    try {
      await api.put(`/member/tasks/${task.id}/status`, { status });
      setForm(f => ({ ...f, status }));
      toast.success('Status updated');
      onUpdate && onUpdate();
    } catch (e) { toast.error('Error'); }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    try {
      await api.post(`/member/tasks/${task.id}/comments`, { content: comment });
      setComment('');
      loadComments();
    } catch { toast.error('Error posting comment'); }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    try {
      await api.post(`/member/tasks/${task.id}/files`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('File uploaded');
      loadFiles();
    } catch { toast.error('Upload failed'); }
  };

  const statusOptions = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];
  const statusColors = { TODO: '#94a3b8', IN_PROGRESS: '#3b82f6', REVIEW: '#f59e0b', DONE: '#10b981' };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e => e.stopPropagation()} style={{ maxWidth: 680 }}>
        <div className="modal-header">
          <div>
            <div className="modal-title">{task.title}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <span className={`badge badge-${task.status?.toLowerCase()}`}>{statusLabel(task.status)}</span>
              <span className={`badge badge-${task.priority?.toLowerCase()}`}>{task.priority}</span>
              {task.overdue && <span className="badge badge-overdue">Overdue</span>}
            </div>
          </div>
          <button className="close-btn" onClick={onClose}><X size={18}/></button>
        </div>

        <div style={{ padding: '0 24px' }}>
          <div className="tabs" style={{ marginBottom: 0, marginTop: 12 }}>
            {['details', 'comments', 'files'].map(t => (
              <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
                {t === 'comments' && comments.length > 0 && ` (${comments.length})`}
                {t === 'files' && files.length > 0 && ` (${files.length})`}
              </button>
            ))}
          </div>
        </div>

        <div className="modal-body">
          {tab === 'details' && (
            <div>
              {canEdit ? (
                <>
                  <div className="form-group">
                    <label className="form-label">Title</label>
                    <input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select className="form-select" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                        {statusOptions.map(s => <option key={s} value={s}>{statusLabel(s)}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Priority</label>
                      <select className="form-select" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                        {['LOW','MEDIUM','HIGH'].map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Due Date</label>
                      <input className="form-input" type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />
                    </div>
                    {teamMembers && (
                      <div className="form-group">
                        <label className="form-label">Assigned To</label>
                        <select className="form-select" value={form.assignedToId} onChange={e => setForm({...form, assignedToId: e.target.value})}>
                          <option value="">Unassigned</option>
                          {teamMembers.map(m => <option key={m.id} value={m.id}>{m.fullName}</option>)}
                        </select>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div>
                  {task.description && <p style={{ color: '#475569', marginBottom: 16 }}>{task.description}</p>}
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>DUE DATE</div>
                      <div style={{ fontSize: 14 }}>{formatDate(task.dueDate)}</div>
                    </div>
                    {task.assignedTo && (
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 4 }}>ASSIGNED TO</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div className="avatar avatar-sm" style={{ background: avatarColor(task.assignedTo.fullName || ''), color: '#fff' }}>{initials(task.assignedTo.fullName || '')}</div>
                          <span style={{ fontSize: 14 }}>{task.assignedTo.fullName}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 8 }}>UPDATE STATUS</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {statusOptions.map(s => (
                        <button
                          key={s}
                          onClick={() => handleStatusUpdate(s)}
                          style={{
                            padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                            background: form.status === s ? statusColors[s] : '#f1f5f9',
                            color: form.status === s ? '#fff' : '#64748b',
                            border: 'none', transition: 'all 0.15s'
                          }}
                        >
                          {statusLabel(s)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'comments' && (
            <div>
              <div style={{ maxHeight: 280, overflowY: 'auto', marginBottom: 16 }}>
                {comments.length === 0 ? (
                  <div className="empty-state" style={{ padding: 24 }}>
                    <MessageSquare size={32} />
                    <p>No comments yet</p>
                  </div>
                ) : comments.map(c => (
                  <div key={c.id} className="comment-item">
                    <div className="avatar avatar-sm" style={{ background: avatarColor(c.authorName || ''), color: '#fff' }}>
                      {initials(c.authorName || '')}
                    </div>
                    <div className="comment-bubble">
                      <div className="comment-author">{c.authorName}</div>
                      <div className="comment-text">{c.content}</div>
                      <div className="comment-time">{timeAgo(c.createdAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="form-input" value={comment} onChange={e => setComment(e.target.value)}
                  placeholder="Write a comment..." onKeyDown={e => e.key === 'Enter' && handleComment()} />
                <button className="btn btn-primary btn-icon" onClick={handleComment}><Send size={15}/></button>
              </div>
            </div>
          )}

          {tab === 'files' && (
            <div>
              <label style={{ cursor: 'pointer' }}>
                <div className="file-drop">
                  <Paperclip size={24} style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontWeight: 600 }}>Click to upload a file</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>Max 10MB</div>
                </div>
                <input type="file" style={{ display: 'none' }} onChange={handleFileUpload} />
              </label>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {files.map(f => (
                  <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#f8fafc', borderRadius: 9 }}>
                    <Paperclip size={15} color="#94a3b8" />
                    <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{f.originalFileName}</span>
                    <a href={`${process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL + '/api' : 'http://localhost:8080/api'}/member/files/${f.id}/download`} className="btn btn-ghost btn-sm" target="_blank" rel="noreferrer">
                      <Download size={13}/> Download
                    </a>
                  </div>
                ))}
                {files.length === 0 && <p style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', padding: 12 }}>No files attached</p>}
              </div>
            </div>
          )}
        </div>

        {canEdit && tab === 'details' && (
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleUpdate} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
