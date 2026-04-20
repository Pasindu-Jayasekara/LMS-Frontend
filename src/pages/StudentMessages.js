import React, { useState } from 'react';
import { FaPaperPlane, FaCircle } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';

const StudentMessages = () => {
    const [activeChat, setActiveChat] = useState(1);
    const [messageInput, setMessageInput] = useState('');

    // Dummy Contact List
    const contacts = [
        { id: 1, name: 'Mr. Saman Kumara', subject: 'Mathematics Teacher', preview: 'For that problem, you\'ll need to identify u and dv carefully.', time: '10:30 AM', unread: false, avatarColor: '#2563eb' },
        { id: 2, name: 'Mrs. Chamari Perera', subject: 'Physics Teacher', preview: 'Thank you for the reminder. I\'ll submit it on time.', time: 'Yesterday', unread: true, avatarColor: '#2563eb' },
        { id: 3, name: 'Dr. Nimal Silva', subject: 'Chemistry Teacher', preview: 'Yes, we\'ll have a revision session on Friday at 3 PM.', time: '2 days ago', unread: false, avatarColor: '#2563eb' },
    ];

    // Dummy Chat History for Active Chat
    const chatHistory = [
        { id: 1, sender: 'them', text: 'Hello Pasindu, how are you doing with the calculus assignment?', time: '10:30 AM' },
        { id: 2, sender: 'me', text: 'Hi sir, I\'m working on it. I have a question about problem 3.', time: '10:35 AM' },
        { id: 3, sender: 'them', text: 'Sure, what\'s your question?', time: '10:36 AM' },
        { id: 4, sender: 'me', text: 'I\'m not sure how to apply the integration by parts formula for this particular problem.', time: '10:38 AM' },
        { id: 5, sender: 'them', text: 'For that problem, you\'ll need to identify u and dv carefully. Let u = ln(x) and dv = x dx.', time: '10:40 AM' },
    ];

    return (
        <div style={styles.container}>
            <Sidebar />
            <main style={styles.main}>
                <div style={styles.content}>
                    <h1 style={styles.pageTitle}>Messages</h1>

                    <div style={styles.messageLayout}>
                        {/* --- LEFT SIDE: CONTACT LIST --- */}
                        <div style={styles.contactList}>
                            <div style={styles.searchContainer}>
                                <input placeholder="Search messages..." style={styles.searchInput} />
                            </div>

                            {contacts.map(contact => (
                                <div 
                                    key={contact.id} 
                                    style={activeChat === contact.id ? styles.contactItemActive : styles.contactItem}
                                    onClick={() => setActiveChat(contact.id)}
                                >
                                    <div style={{...styles.avatar, backgroundColor: contact.avatarColor}}>
                                        {contact.name.charAt(0)}
                                    </div>
                                    <div style={styles.contactInfo}>
                                        <div style={styles.contactHeader}>
                                            <span style={styles.contactName}>{contact.name}</span>
                                            <span style={styles.contactTime}>{contact.time}</span>
                                        </div>
                                        <div style={styles.contactSub}>{contact.subject}</div>
                                        <div style={styles.previewText}>{contact.preview}</div>
                                    </div>
                                    {contact.unread && <FaCircle size={8} color="#2563eb" style={{marginLeft: 5}} />}
                                </div>
                            ))}
                        </div>

                        {/* --- RIGHT SIDE: CHAT WINDOW --- */}
                        <div style={styles.chatWindow}>
                            {/* Chat Header */}
                            <div style={styles.chatHeader}>
                                <div style={{...styles.avatar, backgroundColor: '#2563eb'}}>M</div>
                                <div>
                                    <div style={styles.headerName}>Mr. Saman Kumara</div>
                                    <div style={styles.headerRole}>Mathematics Teacher</div>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div style={styles.messagesContainer}>
                                {chatHistory.map(msg => (
                                    <div key={msg.id} style={msg.sender === 'me' ? styles.myMessageRow : styles.theirMessageRow}>
                                        <div style={msg.sender === 'me' ? styles.myBubble : styles.theirBubble}>
                                            {msg.text}
                                            <div style={msg.sender === 'me' ? styles.myTime : styles.theirTime}>{msg.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Input Area */}
                            <div style={styles.inputArea}>
                                <input 
                                    placeholder="Type your message..." 
                                    style={styles.chatInput}
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                />
                                <button style={styles.sendBtn}>
                                    <FaPaperPlane />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const styles = {
    container: { display: 'flex', height: '100vh', backgroundColor: '#F9FAFB', fontFamily: "'Inter', sans-serif" },
    main: { marginLeft: '250px', flex: 1, display: 'flex', flexDirection: 'column' },
    content: { padding: '30px', height: 'calc(100vh - 64px)', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' },
    pageTitle: { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#111827' },

    messageLayout: { display: 'flex', flex: 1, backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' },

    // Contact List
    contactList: { width: '350px', borderRight: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column' },
    searchContainer: { padding: '20px', borderBottom: '1px solid #F3F4F6' },
    searchInput: { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #E5E7EB', outline: 'none', fontSize: '14px', boxSizing: 'border-box' },
    
    contactItem: { padding: '15px 20px', display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', borderBottom: '1px solid #F9FAFB' },
    contactItemActive: { padding: '15px 20px', display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', backgroundColor: '#F3E8FF', borderLeft: '4px solid #2563eb' }, // Active Purple BG
    
    avatar: { width: '40px', height: '40px', borderRadius: '50%', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 },
    contactInfo: { flex: 1, overflow: 'hidden' },
    contactHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '2px' },
    contactName: { fontWeight: '600', fontSize: '14px', color: '#111827' },
    contactTime: { fontSize: '11px', color: '#6B7280' },
    contactSub: { fontSize: '12px', color: '#6B7280', marginBottom: '4px' },
    previewText: { fontSize: '13px', color: '#374151', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },

    // Chat Window
    chatWindow: { flex: 1, display: 'flex', flexDirection: 'column' },
    chatHeader: { padding: '15px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '12px' },
    headerName: { fontWeight: 'bold', color: '#111827' },
    headerRole: { fontSize: '12px', color: '#6B7280' },

    messagesContainer: { flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' },
    
    // Message Bubbles
    theirMessageRow: { display: 'flex', justifyContent: 'flex-start' },
    myMessageRow: { display: 'flex', justifyContent: 'flex-end' },
    
    theirBubble: { backgroundColor: '#F3F4F6', color: '#1F2937', padding: '12px 16px', borderRadius: '12px 12px 12px 0', maxWidth: '60%', fontSize: '14px', lineHeight: '1.4' },
    myBubble: { backgroundColor: '#1D4ED8', color: '#fff', padding: '12px 16px', borderRadius: '12px 12px 0 12px', maxWidth: '60%', fontSize: '14px', lineHeight: '1.4' },
    
    theirTime: { fontSize: '10px', color: '#6B7280', marginTop: '5px' },
    myTime: { fontSize: '10px', color: '#E0E7FF', marginTop: '5px', textAlign: 'right' },

    // Input Area
    inputArea: { padding: '20px', borderTop: '1px solid #E5E7EB', display: 'flex', gap: '10px', alignItems: 'center' },
    chatInput: { flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #E5E7EB', outline: 'none' },
    sendBtn: { backgroundColor: '#1D4ED8', color: '#fff', border: 'none', width: '40px', height: '40px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }
};

export default StudentMessages;