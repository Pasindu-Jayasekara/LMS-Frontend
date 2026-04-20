import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaTrash, FaImage } from 'react-icons/fa';
import TeacherSidebar from '../components/TeacherSidebar';

const TeacherAnnouncements = () => {
    const loggedInTeacherId = 'T2701';

    const [announcements, setAnnouncements] = useState([]);
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [form, setForm] = useState({ course_id: '', grade: 'Grade 12', title: '', message: '' });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                // Fetch dynamic active courses list
                const courseRes = await axios.get(`http://localhost:5000/api/teacher/announcements/my-courses/${loggedInTeacherId}`);
                setCourses(courseRes.data);
                
                // Fetch announcements feed
                fetchAnnouncements();
            } catch (error) {
                console.error('Failed loading layout data', error);
            }
        };
        fetchInitialData();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const listRes = await axios.get(`http://localhost:5000/api/teacher/announcements/list/${loggedInTeacherId}`);
            setAnnouncements(listRes.data);
        } catch(e) { console.error('Error fetching list', e); }
    };

    const handlePublish = async (e) => {
        e.preventDefault();
        if (!form.title || !form.message) return alert("Title and Message are required!");
        
        try {
            await axios.post('http://localhost:5000/api/teacher/announcements/create', {
                teacher_id: loggedInTeacherId,
                course_id: form.course_id === '' ? null : form.course_id,
                grade: form.grade === 'All Grades' ? null : form.grade,
                title: form.title,
                message: form.message
            });
            
            setForm({ course_id: '', grade: 'Grade 12', title: '', message: '' });
            fetchAnnouncements();
            alert('Announcement Published Successfully!');
        } catch (error) {
            console.error('Publish error', error);
            alert('Failed to construct announcement');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you securely certain you want to delete this notice?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/teacher/announcements/delete/${id}`);
            fetchAnnouncements();
        } catch (error) { 
            console.error('Deletion error', error); 
            alert('Failed to delete assignment'); 
        }
    };

    const filteredList = announcements.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div style={styles.container}>
            <TeacherSidebar />
            <main style={styles.main}>                
                <div style={styles.content}>
                    
                    {/* --- LEFT PANEL: CREATE FORM --- */}
                    <div style={styles.createPanel}>
                        <h3 style={styles.panelTitle}>Create Announcement</h3>
                        <form onSubmit={handlePublish} style={{display: 'flex', flexDirection: 'column', gap: '20px', height: '100%'}}>
                            
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Course Reference (Optional)</label>
                                <select 
                                    style={styles.select}
                                    value={form.course_id}
                                    onChange={(e) => setForm({...form, course_id: e.target.value})}
                                >
                                    <option value="">Global (All Courses)</option>
                                    {courses.map(c => (
                                        <option key={c.course_id} value={c.course_id}>{c.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Target Grade</label>
                                <select 
                                    style={styles.select}
                                    value={form.grade}
                                    onChange={(e) => setForm({...form, grade: e.target.value})}
                                >
                                    <option>Grade 12</option>
                                    <option>Grade 13</option>
                                    <option>Revision</option>
                                    <option>All Grades</option>
                                </select>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Title</label>
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="Enter title..." 
                                    style={styles.input} 
                                    value={form.title}
                                    onChange={(e) => setForm({...form, title: e.target.value})} 
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Description</label>
                                <textarea 
                                    rows="5" 
                                    required 
                                    placeholder="Type your announcement here..." 
                                    style={styles.textarea} 
                                    value={form.message}
                                    onChange={(e) => setForm({...form, message: e.target.value})} 
                                />
                            </div>

                        
                            <button type="submit" style={styles.publishBtn}>Publish Announcement</button>
                        </form>
                    </div>

                    {/* --- RIGHT PANEL: FEED --- */}
                    <div style={styles.feedPanel}>
                        <div style={styles.feedHeader}>
                            <h2 style={styles.feedTitle}>Your Recent Posts</h2>
                            <div style={styles.searchBox}>
                                <FaSearch color="#9CA3AF" />
                                <input 
                                    placeholder="Search..." 
                                    style={styles.searchInput}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div style={styles.listContainer}>
                            {filteredList.length === 0 ? (
                                <p style={{color: '#9CA3AF', textAlign: 'center', marginTop: '40px'}}>No recent announcements found.</p>
                            ) : filteredList.map(item => {
                                const formattedDate = item.created_at ? new Date(item.created_at).toLocaleString() : new Date(item.posted_date).toLocaleDateString();
                                const hasCourse = !!item.course_title;
                                
                                return (
                                    <div key={item.announcement_id} style={styles.card}>
                                        <div style={styles.cardHeader}>
                                            <div style={{display: 'flex', gap: '8px'}}>
                                                {hasCourse ? (
                                                    <span style={{...styles.badge, backgroundColor: '#DBEAFE', color: '#2563EB'}}>{item.course_title}</span>
                                                ) : (
                                                    <span style={{...styles.badge, backgroundColor: '#F3F4F6', color: '#4B5563'}}>Global</span>
                                                )}
                                                {item.grade && (
                                                    <span style={{...styles.badge, backgroundColor: '#FEF3C7', color: '#D97706'}}>{item.grade}</span>
                                                )}
                                            </div>
                                            
                                            <div style={styles.actions}>
                                                <FaTrash style={{...styles.iconAction, color: '#EF4444'}} onClick={() => handleDelete(item.announcement_id)} />
                                            </div>
                                        </div>

                                        <h4 style={styles.cardTitle}>{item.title}</h4>
                                        <p style={styles.cardDesc}>{item.message}</p>

                                        <div style={styles.cardFooter}>
                                            <span>{formattedDate}</span>
                                        </div>
                                    </div>
                                );
                            })}
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
    content: { padding: '25px', display: 'flex', gap: '30px', height: '100vh', boxSizing: 'border-box' },

    // Left Panel (Form)
    createPanel: { width: '350px', background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' },
    panelTitle: { margin: 0, fontSize: '16px', color: '#111827' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '13px', fontWeight: '500', color: '#374151' },
    input: { padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' },
    textarea: { padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px', outline: 'none', resize: 'none', width: '100%', boxSizing: 'border-box' },
    select: { padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px', outline: 'none', backgroundColor: '#fff', width: '100%', boxSizing: 'border-box' },
    
    uploadBox: { border: '1px dashed #D1D5DB', borderRadius: '6px', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', backgroundColor: '#F9FAFB' },
    publishBtn: { backgroundColor: '#2563EB', color: '#fff', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', marginTop: 'auto' },

    // Right Panel (Feed)
    feedPanel: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    feedHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    feedTitle: { margin: 0, fontSize: '18px', color: '#111827' },
    
    searchBox: { display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '8px 15px', borderRadius: '8px', border: '1px solid #E5E7EB' },
    searchInput: { border: 'none', outline: 'none', marginLeft: '10px', fontSize: '13px' },

    listContainer: { overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', paddingRight: '10px', paddingBottom: '20px' },
    
    // Cards
    card: { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' },
    badge: { fontSize: 11, padding: '4px 10px', borderRadius: 12, fontWeight: '600' },
    actions: { display: 'flex', gap: '10px' },
    iconAction: { color: '#9CA3AF', cursor: 'pointer', fontSize: '14px' },
    
    cardTitle: { margin: '0 0 8px 0', fontSize: '16px', color: '#111827' },
    cardDesc: { margin: 0, fontSize: '14px', color: '#4B5563', lineHeight: '1.5', marginBottom: '15px', whiteSpace: 'pre-wrap' },
    
    cardFooter: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#9CA3AF', borderTop: '1px solid #F3F4F6', paddingTop: '15px' }
};

export default TeacherAnnouncements;