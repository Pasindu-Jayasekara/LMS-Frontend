import React, { useState } from 'react';
import { 
    FaSearch, FaPlus, FaUserGraduate, FaBookOpen, 
    FaClipboardList, FaChartBar, FaVideo 
} from 'react-icons/fa';
import TeacherSidebar from '../components/TeacherSidebar';
import Header from '../components/Header';

const TeacherCourses = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Updated Data: One Teacher (Mr. Saman) teaching only Math & Physics across grades
    const courses = [
        { id: 1, title: 'Advanced Mathematics', grade: '12th Grade', students: 32, progress: 65, color: '#2563EB' },
        { id: 2, title: 'Combined Mathematics', grade: '13th Grade', students: 28, progress: 42, color: '#2563EB' },
        { id: 3, title: 'Physics Mechanics', grade: '12th Grade', students: 30, progress: 78, color: '#16A34A' },
        { id: 4, title: 'General Mathematics', grade: '11th Grade', students: 35, progress: 90, color: '#2563EB' },
        { id: 5, title: 'Physics - Electronics', grade: '13th Grade', students: 25, progress: 30, color: '#16A34A' },
        { id: 6, title: 'Physics - Optics', grade: '11th Grade', students: 38, progress: 15, color: '#16A34A' },
    ];

    return (
        <div style={styles.container}>
            <TeacherSidebar />
            
            <main style={styles.main}>
                <Header title="My Courses" />
                
                <div style={styles.content}>
                    
                    {/* Action Bar */}
                    <div style={styles.actionBar}>
                        <div style={styles.searchBox}>
                            <FaSearch color="#6B7280" />
                            <input 
                                type="text" 
                                placeholder="Search your courses..." 
                                style={styles.searchInput}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button style={styles.createBtn}>
                            <FaPlus style={{marginRight: '8px'}} /> Create Course
                        </button>
                    </div>

                    {/* Courses Grid - Fits Screen Horizontally */}
                    <div style={styles.grid}>
                        {courses.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())).map(course => (
                            <div key={course.id} style={styles.card}>
                                
                                {/* Header with Grade Badge */}
                                <div style={styles.cardHeader}>
                                    <div style={{...styles.iconBox, backgroundColor: course.color}}>
                                        <FaBookOpen color="#fff" size={18} />
                                    </div>
                                    <span style={styles.gradeBadge}>{course.grade}</span>
                                </div>

                                {/* Body */}
                                <div style={styles.cardBody}>
                                    <h3 style={styles.courseTitle}>{course.title}</h3>
                                    
                                    <div style={styles.statsRow}>
                                        <div style={styles.statItem}>
                                            <FaUserGraduate size={12} color="#6B7280" />
                                            <span>{course.students} Students</span>
                                        </div>
                                        <div style={styles.statItem}>
                                            <FaChartBar size={12} color="#6B7280" />
                                            <span>{course.progress}% Complete</span>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div style={styles.progressBarBg}>
                                        <div style={{...styles.progressFill, width: `${course.progress}%`, backgroundColor: course.color}}></div>
                                    </div>

                                    {/* "Start Class" Button - Prominent */}
                                    <button style={styles.startClassBtn}>
                                        <FaVideo style={{marginRight: 8}} /> Start Live Class
                                    </button>
                                </div>

                                {/* Footer Links */}
                                <div style={styles.cardFooter}>
                                    <div style={styles.footerLink}><FaBookOpen/> Materials</div>
                                    <div style={styles.footerLink}><FaClipboardList/> Tasks</div>
                                    <div style={styles.footerLink}><FaChartBar/> Grades</div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </main>
        </div>
    );
};

const styles = {
    container: { display: 'flex', height: '100vh', backgroundColor: '#F9FAFB', fontFamily: "'Inter', sans-serif" },
    main: { marginLeft: '250px', flex: 1, display: 'flex', flexDirection: 'column' },
    content: { padding: '30px', overflowY: 'auto' },

    // Action Bar
    actionBar: { display: 'flex', justifyContent: 'space-between', marginBottom: '30px', gap: '20px' },
    searchBox: { display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '10px 15px', borderRadius: '8px', border: '1px solid #E5E7EB', width: '300px' },
    searchInput: { border: 'none', outline: 'none', marginLeft: '10px', width: '100%', fontSize: '14px' },
    createBtn: { backgroundColor: '#111827', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center' },

    // Responsive Grid (Auto-fit)
    grid: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', // Ensures cards stretch to fit screen
        gap: '25px' 
    },

    // Card
    card: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column' },
    
    cardHeader: { padding: '20px 20px 0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
    iconBox: { width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    gradeBadge: { fontSize: '12px', padding: '4px 10px', backgroundColor: '#F3F4F6', borderRadius: '20px', color: '#4B5563', fontWeight: '600', height: 'fit-content' },
    
    cardBody: { padding: '15px 20px 20px 20px', flex: 1 },
    courseTitle: { margin: '0 0 15px 0', fontSize: '18px', color: '#111827', fontWeight: '700' },
    
    statsRow: { display: 'flex', gap: '15px', marginBottom: '15px' },
    statItem: { fontSize: '13px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '6px' },

    progressBarBg: { height: '6px', backgroundColor: '#F3F4F6', borderRadius: '3px', overflow: 'hidden', marginBottom: '20px' },
    progressFill: { height: '100%', borderRadius: '3px' },

    // The Main Button
    startClassBtn: { width: '100%', backgroundColor: '#2563EB', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', transition: '0.2s' },

    // Footer
    cardFooter: { borderTop: '1px solid #F9FAFB', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', backgroundColor: '#FAFAFA' },
    footerLink: { fontSize: '12px', color: '#4B5563', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }
};

export default TeacherCourses;