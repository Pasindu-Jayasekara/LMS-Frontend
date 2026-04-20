import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';

const AIAssistant = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        { role: 'ai', text: "Hello! I'm your AI Assistant. How can I help you with your studies today?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom of chat
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSend = async (forcedQuestion = null) => {
        const question = forcedQuestion || input;
        if (!question.trim()) return;

        // Add user message to UI
        const newMessages = [...messages, { role: 'user', text: question }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            // API call to our new backend route
            const res = await axios.post('http://localhost:5000/api/ai/ask', { question });
            
            // Add AI response to UI
            setMessages([...newMessages, { role: 'ai', text: res.data.answer }]);
        } catch (err) {
            console.error("AI Error:", err);
            setMessages([...newMessages, { role: 'ai', text: "Sorry, I encountered an error. Please try again later." }]);
        } finally {
            setLoading(false);
        }
    };

    const suggestedQuestions = [
        "Explain integration by parts",
        "What is Newton's third law?",
        "Help me understand chemical bonds",
        "How do I solve quadratic equations?"
    ];

    return (
        <div style={styles.container}>
            <Sidebar />
            <main style={styles.main}>
                <div style={styles.content}>
                    
                    <div style={styles.layout}>
                        {/* --- LEFT COLUMN: CHAT INTERFACE --- */}
                        <div style={styles.chatContainer}>
                            {/* Header */}
                            <div style={styles.chatHeader}>
                                <div style={styles.botAvatar}>
                                    <FaRobot size={18} />
                                </div>
                                <h2 style={styles.headerTitle}>AI Assistant</h2>
                            </div>

                            {/* Message Area */}
                            <div style={styles.messageArea}>
                                {messages.map((msg, idx) => (
                                    <div key={idx} style={msg.role === 'user' ? styles.userRow : styles.aiRow}>
                                        {msg.role === 'ai' && (
                                            <div style={styles.msgAvatar}><FaRobot size={12} /></div>
                                        )}
                                        <div style={msg.role === 'user' ? styles.userBubble : styles.aiBubble}>
                                            {msg.text}
                                        </div>
                                        {msg.role === 'user' && (
                                            <div style={styles.userAvatar}><FaUser size={12} /></div>
                                        )}
                                    </div>
                                ))}
                                {loading && (
                                    <div style={styles.aiRow}>
                                        <div style={styles.msgAvatar}><FaRobot size={12} /></div>
                                        <div style={styles.aiBubble}>
                                            <span style={styles.thinking}>Thinking...</span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div style={styles.inputArea}>
                                <div style={styles.inputWrapper}>
                                    <input 
                                        type="text" 
                                        placeholder="Ask me anything about your lessons..." 
                                        style={styles.input}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                        disabled={loading}
                                    />
                                    <button 
                                        style={{...styles.sendBtn, opacity: loading ? 0.6 : 1}} 
                                        onClick={() => handleSend()}
                                        disabled={loading}
                                    >
                                        <FaPaperPlane />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* --- RIGHT COLUMN: SIDEBAR CARDS --- */}
                        <div style={styles.sidebarCards}>
                            {/* Card 1: Suggested Questions */}
                            <div style={styles.card}>
                                <h3 style={styles.cardTitle}>Suggested Questions</h3>
                                <div style={styles.pillContainer}>
                                    {suggestedQuestions.map((q, i) => (
                                        <button 
                                            key={i} 
                                            style={styles.pill} 
                                            onClick={() => handleSend(q)}
                                            disabled={loading}
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Card 2: Need More Help */}
                            <div style={styles.card}>
                                <h3 style={styles.cardTitle}>Need More Help?</h3>
                                <p style={styles.cardText}>
                                    If the AI can't answer your question, you can reach out to your teacher directly.
                                </p>
                                <button 
                                    style={styles.teacherBtn}
                                    onClick={() => navigate('/student-messaging')}
                                >
                                    Message Teacher
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
    container: { display: 'flex', height: '100vh', backgroundColor: '#F3F4F6', fontFamily: "'Inter', sans-serif" },
    main: { marginLeft: '250px', flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' },
    content: { padding: '30px', flex: 1, overflow: 'hidden' },
    layout: { display: 'flex', gap: '25px', height: '100%' },

    // Chat Interface (70%)
    chatContainer: { 
        flex: 7, 
        backgroundColor: '#fff', 
        borderRadius: '16px', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
    },
    chatHeader: { 
        padding: '20px 25px', 
        borderBottom: '1px solid #E5E7EB', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px' 
    },
    botAvatar: { 
        width: '36px', height: '36px', 
        backgroundColor: '#EEF2FF', 
        color: '#4F46E5', 
        borderRadius: '10px', 
        display: 'flex', alignItems: 'center', justifyContent: 'center' 
    },
    headerTitle: { fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: 0 },
    
    messageArea: { 
        flex: 1, 
        padding: '25px', 
        overflowY: 'auto', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '20px',
        backgroundColor: '#fafafa'
    },
    aiRow: { display: 'flex', gap: '10px', alignSelf: 'flex-start', maxWidth: '80%' },
    userRow: { display: 'flex', gap: '10px', alignSelf: 'flex-end', maxWidth: '80%' },
    
    msgAvatar: { width: '28px', height: '28px', backgroundColor: '#E5E7EB', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4B5563', flexShrink: 0 },
    userAvatar: { width: '28px', height: '28px', backgroundColor: '#DBEAFE', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1E40AF', flexShrink: 0 },
    
    aiBubble: { backgroundColor: '#E5E7EB', color: '#1F2937', padding: '12px 16px', borderRadius: '0 16px 16px 16px', fontSize: '14px', lineHeight: '1.5' },
    userBubble: { backgroundColor: '#2563EB', color: '#fff', padding: '12px 16px', borderRadius: '16px 16px 0 16px', fontSize: '14px', lineHeight: '1.5' },
    
    thinking: { fontStyle: 'italic', color: '#6B7280' },

    inputArea: { padding: '20px 25px', borderTop: '1px solid #E5E7EB', backgroundColor: '#fff' },
    inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
    input: { 
        width: '100%', 
        padding: '14px 20px', 
        paddingRight: '60px',
        borderRadius: '12px', 
        border: '1px solid #E5E7EB', 
        outline: 'none', 
        fontSize: '15px',
        backgroundColor: '#F9FAFB',
        transition: '0.2s',
    },
    sendBtn: { 
        position: 'absolute', 
        right: '10px', 
        backgroundColor: '#2563EB', 
        color: '#fff', 
        border: 'none', 
        width: '40px', height: '40px', 
        borderRadius: '10px', 
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
    },

    // Sidebar Cards (30%)
    sidebarCards: { flex: 3, display: 'flex', flexDirection: 'column', gap: '20px' },
    card: { backgroundColor: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
    cardTitle: { fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '15px', margin: 0 },
    cardText: { fontSize: '14px', color: '#6B7280', lineHeight: '1.5', marginBottom: '20px' },
    
    pillContainer: { display: 'flex', flexDirection: 'column', gap: '10px' },
    pill: { 
        width: '100%',
        textAlign: 'left',
        padding: '10px 15px', 
        backgroundColor: '#F3F4F6', 
        border: '1px solid #E5E7EB', 
        borderRadius: '10px', 
        fontSize: '13px', 
        color: '#374151', 
        cursor: 'pointer',
        transition: '0.2s',
        '&:hover': { backgroundColor: '#E5E7EB' }
    },
    teacherBtn: { 
        width: '100%', 
        padding: '12px', 
        backgroundColor: '#F3E8FF', 
        color: '#7E22CE', 
        border: 'none', 
        borderRadius: '10px', 
        fontWeight: 'bold', 
        fontSize: '14px', 
        cursor: 'pointer' 
    }
};

export default AIAssistant;
