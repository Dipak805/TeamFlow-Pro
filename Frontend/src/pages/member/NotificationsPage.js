import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { timeAgo } from '../../utils/helpers';
import { Bell, CheckCheck, Check } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/member/notifications').then(r => { setNotifications(r.data); setLoading(false); });
  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    try { await api.put(`/member/notifications/${id}/read`); load(); }
    catch {}
  };

  const markAllRead = async () => {
    try { await api.put('/member/notifications/read-all'); load(); toast.success('All marked as read'); }
    catch {}
  };

  const unread = notifications.filter(n => !n.read).length;

  return (
    <Layout title="Notifications" subtitle="Stay up to date with your team"
      actions={
        unread > 0 && (
          <button className="btn btn-secondary" onClick={markAllRead}>
            <CheckCheck size={15}/> Mark all read
          </button>
        )
      }>

      {loading ? <div className="loading-spinner"><div className="spinner"></div></div> : (
        <div className="card">
          {notifications.length === 0 ? (
            <div className="empty-state" style={{ padding: 64 }}>
              <Bell size={48} />
              <p style={{ fontSize: 16, fontWeight: 600, marginTop: 8 }}>You're all caught up!</p>
              <p style={{ marginTop: 4 }}>No notifications yet</p>
            </div>
          ) : (
            <div>
              {unread > 0 && (
                <div style={{ padding: '12px 20px', background: '#f0f4ff', borderBottom: '1px solid #e0e7ff', fontSize: 13, color: '#4f46e5', fontWeight: 600 }}>
                  {unread} unread notification{unread > 1 ? 's' : ''}
                </div>
              )}
              <div className="notif-list">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className={`notif-item ${!n.read ? 'unread' : ''}`}
                    onClick={() => !n.read && markRead(n.id)}
                  >
                    <div style={{ paddingTop: 2 }}>
                      {!n.read ? (
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6366f1', marginTop: 4 }}></div>
                      ) : (
                        <Check size={14} color="#94a3b8" />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="notif-msg">{n.message}</div>
                      <div className="notif-time">{timeAgo(n.createdAt)}</div>
                    </div>
                    {!n.read && (
                      <button
                        className="btn btn-ghost btn-sm"
                        style={{ fontSize: 11, padding: '3px 8px' }}
                        onClick={(e) => { e.stopPropagation(); markRead(n.id); }}
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
