import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import api from '../../api/axios';
import { formatDate } from '../../utils/helpers';
import { Folder, Download, Paperclip } from 'lucide-react';

export default function FilesPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    api.get('/member/tasks').then(async r => {
      setTasks(r.data);
      const allFiles = [];
      for (const t of r.data) {
        try {
          const fres = await api.get(`/member/tasks/${t.id}/files`);
          fres.data.forEach(f => allFiles.push({ ...f, taskTitle: t.title }));
        } catch {}
      }
      setFiles(allFiles);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <Layout title="My Files" subtitle="Files attached to your tasks">
      {loading ? <div className="loading-spinner"><div className="spinner"></div></div> : (
        <div className="card">
          {files.length === 0 ? (
            <div className="empty-state" style={{ padding: 64 }}>
              <Folder size={48} />
              <p style={{ fontSize: 16, fontWeight: 600, marginTop: 8 }}>No files yet</p>
              <p style={{ marginTop: 4 }}>Files you upload to tasks will appear here</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>File Name</th><th>Task</th><th>Uploaded By</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {files.map(f => (
                    <tr key={f.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Paperclip size={15} color="#94a3b8" />
                          <span style={{ fontWeight: 600, fontSize: 13 }}>{f.originalFileName}</span>
                        </div>
                      </td>
                      <td style={{ color: '#6366f1', fontSize: 13 }}>{f.taskTitle}</td>
                      <td style={{ fontSize: 13, color: '#64748b' }}>{f.uploadedBy || '—'}</td>
                      <td>
                        <a
                          href={`${process.env.REACT_APP_API_HOST ? 'https://' + process.env.REACT_APP_API_HOST + '/api' : 'http://localhost:8080/api'}/member/files/${f.id}/download`}
                          className="btn btn-secondary btn-sm"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Download size={13}/> Download
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}
