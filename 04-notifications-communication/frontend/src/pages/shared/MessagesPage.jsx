import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { MessageSquare, Send, CheckCheck, Trash2, AlertTriangle } from 'lucide-react';

// ── Confirmation Modal ───────────────────────────────────────────────────────
function DeleteConfirmModal({ conversationName, onConfirm, onCancel, deleting }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem'
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '1rem',
          maxWidth: '420px',
          width: '100%',
          padding: '1.75rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0',
          textAlign: 'center'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div
          style={{
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '50%',
            backgroundColor: '#fee2e2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            color: '#dc2626'
          }}
        >
          <AlertTriangle size={28} />
        </div>

        {/* Title & Description */}
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-main, #1a202c)', marginBottom: '0.5rem' }}>
          Delete Conversation
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted, #4a5568)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          Are you sure you want to permanently delete your conversation with{' '}
          <strong style={{ color: 'var(--color-text-main, #1a202c)' }}>{conversationName || 'this contact'}</strong>?
          All messages in this chat will be removed for both parties. This action cannot be undone.
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="btn btn-danger"
            style={{
              flex: 1,
              backgroundColor: '#dc2626',
              color: '#ffffff',
              border: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            {deleting ? (
              <span>Deleting…</span>
            ) : (
              <>
                <Trash2 size={15} />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Messages Page ───────────────────────────────────────────────────────
export default function MessagesPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const targetUserId = searchParams.get('userId');

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeConversation?.id) {
      fetchMessages(activeConversation.id);
    } else {
      setMessages([]);
    }
  }, [activeConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/messages/conversations');
      const list = res.data || [];
      setConversations(list);

      if (targetUserId) {
        const found = list.find(c => c.otherUserId === Number(targetUserId));
        if (found) {
          setActiveConversation(found);
        } else {
          setActiveConversation({
            id: null,
            otherUserId: Number(targetUserId),
            otherUserName: 'New Contact',
            lastMessage: 'Start a conversation...'
          });
        }
      } else if (list.length > 0) {
        setActiveConversation(list[0]);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
      showToast('Failed to load conversations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    if (!conversationId) return;
    try {
      const res = await api.get(`/messages/conversations/${conversationId}`);
      setMessages(res.data || []);
    } catch (error) {
      console.warn('Could not fetch conversation messages', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setSending(true);
    try {
      const payload = {
        receiverId: activeConversation?.otherUserId,
        messageBody: inputText.trim()
      };

      const res = await api.post('/messages', payload);
      setMessages(prev => [...prev, res.data]);
      setInputText('');

      // If this was a new conversation, refresh the list
      if (!activeConversation.id) {
        await fetchConversations();
      }
    } catch (error) {
      showToast('Failed to send message', 'error');
    } finally {
      setSending(false);
    }
  };

  // ── Delete handlers ────────────────────────────────────────────────────────
  const handleDeleteClick = (e, conv) => {
    e.stopPropagation();
    setDeleteTarget(conv);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget?.id) return;
    setDeleting(true);
    try {
      await api.delete(`/messages/conversations/${deleteTarget.id}`);
      showToast('Conversation deleted', 'success');

      setConversations(prev => prev.filter(c => c.id !== deleteTarget.id));
      if (activeConversation?.id === deleteTarget.id) {
        const remaining = conversations.filter(c => c.id !== deleteTarget.id);
        setActiveConversation(remaining.length > 0 ? remaining[0] : null);
        setMessages([]);
      }
    } catch (error) {
      showToast('Failed to delete conversation', 'error');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Connecting to messaging service..." />;
  }

  return (
    <>
      {/* Confirmation Modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          conversationName={deleteTarget.otherUserName}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}

      {/* Main Chat Container */}
      <div
        style={{
          height: 'calc(100vh - 180px)',
          minHeight: '520px',
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
          border: '1px solid var(--color-border, #e2e8f0)',
          borderRadius: 'var(--radius-xl, 0.75rem)',
          backgroundColor: '#ffffff',
          boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.1))'
        }}
      >
        {/* ── Left Conversations Sidebar ── */}
        <div
          style={{
            width: '320px',
            minWidth: '280px',
            maxWidth: '340px',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid var(--color-border, #e2e8f0)',
            backgroundColor: '#f8fafc'
          }}
        >
          {/* Sidebar Header */}
          <div
            style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid var(--color-border, #e2e8f0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#ffffff'
            }}
          >
            <h2
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--color-text-main, #1a202c)',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <MessageSquare size={18} style={{ color: 'var(--color-primary, #0066cc)' }} />
              Messages
            </h2>
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-light, #94a3b8)',
                fontWeight: 500,
                backgroundColor: '#f1f5f9',
                padding: '0.2rem 0.5rem',
                borderRadius: '9999px'
              }}
            >
              {conversations.length}
            </span>
          </div>

          {/* Conversations List */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto'
            }}
          >
            {conversations.length === 0 ? (
              <div
                style={{
                  padding: '3rem 1.5rem',
                  textAlign: 'center',
                  color: 'var(--color-text-light, #94a3b8)',
                  fontSize: '0.85rem'
                }}
              >
                <MessageSquare size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
                <p style={{ margin: 0 }}>No conversations yet.</p>
                <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  Messages appear when you connect with candidates or recruiters.
                </p>
              </div>
            ) : (
              conversations.map(conv => {
                const isSelected = activeConversation?.id === conv.id;
                return (
                  <div
                    key={conv.id || conv.otherUserId}
                    onClick={() => setActiveConversation(conv)}
                    role="button"
                    tabIndex={0}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.875rem 1rem',
                      cursor: 'pointer',
                      borderBottom: '1px solid #edf2f7',
                      backgroundColor: isSelected ? '#eef6ff' : 'transparent',
                      borderLeft: isSelected ? '4px solid var(--color-primary, #0066cc)' : '4px solid transparent',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#f1f5f9';
                      const delBtn = e.currentTarget.querySelector('.conv-del-btn');
                      if (delBtn) delBtn.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                      const delBtn = e.currentTarget.querySelector('.conv-del-btn');
                      if (delBtn && !isSelected) delBtn.style.opacity = '0';
                    }}
                  >
                    {/* Avatar */}
                    <div
                      style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: '50%',
                        backgroundColor: '#dbeafe',
                        color: 'var(--color-primary, #0066cc)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        flexShrink: 0
                      }}
                    >
                      {conv.otherUserName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>

                    {/* Text Details */}
                    <div style={{ flex: 1, minWidth: 0, paddingRight: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                        <span
                          style={{
                            fontWeight: isSelected ? 700 : 600,
                            fontSize: '0.85rem',
                            color: 'var(--color-text-main, #1a202c)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {conv.otherUserName}
                        </span>
                        {conv.lastMessageTime && (
                          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-light, #94a3b8)', flexShrink: 0 }}>
                            {new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--color-text-muted, #64748b)',
                          margin: 0,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {conv.lastMessage || 'Click to view conversation'}
                      </p>
                    </div>

                    {/* Quick Delete Trash Button */}
                    {conv.id && (
                      <button
                        type="button"
                        className="conv-del-btn"
                        id={`delete-conv-${conv.id}`}
                        onClick={(e) => handleDeleteClick(e, conv)}
                        title="Delete conversation"
                        style={{
                          position: 'absolute',
                          right: '0.75rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          padding: '0.35rem',
                          borderRadius: '0.375rem',
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: '#ef4444',
                          cursor: 'pointer',
                          opacity: isSelected ? '1' : '0',
                          transition: 'opacity 0.15s ease, background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#fee2e2';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Right Chat Area ── */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            minWidth: 0
          }}
        >
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div
                style={{
                  padding: '0.875rem 1.25rem',
                  borderBottom: '1px solid var(--color-border, #e2e8f0)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#ffffff'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '50%',
                      backgroundColor: '#dbeafe',
                      color: 'var(--color-primary, #0066cc)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.95rem'
                    }}
                  >
                    {activeConversation.otherUserName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: 'var(--color-text-main, #1a202c)'
                      }}
                    >
                      {activeConversation.otherUserName}
                    </h3>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        color: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontWeight: 600
                      }}
                    >
                      <span style={{ fontSize: '8px' }}>●</span> Connected
                    </span>
                  </div>
                </div>

                {/* Delete button in header */}
                {activeConversation.id && (
                  <button
                    id="delete-active-conversation-btn"
                    onClick={(e) => handleDeleteClick(e, activeConversation)}
                    title="Delete this conversation"
                    type="button"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.4rem 0.75rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#dc2626',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fee2e2';
                      e.currentTarget.style.borderColor = '#fca5a5';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#fef2f2';
                      e.currentTarget.style.borderColor = '#fecaca';
                    }}
                  >
                    <Trash2 size={13} />
                    <span>Delete Chat</span>
                  </button>
                )}
              </div>

              {/* Messages Scroll Area */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  backgroundColor: '#f8fafc'
                }}
              >
                {messages.length === 0 ? (
                  <div
                    style={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      color: 'var(--color-text-light, #94a3b8)',
                      fontSize: '0.85rem'
                    }}
                  >
                    <div>
                      <MessageSquare size={36} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
                      <p style={{ margin: 0, fontWeight: 500 }}>No messages in this chat yet.</p>
                      <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Say hello to get the conversation started!</p>
                    </div>
                  </div>
                ) : (
                  messages.map(msg => {
                    const isMe = msg.senderId === user?.id;
                    return (
                      <div
                        key={msg.id}
                        style={{
                          display: 'flex',
                          justifyContent: isMe ? 'flex-end' : 'flex-start',
                          width: '100%'
                        }}
                      >
                        <div
                          style={{
                            maxWidth: '70%',
                            padding: '0.625rem 0.875rem',
                            borderRadius: isMe ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
                            backgroundColor: isMe ? 'var(--color-primary, #0066cc)' : '#ffffff',
                            color: isMe ? '#ffffff' : 'var(--color-text-main, #1a202c)',
                            border: isMe ? '1px solid transparent' : '1px solid #e2e8f0',
                            boxShadow: isMe
                              ? '0 2px 4px rgba(0, 102, 204, 0.25)'
                              : '0 1px 2px rgba(0, 0, 0, 0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.25rem',
                            wordBreak: 'break-word'
                          }}
                        >
                          {/* Message Content */}
                          <p
                            style={{
                              margin: 0,
                              fontSize: '0.85rem',
                              lineHeight: 1.45,
                              color: isMe ? '#ffffff' : 'var(--color-text-main, #1a202c)'
                            }}
                          >
                            {msg.messageBody}
                          </p>

                          {/* Timestamp and Checkmark */}
                          <div
                            style={{
                              fontSize: '0.68rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              gap: '0.25rem',
                              color: isMe ? 'rgba(255, 255, 255, 0.85)' : 'var(--color-text-light, #94a3b8)',
                              marginTop: '0.125rem'
                            }}
                          >
                            <span>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isMe && <CheckCheck size={12} style={{ color: 'rgba(255, 255, 255, 0.9)' }} />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Form */}
              <form
                onSubmit={handleSendMessage}
                style={{
                  padding: '0.875rem 1.25rem',
                  borderTop: '1px solid var(--color-border, #e2e8f0)',
                  display: 'flex',
                  gap: '0.625rem',
                  backgroundColor: '#ffffff',
                  alignItems: 'center'
                }}
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message here..."
                  style={{
                    flex: 1,
                    padding: '0.625rem 0.875rem',
                    fontSize: '0.85rem',
                    borderRadius: 'var(--radius-md, 0.375rem)',
                    border: '1px solid var(--color-border, #cbd5e1)',
                    outline: 'none',
                    backgroundColor: '#f8fafc',
                    color: 'var(--color-text-main, #1a202c)',
                    transition: 'border-color 0.15s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-primary, #0066cc)';
                    e.target.style.backgroundColor = '#ffffff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--color-border, #cbd5e1)';
                    e.target.style.backgroundColor = '#f8fafc';
                  }}
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={sending || !inputText.trim()}
                  className="btn btn-primary"
                  style={{
                    padding: '0.625rem 1.15rem',
                    fontSize: '0.85rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <Send size={14} />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                color: 'var(--color-text-light, #94a3b8)',
                fontSize: '0.9rem',
                gap: '0.75rem',
                backgroundColor: '#f8fafc'
              }}
            >
              <MessageSquare size={44} style={{ opacity: 0.35, color: 'var(--color-primary, #0066cc)' }} />
              <div>
                <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-text-main, #1a202c)' }}>
                  Your Messages
                </p>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted, #64748b)' }}>
                  Select a conversation from the sidebar to begin chatting.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
