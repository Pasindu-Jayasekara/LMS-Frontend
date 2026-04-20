import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBullhorn, FaPlus, FaTrash, FaBell, FaPaperPlane } from 'react-icons/fa';
import AdminSidebar from '../components/AdminSidebar';


const ManageNotices = () => {
    // Start with an empty array for Real Data
    const [notices, setNotices] = useState([]);
    const [formData, setFormData] = useState({ title: '', message: ''}); // State for the new notice form

    // --- NEW: Fetch Notices when page loads ---
    const fetchNotices = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/announcements');
            setNotices(response.data);
        } catch (error) {
            console.error("Error fetching notices:", error);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send data to the new POST route
            await axios.post('http://localhost:5000/api/announcements/add', formData);
            
            alert("Notice Posted Successfully!");

        setFormData({ title: '', message: '' }); // Clear form after submit
        fetchNotices(); 
            
        } catch (error) {
            console.error("Error posting notice:", error);
            alert("Failed to post notice. Check console.");
        }
    };

    // --- Delete an announcement from the database ---
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this announcement?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/announcements/${id}`);
            // Refresh the list to reflect the deletion
            fetchNotices();
        } catch (error) {
            console.error("Error deleting announcement:", error);
            alert("Failed to delete announcement.");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.sidebarWrapper}>
                <AdminSidebar />
            </div>

            <main style={styles.main}>
                <div style={styles.content}>
                    <div style={styles.pageHeader}>
                        <h2 style={styles.pageTitle}><FaBullhorn style={{marginRight: 10, color: '#f59e0b'}}/> Announcements</h2>
                        <p style={styles.subText}>Post important notices to all student dashboards instantly.</p>
                    </div>

                    <div style={styles.grid}>
                        {/* LEFT SIDE: POST NOTICE FORM */}
                        <div style={styles.card}>
                            <h3 style={styles.cardTitle}>Create New Notice</h3>
                            <form onSubmit={handleSubmit} style={styles.form}>
                                
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Notice Title</label>
                                    <input 
                                        type="text" 
                                        name="title" 
                                        value={formData.title} 
                                        onChange={handleChange} 
                                        placeholder="e.g. Exam Timetable Released" 
                                        style={styles.input} 
                                        required 
                                    />
                                </div>

                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Message Body</label>
                                    <textarea 
                                        name="message" 
                                        value={formData.message} 
                                        onChange={handleChange} 
                                        placeholder="Type your detailed announcement here..." 
                                        style={{...styles.input, height: '150px', resize: 'none'}} 
                                        required 
                                    />
                                </div>

                                {/* Note: We don't need a Date picker because the database will use CURDATE() automatically! */}

                                <button type="submit" style={styles.submitBtn}>
                                    <FaPaperPlane /> Post Announcement
                                </button>
                            </form>
                        </div>

                        {/* RIGHT SIDE: RECENT NOTICES */}
                        <div style={styles.card}>
                            <h3 style={styles.cardTitle}><FaBell color="#2563EB" style={{marginRight: 8}}/> Notice Board</h3>
                            <div style={styles.listContainer}>
                                {notices.map((notice) => (
                                    <div key={notice.announcement_id} style={styles.noticeItem}>
                                        <div style={styles.noticeHeader}>
                                            <h4 style={styles.noticeTitle}>{notice.title}</h4>
                                            <span style={styles.dateBadge}>{notice.date}</span>
                                        </div>
                                        <p style={styles.noticeBody}>{notice.message}</p>
                                        <div style={styles.actionRow}>
                                            <button
                                                style={styles.deleteBtn}
                                                title="Delete Notice"
                                                onClick={() => handleDelete(notice.announcement_id)}
                                            >
                                                <FaTrash style={{marginRight: 5}}/> Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

// --- STYLES ---
const styles = {
    // Layout Logic (Kept exactly identical to prevent scrollbar issues)
    container: { display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#F9FAFB', fontFamily: 'sans-serif', overflow: 'hidden' },
    sidebarWrapper: { width: '250px', flexShrink: 0, height: '100%', overflowY: 'auto' },
    main: { flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' },
    content: { flex: 1, overflowY: 'auto', padding: '30px', boxSizing: 'border-box' },

    pageHeader: { marginBottom: '25px' },
    pageTitle: { margin: 0, fontSize: '24px', color: '#111827', display: 'flex', alignItems: 'center' },
    subText: { margin: '5px 0 0 0', color: '#6B7280', fontSize: '14px' },

    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },

    // Card Styles
    card: { backgroundColor: '#fff', borderRadius: '12px', padding: '25px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' },
    cardTitle: { margin: '0 0 20px 0', fontSize: '18px', color: '#374151', borderBottom: '2px solid #F3F4F6', paddingBottom: '10px', display: 'flex', alignItems: 'center' },

    // Form Styles
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '14px', fontWeight: '600', color: '#374151' },
    input: { padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', outline: 'none', fontSize: '14px', fontFamily: 'inherit', backgroundColor: '#F9FAFB' },
    submitBtn: { marginTop: '10px', backgroundColor: '#10B981', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', transition: '0.2s' },

    // List Styles
    listContainer: { display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto', paddingRight: '5px' },
    noticeItem: { padding: '20px', backgroundColor: '#FFFBEB', borderRadius: '8px', border: '1px solid #FDE68A' },
    noticeHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' },
    noticeTitle: { margin: 0, fontSize: '16px', color: '#92400E', fontWeight: 'bold' },
    dateBadge: { fontSize: '12px', color: '#B45309', backgroundColor: '#FEF3C7', padding: '3px 8px', borderRadius: '12px', fontWeight: 'bold' },
    noticeBody: { margin: '0 0 15px 0', fontSize: '14px', color: '#78350F', lineHeight: '1.5' },
    
    actionRow: { display: 'flex', justifyContent: 'flex-end' },
    deleteBtn: { backgroundColor: 'transparent', border: 'none', color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '13px', fontWeight: 'bold' }
};

export default ManageNotices;