// ============================================
// pages/admin/MessagesAdmin.jsx
// ============================================

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContactMessages, markMessageAsRead, deleteMessage } from '../../redux/slices/contactSlice';
import { FiTrash2, FiCheck, FiMail, FiTrash } from 'react-icons/fi';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import EmptyState from '../../components/Common/EmptyState';
import { toast } from 'react-toastify';
import { IoCheckmarkDone } from 'react-icons/io5';

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
      toast.error('Mesaj statusunu yeniləmək mümkün olmadı');
    }
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteMessage(deleteId)).unwrap();
      toast.success('Mesaj uğurla silindi');
      setDeleteId(null);
      setConfirmOpen(false);
    } catch {
      toast.error('Mesajı silmək mümkün olmadı');
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('az-AZ', {
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
          <p className="admin-subtitle">Əlaqə formasından gələn sorğuları idarə edin</p>
        </div>
      </div>

      {messages.length === 0 ? (
        <EmptyState 
          icon={<FiMail />}
          title="Mesaj yoxdur"
          description="Hələ heç bir mesaj alınmayıb."
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
                    {msg.sender_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="message-card__info">
                    <h3 className="message-card__name">{msg.sender_name}</h3>
                    <a href={`mailto:${msg.sender_email}`} className="message-card__email">
                      {msg.sender_email}
                    </a>
                  </div>
                </div>
                <span className="message-card__date">
                  {formatDate(msg.created_at)}
                </span>
              </div>

              <div className="message-card__body">
                <p>{msg.message}</p>
              </div>

              <div className="message-card__footer">
                {!msg.is_read ? (
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => handleMarkAsRead(msg.id)}
                  >
                    <FiCheck /> Oxunmuş kimi işarələ
                  </button>
                ) : (
                  <span className="status-read btn-primary btn-sm">
                    <IoCheckmarkDone /> Oxundu
                  </span>
                )}
                
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => confirmDelete(msg.id)}
                >
                  <FiTrash />
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
        title="Mesajı Sil"
        message="Bu mesajı silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz."
        confirmText="Sil"
        variant="danger"
      />
    </div>
  );
};

export default MessagesAdmin;