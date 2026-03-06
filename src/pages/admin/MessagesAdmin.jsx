// ============================================
// pages/admin/MessagesAdmin.jsx
// ============================================

import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContactMessages, markMessageAsRead, deleteMessage, markAllMessagesAsRead, deleteAllMessages } from '../../redux/slices/contactSlice';
import { FiTrash2, FiCheck, FiMail, FiTrash, FiRefreshCw, FiSearch } from 'react-icons/fi';
import { IoCheckmarkDone, IoSquareOutline, IoCheckbox } from 'react-icons/io5';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import EmptyState from '../../components/Common/EmptyState';
import { toast } from 'react-toastify';

const MessagesAdmin = () => {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.contact);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAllOpen, setConfirmAllOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    dispatch(fetchContactMessages());
  }, [dispatch]);

  const filteredMessages = useMemo(() => {
    return messages.filter(msg => 
      msg.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.sender_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [messages, searchTerm]);

  const handleRefresh = () => {
    dispatch(fetchContactMessages());
    toast.info('Mesajlar yeniləndi');
  };

  const handleMarkAllRead = async () => {
    try {
      await dispatch(markAllMessagesAsRead()).unwrap();
      toast.success('Bütün mesajlar oxunmuş kimi işarələndi');
    } catch {
      toast.error('Xəta baş verdi');
    }
  };

  const handleDeleteAll = async () => {
    try {
      await dispatch(deleteAllMessages()).unwrap();
      toast.success('Bütün mesajlar silindi');
      setConfirmAllOpen(false);
    } catch {
      toast.error('Xəta baş verdi');
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredMessages.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMessages.map(m => m.id));
    }
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

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
        <div className="admin-header__info">
          <h1 className="admin-title">Mesajlar</h1>
          <p className="admin-subtitle">Əlaqə formasından gələn sorğuları idarə edin</p>
        </div>
        
        <div className="admin-header__controls">
          <div className="search-bar">
            <FiSearch />
            <input 
              type="text" 
              placeholder="Mesajlarda axtar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="admin-header__actions">
            <div className="btn-icon secondary btn-sm" onClick={handleRefresh} title="Yenilə">
              <FiRefreshCw className={loading ? 'spinning' : ''} />
            </div>
            <div className="btn-icon primary btn-sm" onClick={handleMarkAllRead} title="Hamısını oxunmuş işarələ">
              <IoCheckmarkDone />
            </div>
            <div className="btn-icon danger btn-sm" onClick={() => setConfirmAllOpen(true)} title="Hamısını sil">
              <FiTrash />
            </div>
          </div>
        </div>
      </div>

      <div className="messages-toolbar">
        <div className="select-all" onClick={toggleSelectAll}>
          {selectedIds.length > 0 && selectedIds.length === filteredMessages.length ? (
            <IoCheckbox className="selected" />
          ) : (
            <IoSquareOutline />
          )}
          <span>Hamısını seç ({selectedIds.length})</span>
        </div>
      </div>

      {filteredMessages.length === 0 ? (
        <EmptyState 
          icon={<FiMail />}
          title={searchTerm ? "Nəticə tapılmadı" : "Mesaj yoxdur"}
          description={searchTerm ? `"${searchTerm}" üçün heç bir mesaj tapılmadı.` : "Hələ heç bir mesaj alınmayıb."}
        />
      ) : (
        <div className="messages-list">
          {filteredMessages.map((msg) => (
            <div 
              key={msg.id} 
              className={`message-card ${msg.is_read ? 'read' : 'unread'} ${selectedIds.includes(msg.id) ? 'selected' : ''}`}
            >
              <div className="message-card__selection" onClick={() => toggleSelect(msg.id)}>
                {selectedIds.includes(msg.id) ? <IoCheckbox className="selected" /> : <IoSquareOutline />}
              </div>
              <div className="message-card__main">
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
                  <p className='message-subject'><span>Mövzu:</span>{msg.subject}</p>
                  <p className='main-subject'>{msg.message}</p>
                </div>

                <div className="message-card__footer">
                  {!msg.is_read ? (
                    <div
                      className="btn-icon primary btn-sm"
                      onClick={() => handleMarkAsRead(msg.id)}
                    >
                      <FiCheck />
                    </div>
                  ) : (
                    <div className="btn-icon primary btn-sm status-read ">
                      <IoCheckmarkDone />
                    </div>
                  )}
                  
                  <div
                    className="btn-icon danger btn-sm"
                    onClick={() => confirmDelete(msg.id)}
                  >
                    <FiTrash />
                  </div>
                </div>
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

      <ConfirmDialog
        isOpen={confirmAllOpen}
        onClose={() => setConfirmAllOpen(false)}
        onConfirm={handleDeleteAll}
        title="Bütün Mesajları Sil"
        message="BÜTÜN mesajları silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarıla bilməz."
        confirmText="Hamısını Sil"
        variant="danger"
      />
    </div>
  );
};

export default MessagesAdmin;