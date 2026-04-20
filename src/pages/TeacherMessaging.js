import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaPaperPlane, FaSearch, FaUserGraduate } from 'react-icons/fa';
import TeacherSidebar from '../components/TeacherSidebar';

const TeacherMessaging = () => {
    const TEACHER_ID = sessionStorage.getItem('userId');
    const [contacts, setContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedContact, setSelectedContact] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);

    // Initial contacts fetch
    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/messages/teacher-contacts/${TEACHER_ID}`);
                setContacts(res.data);
            } catch (err) {
                console.error("Error fetching contacts:", err);
            }
        };
        if (TEACHER_ID) fetchContacts();
    }, [TEACHER_ID]);

    // Polling and conversation loading
    useEffect(() => {
        let interval = null;

        const fetchConversation = async () => {
            if (!selectedContact) return;
            try {
                const res = await axios.get(`http://localhost:5000/api/messages/conversation/${TEACHER_ID}/${selectedContact.contact_id}`);
                setMessages(res.data);
            } catch (err) {
                console.error("Error fetching conversation:", err);
            }
        };

        if (selectedContact) {
            fetchConversation();
            interval = setInterval(fetchConversation, 3000); // 3 second polling
        } else {
            setMessages([]);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [selectedContact, TEACHER_ID]);

    // Auto-scroll on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!inputText.trim() || !selectedContact) return;

        try {
            await axios.post('http://localhost:5000/api/messages/send', {
                sender_id: TEACHER_ID,
                receiver_id: selectedContact.contact_id,
                message_text: inputText.trim()
            });
            setInputText('');
            // Optimistically update or just wait 3s, but let's immediately fetch
            const res = await axios.get(`http://localhost:5000/api/messages/conversation/${TEACHER_ID}/${selectedContact.contact_id}`);
            setMessages(res.data);
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    const formatTime = (isoString) => {
        if (!isoString) return '';
        const d = new Date(isoString);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const filteredContacts = contacts.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.course_title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.container}>
            <TeacherSidebar />
            <main style={styles.main}>
                <div style={styles.messagingContainer}>
                    
                    {/* Left Column: Contacts */}
                    <div style={styles.contactsCol}>
                        <div style={styles.contactsHeader}>
                            <h2 style={styles.contactsTitle}>My Students</h2>
                            <div style={styles.searchBox}>
                                <FaSearch color="#9CA3AF" />
                                <input 
                                    type="text" 
                                    placeholder="Search students..." 
                                    style={styles.searchInput}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <div style={styles.contactsList}>
                            {filteredContacts.map(c => (
                                <div 
                                    key={Math.random()} 
                                    style={{
                                        ...styles.contactCard, 
                                        backgroundColor: selectedContact?.contact_id === c.contact_id ? '#EFF6FF' : '#fff',
                                        borderLeft: selectedContact?.contact_id === c.contact_id ? '4px solid #10B981' : '4px solid transparent'
                                    }}
                                    onClick={() => setSelectedContact(c)}
                                >
                                    <div style={styles.avatar}>
                                        <FaUserGraduate color="#fff" size={18} />
                                    </div>
                                    <div style={styles.contactInfo}>
                                        <h4 style={styles.contactName}>{c.name}</h4>
                                        <p style={styles.contactRole}>{c.course_title}</p>
                                    </div>
                                </div>
                            ))}
                            {filteredContacts.length === 0 && (
                                <p style={styles.emptyContacts}>No connected students found.</p>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Chat Window */}
                    <div style={styles.chatCol}>
                        {selectedContact ? (
                            <>
                                <div style={styles.chatHeader}>
                                    <div style={styles.avatar}>
                                        <FaUserGraduate color="#fff" size={18} />
                                    </div>
                                    <div>
                                        <h3 style={styles.chatHeaderName}>{selectedContact.name}</h3>
                                        <p style={styles.chatHeaderRole}>{selectedContact.course_title}</p>
                                    </div>
                                </div>
                                
                                <div style={styles.messageArea}>
                                    {messages.map(msg => {
                                        const isMine = msg.sender_id === TEACHER_ID;
                                        return (
                                            <div key={msg.message_id} style={{
                                                ...styles.messageRow,
                                                justifyContent: isMine ? 'flex-end' : 'flex-start'
                                            }}>
                                                <div style={{
                                                    ...styles.messageBubble,
                                                    backgroundColor: isMine ? '#10B981' : '#F3F4F6',
                                                    color: isMine ? '#fff' : '#1F2937',
                                                    borderBottomRightRadius: isMine ? 0 : 16,
                                                    borderBottomLeftRadius: isMine ? 16 : 0,
                                                }}>
                                                    <p style={styles.messageText}>{msg.message_text}</p>
                                                    <span style={{
                                                        ...styles.messageTime,
                                                        color: isMine ? 'rgba(255,255,255,0.7)' : '#9CA3AF'
                                                    }}>
                                                        {formatTime(msg.sent_at)}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                <div style={styles.inputArea}>
                                    <input 
                                        type="text" 
                                        placeholder="Type your reply here..." 
                                        style={styles.chatInput}
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    />
                                    <button style={styles.sendButton} onClick={handleSend}>
                                        <FaPaperPlane />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div style={styles.emptyChat}>
                                <div style={styles.emptyChatCircle}>
                                    <FaPaperPlane size={32} color="#9ca3af" />
                                </div>
                                <h3 style={styles.emptyChatTitle}>Teacher Inbox</h3>
                                <p style={styles.emptyChatDesc}>Select a student from the active directory to view messages.</p>
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
};

const styles = {
    container: { display: 'flex', height: '100vh', backgroundColor: '#F9FAFB', fontFamily: "'Inter', sans-serif" },
    main: { marginLeft: '250px', flex: 1, padding: '30px' },
    messagingContainer: {
        display: 'flex', height: 'calc(100vh - 60px)', backgroundColor: '#fff', 
        borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid #E5E7EB'
    },
    
    contactsCol: {
        width: '30%', minWidth: '280px', borderRight: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', backgroundColor: '#F9FAFB'
    },
    contactsHeader: { padding: '20px', borderBottom: '1px solid #E5E7EB', backgroundColor: '#fff' },
    contactsTitle: { margin: '0 0 15px 0', fontSize: '20px', fontWeight: 'bold', color: '#111827' },
    searchBox: { 
        display: 'flex', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: '8px', padding: '10px 12px', gap: '10px'
    },
    searchInput: { border: 'none', backgroundColor: 'transparent', outline: 'none', width: '100%', fontSize: '14px' },
    contactsList: { flex: 1, overflowY: 'auto' },
    contactCard: {
        display: 'flex', alignItems: 'center', padding: '15px 20px', cursor: 'pointer', transition: 'background-color 0.2s', borderBottom: '1px solid #F3F4F6'
    },
    avatar: {
        width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#059669', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, marginRight: '15px'
    },
    contactInfo: { flex: 1, overflow: 'hidden' },
    contactName: { margin: '0 0 4px 0', fontSize: '15px', fontWeight: 'bold', color: '#1F2937' },
    contactRole: { margin: 0, fontSize: '13px', color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    emptyContacts: { padding: '20px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' },
    
    chatCol: { flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#fff' },
    chatHeader: {
        display: 'flex', alignItems: 'center', padding: '20px 25px', borderBottom: '1px solid #E5E7EB', backgroundColor: '#fff'
    },
    chatHeaderName: { margin: '0 0 4px 0', fontSize: '18px', fontWeight: 'bold', color: '#111827' },
    chatHeaderRole: { margin: 0, fontSize: '14px', color: '#6B7280' },
    
    messageArea: { flex: 1, padding: '25px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', backgroundColor: '#F9FAFB' },
    messageRow: { display: 'flex', width: '100%' },
    messageBubble: { 
        padding: '12px 18px', borderRadius: '16px', maxWidth: '65%', position: 'relative', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    },
    messageText: { margin: 0, fontSize: '15px', lineHeight: '1.4' },
    messageTime: { display: 'block', fontSize: '11px', marginTop: '6px', textAlign: 'right' },
    
    inputArea: {
        padding: '20px 25px', borderTop: '1px solid #E5E7EB', backgroundColor: '#fff', display: 'flex', gap: '15px', alignItems: 'center'
    },
    chatInput: {
        flex: 1, padding: '14px 18px', borderRadius: '24px', border: '1px solid #D1D5DB', backgroundColor: '#F9FAFB', fontSize: '15px', outline: 'none'
    },
    sendButton: {
        width: '46px', height: '46px', borderRadius: '50%', backgroundColor: '#10B981', color: '#fff', border: 'none',
        display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', flexShrink: 0, transition: 'background-color 0.2s', ':hover': { backgroundColor: '#059669' }
    },
    
    emptyChat: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9FAFB' },
    emptyChatCircle: { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' },
    emptyChatTitle: { margin: '0 0 8px 0', fontSize: '20px', fontWeight: 'bold', color: '#4B5563' },
    emptyChatDesc: { margin: 0, color: '#9CA3AF', fontSize: '14px' },
};

export default TeacherMessaging;
