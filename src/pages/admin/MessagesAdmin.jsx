// ============================================
// pages/admin/MessagesAdmin.jsx
// ============================================

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContactMessages, markMessageAsRead, deleteMessage } from '../../redux/slices/contactSlice';
import { FiTrash2, FiCheck, FiMail } from 'react-icons/fi';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import EmptyState from '../../components/Common/EmptyState';
import { toast } from 'react-toastify';

const MessagesAdmin = () => {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.contact);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchContactMessages());
  }, [dispatch]);

  const handleMarkAsRead = async (id) => {
    try {
      await dispatch(markMessageAsRead(id)).unwrap();
      toast.success('Mesaj oxunmuş kimi işarələndi');
    } catch {
      toast.error('Mesaj statusunu yeniləmək alınmadı');
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteMessage(deleteId)).unwrap();
      toast.success('Mesaj uğurla silindi');
      setDeleteId(null);
      setConfirmOpen(false);
    } catch {
      toast.error('Mesajın silinməsi alınmadı');
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && messages.length === 0) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="messages-admin">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Mesajlar</h1>
          <p className="admin-subtitle">Əlaqə formundan gələn müraciətləri idarə edin</p>
        </div>
      </div>

      {messages.length === 0 ? (
        <EmptyState 
          icon={<FiMail />}
          title="Mesaj yoxdur"
          description="Hələ mesaj daxil olmayıb."
        />
      ) : (
        <div className="messages-list">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`message-card ${msg.is_read ? 'read' : 'unread'}`}
            >
              <div className="message-card__header">
                <div className="message-card__sender">
                  <div className="message-card__avatar">
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="message-card__info">
                    <h3 className="message-card__name">{msg.name}</h3>
                    <a href={`mailto:${msg.email}`} className="message-card__email">
                      {msg.email}
                    </a>
                  </div>
                </div>
                <span className="message-card__date">{formatDate(msg.created_at)}</span>
              </div>

              <div className="message-card__content">
                <h4 className="message-card__subject">{msg.subject}</h4>
                <p className="message-card__body">{msg.message}</p>
              </div>

              <div className="message-card__actions">
                {!msg.is_read && (
                  <button 
                    className="btn-sm btn-outline"
                    onClick={() => handleMarkAsRead(msg.id)}
                  >
                    <FiCheck />
                    Oxunmuş kimi işarələ
                  </button>
                )}
                <button 
                  className="btn-sm btn-danger-outline"
                  onClick={() => confirmDelete(msg.id)}
                >
                  <FiTrash2 />
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Mesajı sil"
        message="Bu mesajı silmək istədiyinizdən əminsiniz? Bu əməliyyat geri qaytarıla bilməz."
      />
    </div>
  );
};

export default MessagesAdmin;
