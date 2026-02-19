import React, { useState } from 'react';
import { FaSearch, FaPaperPlane, FaCircle } from 'react-icons/fa';
import TeacherSidebar from '../components/TeacherSidebar';
import Header from '../components/Header';

const TeacherMessages = () => {
    const [activeChat, setActiveChat] = useState(1);
    const [input, setInput] = useState('');

    // Dummy Data: Teacher's contact list (Students)
    const contacts = [
        { id: 1, name: 'Pasindu S.', role: 'Student', grade: '12-A', preview: 'I have submitted the assignment sir.', time: '10:35 AM', unread: true },
        { id: 2, name: 'Alex Johnson', role: 'Student', grade: '12-B', preview: 'Can we reschedule the extra class?', time: 'Yesterday', unread: false },
        { id: 3, name: 'Sarah Williams', role: 'Student', grade: '11-C', preview: 'Thank you for the clarification.', time: '2 days ago', unread: false },
    ];

    // Dummy Conversation
    const messages = [
        { id: 1, sender: 'me', text: 'Hello Pasindu, have you completed the Calculus problem set?', time: '10:30 AM' },
        { id: 2, sender: 'them', text: 'Hi sir, I am working on it. I had a small doubt in Q3.', time: '10:32 AM' },
        { id: 3, sender: 'me', text: 'Sure, what is your question?', time: '10:33 AM' },
        { id: 4, sender: 'them', text: 'I have submitted the assignment sir. Please check when you are free.', time: '10:35 AM' },
    ];

    return (
        <div style={styles.container}>
            <TeacherSidebar />
            
            <main style={styles.main}>
                <Header title="Messaging" />
                
                <div style={styles.content}>
                    <div style={styles.chatCard}>
                        
                        {/* --- LEFT PANEL: CONTACTS --- */}
                        <div style={styles.leftPanel}>
                            <div style={styles.searchContainer}>
                                <FaSearch color="#9CA3AF" />
                                <input placeholder="Search students..." style={styles.searchInput} />
                            </div>

                            <div style={styles.contactList}>
                                {contacts.map(contact => (
                                    <div 
                                        key={contact.id} 
                                        style={activeChat === contact.id ? styles.contactActive : styles.contact}
                                        onClick={() => setActiveChat(contact.id)}
                                    >
                                        <div style={styles.avatar}>{contact.name.charAt(0)}</div>
                                        <div style={styles.contactInfo}>
                                            <div style={styles.rowBetween}>
                                                <span style={styles.contactName}>{contact.name}</span>
                                                <span style={styles.time}>{contact.time}</span>
                                            </div>
                                            <div style={styles.preview}>{contact.preview}</div>
                                        </div>
                                        {contact.unread && <FaCircle size={8} color="#2563EB" style={{marginLeft: 8}} />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* --- RIGHT PANEL: CHAT WINDOW --- */}
                        <div style={styles.rightPanel}>
                            {/* Chat Header */}
                            <div style={styles.chatHeader}>
                                <div style={styles.avatarLarge}>P</div>
                                <div>
                                    <div style={styles.headerName}>Pasindu S.</div>
                                    <div style={styles.headerRole}>Student • Grade 12-A</div>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div style={styles.messageList}>
                                {messages.map(msg => (
                                    <div key={msg.id} style={msg.sender === 'me' ? styles.msgRowMe : styles.msgRowThem}>
                                        <div style={msg.sender === 'me' ? styles.bubbleMe : styles.bubbleThem}>
                                            {msg.text}
                                            <div style={msg.sender === 'me' ? styles.timeMe : styles.timeThem}>{msg.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input Area */}
                            <div style={styles.inputArea}>
                                <input 
                                    placeholder="Type your message..." 
                                    style={styles.msgInput}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)} 
                                />
                                <button style={styles.sendBtn}><FaPaperPlane /></button>
                            </div>
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
    content: { padding: '25px', height: 'calc(100vh - 70px)', boxSizing: 'border-box' },

    chatCard: { display: 'flex', height: '100%', background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' },

    // Left Panel
    leftPanel: { width: '320px', borderRight: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column' },
    searchContainer: { padding: '20px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: '10px' },
    searchInput: { border: 'none', outline: 'none', width: '100%', fontSize: '14px' },
    
    contactList: { overflowY: 'auto', flex: 1 },
    contact: { padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', borderBottom: '1px solid #F9FAFB' },
    contactActive: { padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: '#EFF6FF', borderLeft: '3px solid #2563EB' },
    
    avatar: { width: '40px', height: '40px', borderRadius: '50%', background: '#DBEAFE', color: '#1E40AF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
    contactInfo: { flex: 1, overflow: 'hidden' },
    rowBetween: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' },
    contactName: { fontWeight: '600', fontSize: '14px', color: '#1F2937' },
    time: { fontSize: '11px', color: '#9CA3AF' },
    preview: { fontSize: '12px', color: '#6B7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },

    // Right Panel
    rightPanel: { flex: 1, display: 'flex', flexDirection: 'column' },
    chatHeader: { padding: '15px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '12px' },
    avatarLarge: { width: '45px', height: '45px', borderRadius: '50%', background: '#DBEAFE', color: '#1E40AF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px' },
    headerName: { fontWeight: 'bold', fontSize: '16px', color: '#111827' },
    headerRole: { fontSize: '12px', color: '#6B7280' },

    messageList: { flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', background: '#fff' },
    
    msgRowMe: { display: 'flex', justifyContent: 'flex-end' },
    msgRowThem: { display: 'flex', justifyContent: 'flex-start' },
    
    bubbleMe: { background: '#2563EB', color: '#fff', padding: '12px 16px', borderRadius: '12px 12px 0 12px', maxWidth: '65%', fontSize: '14px', lineHeight: '1.5' },
    bubbleThem: { background: '#F3F4F6', color: '#1F2937', padding: '12px 16px', borderRadius: '12px 12px 12px 0', maxWidth: '65%', fontSize: '14px', lineHeight: '1.5' },
    
    timeMe: { fontSize: '10px', color: '#BFDBFE', marginTop: '5px', textAlign: 'right' },
    timeThem: { fontSize: '10px', color: '#9CA3AF', marginTop: '5px' },

    inputArea: { padding: '20px', borderTop: '1px solid #E5E7EB', display: 'flex', gap: '10px' },
    msgInput: { flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', outline: 'none', fontSize: '14px' },
    sendBtn: { width: '45px', background: '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};

export default TeacherMessages;