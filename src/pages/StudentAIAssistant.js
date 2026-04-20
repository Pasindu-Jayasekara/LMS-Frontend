import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPaperPlane, FaRobot } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';

const StudentAIAssistant = () => {
    const navigate = useNavigate();
    const suggestions = [
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
                    <h1 style={styles.pageTitle}>AI Assistant</h1>

                    <div style={styles.layout}>
                        
                        {/* --- MAIN CHAT AREA --- */}
                        <div style={styles.chatCard}>
                            <div style={styles.chatHeader}>
                                <div style={styles.botIcon}><FaRobot size={20} /></div>
                                <span style={styles.botName}>AI Assistant</span>
                            </div>

                            <div style={styles.chatBody}>
                                <div style={styles.greetingBubble}>
                                    Hello! I'm your AI Assistant. How can I help you with your studies today?
                                </div>
                            </div>

                            <div style={styles.inputArea}>
                                <input placeholder="Ask me anything about your lessons..." style={styles.input} />
                                <button style={styles.sendBtn}><FaPaperPlane /></button>
                            </div>
                        </div>

                        {/* --- RIGHT SIDEBAR: SUGGESTIONS --- */}
                        <div style={styles.sidePanel}>
                            {/* Suggested Questions */}
                            <div style={styles.suggestionCard}>
                                <h3 style={styles.sideTitle}>Suggested Questions</h3>
                                <div style={styles.suggestionList}>
                                    {suggestions.map((item, index) => (
                                        <div key={index} style={styles.suggestionItem}>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Need More Help */}
                            <div style={styles.helpCard}>
                                <h3 style={styles.sideTitle}>Need More Help?</h3>
                                <p style={styles.helpText}>If the AI can't answer your question, you can reach out to your teacher directly.</p>
                                <button style={styles.teacherBtn} onClick={() => navigate('/student-messaging')}>Message Teacher</button>
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
    content: { padding: '30px', flex: 1, display: 'flex', flexDirection: 'column' },
    pageTitle: { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#111827' },

    layout: { display: 'flex', gap: '20px', flex: 1 },

    // Main Chat
    chatCard: { flex: 3, backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    chatHeader: { padding: '20px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: '10px' },
    botIcon: { width: '36px', height: '36px', backgroundColor: '#EFF6FF', borderRadius: '8px', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    botName: { fontWeight: 'bold', color: '#1F2937' },
    
    chatBody: { flex: 1, padding: '30px', backgroundColor: '#fff' },
    greetingBubble: { backgroundColor: '#F3F4F6', padding: '15px 20px', borderRadius: '0 15px 15px 15px', color: '#374151', maxWidth: '80%', lineHeight: '1.5' },

    inputArea: { padding: '20px', borderTop: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: '10px' },
    input: { flex: 1, border: 'none', outline: 'none', fontSize: '15px', color: '#374151' },
    sendBtn: { backgroundColor: '#1D4ED8', color: '#fff', border: 'none', width: '40px', height: '40px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },

    // Side Panel
    sidePanel: { flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' },
    
    suggestionCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    sideTitle: { fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', color: '#111827' },
    suggestionList: { display: 'flex', flexDirection: 'column', gap: '10px' },
    suggestionItem: { fontSize: '13px', padding: '10px', backgroundColor: '#F9FAFB', borderRadius: '6px', color: '#374151', cursor: 'pointer', border: '1px solid transparent', transition: '0.2s' },
    
    helpCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    helpText: { fontSize: '13px', color: '#6B7280', marginBottom: '15px', lineHeight: '1.5' },
    teacherBtn: { width: '100%', backgroundColor: '#F3E8FF', color: '#7E22CE', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' },
};

export default StudentAIAssistant;