import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { avatarColor, initials } from '../../utils/helpers';
import { Plus, Edit2, Trash2, Users, X, UserPlus, UserMinus } from 'lucide-react';

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTeam, setEditTeam] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', teamLeadId: '' });
  const [memberModal, setMemberModal] = useState(null);

  const load = async () => {
    const [t, u] = await Promise.all([api.get('/manager/teams'), api.get('/manager/users')]);
    setTeams(t.data); setUsers(u.data); setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditTeam(null); setForm({ name: '', description: '', teamLeadId: '' }); setShowModal(true); };
  const openEdit = (t) => { setEditTeam(t); setForm({ name: t.name, description: t.description || '', teamLeadId: t.teamLead?.id || '' }); setShowModal(true); };

  const handleSave = async () => {
    try {
      if (editTeam) await api.put(`/manager/teams/${editTeam.id}`, form);
      else await api.post('/manager/teams', form);
      toast.success(editTeam ? 'Team updated!' : 'Team created!');
      setShowModal(false); load();
    } catch (e) { toast.error(e.response?.data?.message || 'Error saving team'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this team?')) return;
    try { await api.delete(`/manager/teams/${id}`); toast.success('Team deleted'); load(); }
    catch (e) { toast.error('Cannot delete team'); }
  };

  const addMember = async (teamId, userId) => {
    try { await api.post(`/manager/teams/${teamId}/members/${userId}`); toast.success('Member added'); load(); }
    catch (e) { toast.error(e.response?.data?.message || 'Error'); }
  };

  const removeMember = async (teamId, userId) => {
    try { await api.delete(`/manager/teams/${teamId}/members/${userId}`); toast.success('Member removed'); load(); }
    catch (e) { toast.error('Error removing member'); }
  };

  return (
    <Layout title="Teams" subtitle="Manage your organization's teams"
      actions={<button className="btn btn-primary" onClick={openCreate}><Plus size={16}/>New Team</button>}>

      {loading ? <div className="loading-spinner"><div className="spinner"></div></div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
          {teams.map(team => (
            <div className="card" key={team.id}>
              <div className="card-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: avatarColor(team.name), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 16 }}>
                      {team.name[0]}
                    </div>
                    <div>
                      <div className="card-title">{team.name}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{team.members?.length || 0} members</div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setMemberModal(team)}><Users size={14}/></button>
                  <button className="btn btn-ghost btn-sm btn-icon" onClick={() => openEdit(team)}><Edit2 size={14}/></button>
                  <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(team.id)}><Trash2 size={14}/></button>
                </div>
              </div>
              <div className="card-body">
                {team.description && <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>{team.description}</p>}
                {team.teamLead && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, padding: '8px 10px', background: '#f0f4ff', borderRadius: 8 }}>
                    <div className="avatar avatar-sm" style={{ background: avatarColor(team.teamLead.fullName || ''), color: '#fff' }}>
                      {initials(team.teamLead.fullName || '')}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#4f46e5' }}>Team Lead</div>
                      <div style={{ fontSize: 13 }}>{team.teamLead.fullName}</div>
                    </div>
                  </div>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(team.members || []).slice(0, 6).map(m => (
                    <div key={m.id} title={m.fullName} className="avatar avatar-sm" style={{ background: avatarColor(m.fullName || ''), color: '#fff' }}>
                      {initials(m.fullName || '')}
                    </div>
                  ))}
                  {(team.members?.length || 0) > 6 && (
                    <div className="avatar avatar-sm" style={{ background: '#e2e8f0', color: '#64748b' }}>+{team.members.length - 6}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {teams.length === 0 && (
            <div className="card" style={{ gridColumn: '1/-1' }}>
              <div className="empty-state">
                <Users size={40} />
                <p>No teams yet. Create your first team!</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{editTeam ? 'Edit Team' : 'Create Team'}</span>
              <button className="close-btn" onClick={() => setShowModal(false)}><X size={18}/></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Team Name *</label>
                <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Frontend Team" />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-textarea" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="What does this team work on?" />
              </div>
              <div className="form-group">
                <label className="form-label">Team Lead</label>
                <select className="form-select" value={form.teamLeadId} onChange={e => setForm({...form, teamLeadId: e.target.value})}>
                  <option value="">Select team lead</option>
                  {users.filter(u => u.role === 'TEAM_LEAD' || u.role === 'MANAGER').map(u => (
                    <option key={u.id} value={u.id}>{u.fullName} ({u.role})</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editTeam ? 'Save Changes' : 'Create Team'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member Management Modal */}
      {memberModal && (
        <div className="modal-overlay" onClick={() => setMemberModal(null)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Manage Members — {memberModal.fullName}</span>
              <button className="close-btn" onClick={() => setMemberModal(null)}><X size={18}/></button>
            </div>
            <div className="modal-body">
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 10 }}>CURRENT MEMBERS ({memberModal.members?.length || 0})</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                {(memberModal.members || []).map(m => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#f8fafc', borderRadius: 9 }}>
                    <div className="avatar avatar-sm" style={{ background: avatarColor(m.fullName || ''), color: '#fff' }}>{initials(m.fullName || '')}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{m.fullName}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{m.email}</div>
                    </div>
                    <span className={`badge badge-${m.role?.toLowerCase()}`}>{m.role?.replace('_', ' ')}</span>
                    <button className="btn btn-danger btn-sm btn-icon" onClick={() => removeMember(memberModal.id, m.id)}><UserMinus size={13}/></button>
                  </div>
                ))}
                {!memberModal.members?.length && <p style={{ color: '#94a3b8', fontSize: 13 }}>No members yet</p>}
              </div>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 10 }}>ADD MEMBER</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {users.filter(u => !(memberModal.members || []).find(m => m.id === u.id)).map(u => (
                  <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#f8fafc', borderRadius: 9 }}>
                    <div className="avatar avatar-sm" style={{ background: avatarColor(u.fullName || ''), color: '#fff' }}>{initials(u.fullName || '')}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{u.fullName}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{u.email}</div>
                    </div>
                    <span className={`badge badge-${u.role?.toLowerCase()}`}>{u.role?.replace('_', ' ')}</span>
                    <button className="btn btn-secondary btn-sm btn-icon" onClick={() => addMember(memberModal.id, u.id)}><UserPlus size={13}/></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
