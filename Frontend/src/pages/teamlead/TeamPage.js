import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { avatarColor, initials } from '../../utils/helpers';
import { UserPlus, UserMinus, X, Users } from 'lucide-react';

export default function TeamPage() {
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const load = async () => {
    try {
      const [t, m] = await Promise.all([api.get('/teamlead/my-team'), api.get('/teamlead/my-team/members')]);
      setTeam(t.data);
      setMembers(m.data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const loadAllUsers = async () => {
    // Try manager endpoint; if fails (not manager), won't show add
    try {
      const r = await api.get('/manager/users');
      setAllUsers(r.data);
    } catch {}
    setShowAdd(true);
  };

  const addMember = async (userId) => {
    try {
      await api.post(`/teamlead/my-team/members/${userId}`);
      toast.success('Member added');
      load();
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
  };

  const removeMember = async (userId) => {
    if (!window.confirm('Remove this member from the team?')) return;
    try {
      await api.delete(`/teamlead/my-team/members/${userId}`);
      toast.success('Member removed');
      load();
    } catch { toast.error('Error removing member'); }
  };

  const roleColors = { MANAGER: '#7c3aed', TEAM_LEAD: '#0369a1', MEMBER: '#059669' };

  return (
    <Layout title="My Team" subtitle={team ? `Team: ${team.name}` : 'Your team members'}
      actions={<button className="btn btn-primary" onClick={loadAllUsers}><UserPlus size={16}/> Add Member</button>}>

      {loading ? <div className="loading-spinner"><div className="spinner"></div></div> : (
        <>
          {team && (
            <div className="card" style={{ marginBottom: 24, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: avatarColor(team.name), display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 24, fontWeight: 900 }}>
                  {team.name[0]}
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800 }}>{team.name}</div>
                  {team.description && <div style={{ color: '#64748b', fontSize: 14, marginTop: 2 }}>{team.description}</div>}
                  <div style={{ marginTop: 6 }}>
                    <span className="badge badge-team_lead">{members.length} members</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="members-grid">
            {members.map(m => (
              <div key={m.id} className="member-card">
                <div className="avatar avatar-lg" style={{ background: avatarColor(m.name || ''), color: '#fff', margin: '0 auto 10px' }}>
                  {initials(m.name || '')}
                </div>
                <div className="name">{m.name}</div>
                <div className="role" style={{ color: '#94a3b8' }}>{m.email}</div>
                <div style={{ marginTop: 8 }}>
                  <span className={`badge badge-${m.role?.toLowerCase()}`}>{m.role?.replace('_', ' ')}</span>
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}
                  onClick={() => removeMember(m.id)}
                >
                  <UserMinus size={13}/> Remove
                </button>
              </div>
            ))}
            {members.length === 0 && (
              <div style={{ gridColumn: '1/-1' }}>
                <div className="empty-state">
                  <Users size={40} />
                  <p>No team members yet</p>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Add Team Member</span>
              <button className="close-btn" onClick={() => setShowAdd(false)}><X size={18}/></button>
            </div>
            <div className="modal-body">
              {allUsers.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center' }}>No users available (requires manager access)</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {allUsers.filter(u => !members.find(m => m.id === u.id)).map(u => (
                    <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: '#f8fafc', borderRadius: 9 }}>
                      <div className="avatar avatar-sm" style={{ background: avatarColor(u.name || ''), color: '#fff' }}>{initials(u.name || '')}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{u.email}</div>
                      </div>
                      <span className={`badge badge-${u.role?.toLowerCase()}`}>{u.role?.replace('_',' ')}</span>
                      <button className="btn btn-secondary btn-sm btn-icon" onClick={() => addMember(u.id)}><UserPlus size={13}/></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
