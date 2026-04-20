import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { FaSearch, FaPaperPlane, FaCircle } from 'react-icons/fa';
import TeacherSidebar from '../components/TeacherSidebar';

// The currently logged-in teacher's ID (replace once auth is integrated)
const LOGGED_IN_ID = 'T2701';

// Helper: Format the sent_time timestamp into a friendly label
const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
};

const TeacherMessages = () => {
    const [contacts, setContacts] = useState([]);
    const [activeContact, setActiveContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Ref for auto-scrolling to the latest message
    const messageEndRef = useRef(null);

    // ─── Fetch contacts once on mount ────────────────────────────────────────
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/messages/contacts/${LOGGED_IN_ID}`);
                setContacts(res.data);
                // Auto-select first contact if available
                if (res.data.length > 0) setActiveContact(res.data[0]);
            } catch (err) {
                console.error("Failed to fetch contacts:", err);
            }
        };
        fetchContacts();
    }, []);

    // ─── Fetch conversation whenever active contact changes ───────────────────
    const fetchConversation = useCallback(async () => {
        if (!activeContact) return;
        try {
            const res = await axios.get(
                `http://localhost:5000/api/messages/conversation/${LOGGED_IN_ID}/${activeContact.contact_id}`
            );
            setMessages(res.data);
        } catch (err) {
            console.error("Failed to fetch conversation:", err);
        }
    }, [activeContact]);

    useEffect(() => {
        fetchConversation();
    }, [fetchConversation]);

    // ─── Short-polling: refresh messages every 4 seconds ─────────────────────
    useEffect(() => {
        const interval = setInterval(fetchConversation, 4000);
        return () => clearInterval(interval);
    }, [fetchConversation]);

    // ─── Auto-scroll to bottom whenever messages update ───────────────────────
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // ─── Send a new message ───────────────────────────────────────────────────
    const handleSend = async () => {
        const trimmed = input.trim();
        if (!trimmed || !activeContact) return;
        setInput('');
        try {
            await axios.post('http://localhost:5000/api/messages/send', {
                sender_id: LOGGED_IN_ID,
                receiver_id: activeContact.contact_id,
                message_text: trimmed,
            });
            // Immediately refresh conversation after sending
            fetchConversation();
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    };

    // Allow pressing Enter to send
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // ─── Filter contacts by search term ──────────────────────────────────────
    const filteredContacts = contacts.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.container}>
            <TeacherSidebar />

            <main style={styles.main}>
                <div style={styles.content}>
                    <div style={styles.chatCard}>

                        {/* ── LEFT PANEL: CONTACTS ─────────────────────────── */}
                        <div style={styles.leftPanel}>
                            {/* Search Bar */}
                            <div style={styles.searchContainer}>
                                <FaSearch color="#9CA3AF" />
                                <input
                                    placeholder="Search students..."
                                    style={styles.searchInput}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Contact List */}
                            <div style={styles.contactList}>
                                {filteredContacts.length === 0 ? (
                                    <p style={{ padding: '20px', color: '#9CA3AF', fontSize: '13px' }}>
                                        No conversations yet.
                                    </p>
                                ) : filteredContacts.map(contact => (
                                    <div
                                        key={contact.contact_id}
                                        style={activeContact?.contact_id === contact.contact_id
                                            ? styles.contactActive : styles.contact}
                                        onClick={() => setActiveContact(contact)}
                                    >
                                        <div style={styles.avatar}>{contact.name.charAt(0).toUpperCase()}</div>
                                        <div style={styles.contactInfo}>
                                            <div style={styles.rowBetween}>
                                                <span style={styles.contactName}>{contact.name}</span>
                                                <span style={styles.time}>{formatTime(contact.last_sent)}</span>
                                            </div>
                                            <div style={styles.preview}>
                                                {contact.last_message || 'No messages yet'}
                                            </div>
                                        </div>
                                        {/* Unread indicator dot */}
                                        {contact.last_message && (
                                            <FaCircle size={8} color="#2563EB" style={{ marginLeft: 8, flexShrink: 0 }} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── RIGHT PANEL: CHAT WINDOW ─────────────────────── */}
                        <div style={styles.rightPanel}>
                            {activeContact ? (
                                <>
                                    {/* Chat Header */}
                                    <div style={styles.chatHeader}>
                                        <div style={styles.avatarLarge}>
                                            {activeContact.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={styles.headerName}>{activeContact.name}</div>
                                            <div style={styles.headerRole}>
                                                {activeContact.role} • {activeContact.grade}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Messages Area */}
                                    <div style={styles.messageList}>
                                        {messages.length === 0 ? (
                                            <p style={{ textAlign: 'center', color: '#9CA3AF', marginTop: '40px' }}>
                                                No messages yet. Say hello!
                                            </p>
                                        ) : messages.map(msg => {
                                            const isMe = msg.sender_id === LOGGED_IN_ID;
                                            return (
                                                <div key={msg.message_id} style={isMe ? styles.msgRowMe : styles.msgRowThem}>
                                                    <div style={isMe ? styles.bubbleMe : styles.bubbleThem}>
                                                        {msg.content}
                                                        <div style={isMe ? styles.timeMe : styles.timeThem}>
                                                            {formatTime(msg.sent_time)}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {/* Invisible anchor for auto-scroll */}
                                        <div ref={messageEndRef} />
                                    </div>

                                    {/* Input Area */}
                                    <div style={styles.inputArea}>
                                        <input
                                            placeholder="Type your message..."
                                            style={styles.msgInput}
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                        />
                                        <button style={styles.sendBtn} onClick={handleSend}>
                                            <FaPaperPlane />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div style={styles.emptyState}>
                                    <p>Select a conversation to start chatting.</p>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

const styles = {
    container: { display: 'flex', height: '100vh', background: '#F9FAFB', fontFamily: 'sans-serif' },
    main: { marginLeft: '250px', flex: 1, display: 'flex', flexDirection: 'column' },
    content: { padding: '25px', height: 'calc(100vh - 50px)', boxSizing: 'border-box' },

    chatCard: { display: 'flex', height: '100%', background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' },

    // Left Panel
    leftPanel: { width: '320px', borderRight: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column' },
    searchContainer: { padding: '20px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: '10px' },
    searchInput: { border: 'none', outline: 'none', width: '100%', fontSize: '14px' },

    contactList: { overflowY: 'auto', flex: 1 },
    contact: { padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', borderBottom: '1px solid #F9FAFB', transition: 'background 0.15s' },
    contactActive: { padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: '#EFF6FF', borderLeft: '3px solid #2563EB' },

    avatar: { width: '40px', height: '40px', borderRadius: '50%', background: '#DBEAFE', color: '#1E40AF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 },
    contactInfo: { flex: 1, overflow: 'hidden' },
    rowBetween: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' },
    contactName: { fontWeight: '600', fontSize: '14px', color: '#1F2937' },
    time: { fontSize: '11px', color: '#9CA3AF' },
    preview: { fontSize: '12px', color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },

    // Right Panel
    rightPanel: { flex: 1, display: 'flex', flexDirection: 'column' },
    chatHeader: { padding: '15px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '12px', background: '#fff' },
    avatarLarge: { width: '45px', height: '45px', borderRadius: '50%', background: '#DBEAFE', color: '#1E40AF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', flexShrink: 0 },
    headerName: { fontWeight: 'bold', fontSize: '16px', color: '#111827' },
    headerRole: { fontSize: '12px', color: '#6B7280' },

    messageList: { flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', background: '#fff' },

    msgRowMe: { display: 'flex', justifyContent: 'flex-end' },
    msgRowThem: { display: 'flex', justifyContent: 'flex-start' },

    bubbleMe: { background: '#2563EB', color: '#fff', padding: '12px 16px', borderRadius: '12px 12px 0 12px', maxWidth: '65%', fontSize: '14px', lineHeight: '1.5' },
    bubbleThem: { background: '#F3F4F6', color: '#1F2937', padding: '12px 16px', borderRadius: '12px 12px 12px 0', maxWidth: '65%', fontSize: '14px', lineHeight: '1.5' },

    timeMe: { fontSize: '10px', color: '#BFDBFE', marginTop: '5px', textAlign: 'right' },
    timeThem: { fontSize: '10px', color: '#9CA3AF', marginTop: '5px' },

    inputArea: { padding: '15px 20px', borderTop: '1px solid #E5E7EB', display: 'flex', gap: '10px', background: '#fff' },
    msgInput: { flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', outline: 'none', fontSize: '14px' },
    sendBtn: { width: '46px', height: '46px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },

    emptyState: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' },
};

export default TeacherMessages;