import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { avatarColor, initials } from '../../utils/helpers';
import { Plus, Search, ToggleLeft, ToggleRight, X } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', role: 'MEMBER' });

  const load = () => api.get('/manager/users').then(r => { setUsers(r.data); setLoading(false); });
  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    try {
      await api.post('/manager/users', form);
      toast.success('User created!');
      setShowModal(false);
      setForm({ name: '', username: '', email: '', password: '', role: 'MEMBER' });
      load();
    } catch (e) { toast.error(e.response?.data?.message || 'Error creating user'); }
  };

  const toggleStatus = async (id) => {
    try { await api.put(`/manager/users/${id}/activate`); load(); toast.success('Status updated'); }
    catch { toast.error('Error'); }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title="Users" subtitle="Manage organization members"
      actions={
        <>
          <div className="search-box">
            <Search size={15} color="#94a3b8" />
            <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={16}/>Add User</button>
        </>
      }>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>User</th><th>Username</th><th>Role</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32 }}><div className="spinner" style={{ margin: '0 auto' }}></div></td></tr>
              ) : filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="avatar" style={{ background: avatarColor(u.name || ''), color: '#fff' }}>
                        {initials(u.name || '')}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{u.name}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: '#64748b', fontFamily: 'monospace' }}>@{u.username}</td>
                  <td><span className={`badge badge-${u.role?.toLowerCase()}`}>{u.role?.replace('_', ' ')}</span></td>
                  <td><span className={`badge badge-${u.active ? 'active' : 'inactive'}`}>{u.active ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <button className="btn btn-ghost btn-sm" onClick={() => toggleStatus(u.id)} style={{ gap: 6 }}>
                      {u.active ? <ToggleRight size={15} color="#10b981" /> : <ToggleLeft size={15} color="#94a3b8" />}
                      {u.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: '#94a3b8', padding: 32 }}>No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Add New User</span>
              <button className="close-btn" onClick={() => setShowModal(false)}><X size={18}/></button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Username *</label>
                  <input className="form-input" value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email *</label>
                <input className="form-input" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input className="form-input" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} minLength={6} />
                </div>
                <div className="form-group">
                  <label className="form-label">Role *</label>
                  <select className="form-select" value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                    <option value="MEMBER">Member</option>
                    <option value="TEAM_LEAD">Team Lead</option>
                    <option value="MANAGER">Manager</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate}>Create User</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
