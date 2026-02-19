import React, { useState } from 'react';
import { FaSearch, FaEdit, FaTrash, FaImage } from 'react-icons/fa';
import TeacherSidebar from '../components/TeacherSidebar';
import Header from '../components/Header';

const TeacherAnnouncements = () => {
    // Dummy Data matching your screenshot
    const [announcements] = useState([
        { 
            id: 1, 
            title: 'End of Term Exams Schedule', 
            category: 'General', 
            desc: 'The end of term examination schedule has been finalized. Please check the attached timetable...',
            date: 'Jun 10, 2023',
            author: 'Dr. Sarah Miller'
        },
        { 
            id: 2, 
            title: 'Math Assignment Deadline Extended', 
            category: 'Class', 
            desc: 'Due to multiple requests, the deadline for the Advanced Mathematics Problem Set 3 has been extended...',
            date: 'Jun 12, 2023',
            author: 'Dr. Sarah Miller'
        },
        { 
            id: 3, 
            title: 'Campus Maintenance Notice', 
            category: 'Urgent', 
            desc: 'The main building will be undergoing maintenance this weekend. All classes rescheduled...',
            date: 'Jun 8, 2023',
            author: 'Admin Office',
            hasImage: true
        },
    ]);

    return (
        <div style={styles.container}>
            <TeacherSidebar />
            <main style={styles.main}>
                <Header title="Announcements" />
                
                <div style={styles.content}>
                    
                    {/* --- LEFT PANEL: CREATE FORM --- */}
                    <div style={styles.createPanel}>
                        <h3 style={styles.panelTitle}>Create Announcement</h3>
                        
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Title</label>
                            <input type="text" placeholder="Enter title..." style={styles.input} />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Description</label>
                            <textarea rows="5" placeholder="Type your announcement here..." style={styles.textarea} />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Category</label>
                            <select style={styles.select}>
                                <option>General</option>
                                <option>Class</option>
                                <option>Urgent</option>
                            </select>
                        </div>

                        <div style={styles.uploadBox}>
                            <FaImage color="#9CA3AF" size={20} />
                            <span style={{fontSize: 13, color: '#6B7280'}}>Upload Image (Optional)</span>
                        </div>

                        <button style={styles.publishBtn}>Publish Announcement</button>
                    </div>

                    {/* --- RIGHT PANEL: FEED --- */}
                    <div style={styles.feedPanel}>
                        <div style={styles.feedHeader}>
                            <h2 style={styles.feedTitle}>Previous Announcements</h2>
                            <div style={styles.searchBox}>
                                <FaSearch color="#9CA3AF" />
                                <input placeholder="Search..." style={styles.searchInput} />
                            </div>
                        </div>

                        <div style={styles.listContainer}>
                            {announcements.map(item => (
                                <div key={item.id} style={styles.card}>
                                    <div style={styles.cardHeader}>
                                        <span style={getCategoryStyle(item.category)}>{item.category}</span>
                                        <div style={styles.actions}>
                                            <FaEdit style={styles.iconAction} />
                                            <FaTrash style={styles.iconAction} />
                                        </div>
                                    </div>

                                    <h4 style={styles.cardTitle}>{item.title}</h4>
                                    <p style={styles.cardDesc}>{item.desc}</p>
                                    
                                    {item.hasImage && (
                                        <div style={styles.imagePlaceholder}>
                                            <FaImage color="#fff" size={30}/>
                                        </div>
                                    )}

                                    <div style={styles.cardFooter}>
                                        <span>{item.date}</span>
                                        <span>Posted by <strong>{item.author}</strong></span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

// Helper for Category Badges
const getCategoryStyle = (category) => {
    const base = { fontSize: 11, padding: '4px 10px', borderRadius: 12, fontWeight: '600' };
    if (category === 'Urgent') return { ...base, backgroundColor: '#FEE2E2', color: '#DC2626' };
    if (category === 'Class') return { ...base, backgroundColor: '#DBEAFE', color: '#2563EB' };
    return { ...base, backgroundColor: '#F3F4F6', color: '#4B5563' };
};

const styles = {
    container: { display: 'flex', height: '100vh', background: '#F9FAFB', fontFamily: 'sans-serif' },
    main: { marginLeft: '250px', flex: 1, display: 'flex', flexDirection: 'column' },
    content: { padding: '25px', display: 'flex', gap: '30px', height: 'calc(100vh - 70px)', boxSizing: 'border-box' },

    // Left Panel (Form)
    createPanel: { width: '350px', background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: '20px' },
    panelTitle: { margin: 0, fontSize: '16px', color: '#111827' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '13px', fontWeight: '500', color: '#374151' },
    input: { padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px', outline: 'none' },
    textarea: { padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px', outline: 'none', resize: 'none' },
    select: { padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px', outline: 'none', backgroundColor: '#fff' },
    
    uploadBox: { border: '1px dashed #D1D5DB', borderRadius: '6px', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', backgroundColor: '#F9FAFB' },
    publishBtn: { backgroundColor: '#2563EB', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', marginTop: 'auto' },

    // Right Panel (Feed)
    feedPanel: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    feedHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    feedTitle: { margin: 0, fontSize: '18px', color: '#111827' },
    
    searchBox: { display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '8px 15px', borderRadius: '8px', border: '1px solid #E5E7EB' },
    searchInput: { border: 'none', outline: 'none', marginLeft: '10px', fontSize: '13px' },

    listContainer: { overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', paddingRight: '10px' },
    
    // Cards
    card: { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
    actions: { display: 'flex', gap: '10px' },
    iconAction: { color: '#9CA3AF', cursor: 'pointer', fontSize: '14px' },
    
    cardTitle: { margin: '0 0 8px 0', fontSize: '16px', color: '#111827' },
    cardDesc: { margin: 0, fontSize: '14px', color: '#4B5563', lineHeight: '1.5', marginBottom: '15px' },
    
    imagePlaceholder: { width: '100%', height: '150px', backgroundColor: '#1F2937', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' },
    
    cardFooter: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9CA3AF', borderTop: '1px solid #F3F4F6', paddingTop: '15px' }
};

export default TeacherAnnouncements;