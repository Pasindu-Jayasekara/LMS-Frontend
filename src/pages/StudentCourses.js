import React, { useState } from 'react';
import { FaBook, FaUserTie, FaArrowRight, FaFilter, FaSearch } from 'react-icons/fa';
import Sidebar from '../components/Sidebar'; // Import the reusable Sidebar
import Header from '../components/Header';   // Import the reusable Header

const StudentCourses = () => {
    const [searchTerm, setSearchTerm] = useState('');

    // Dummy Data for Courses
    const courses = [
        { id: 1, title: 'Advanced Mathematics', teacher: 'Mr. Saman Kumara', progress: 78, color: '#BDDDFC' },
        { id: 2, title: 'Physics Mechanics', teacher: 'Mrs. Chamari Perera', progress: 65, color: '#88BDF2' },
        { id: 3, title: 'Organic Chemistry', teacher: 'Dr. Nimal Silva', progress: 92, color: '#6A89A7' },
        { id: 4, title: 'English Literature', teacher: 'Ms. Amali Fernando', progress: 45, color: '#BDDDFC' },
        { id: 5, title: 'Information Tech', teacher: 'Mr. Kasun Perera', progress: 10, color: '#88BDF2' },
        { id: 6, title: 'Biology - Genetics', teacher: 'Dr. H. Bandara', progress: 30, color: '#6A89A7' },
    ];

    return (
        <div style={styles.container}>
            {/* 1. Reusable Sidebar */}
            <Sidebar />

            {/* 2. Main Content Wrapper */}
            <main style={styles.main}>
                
                {/* 3. Reusable Header */}
                <Header />

                {/* 4. Page Specific Content */}
                <div style={styles.content}>
                    
                    {/* Page Title & Local Filter */}
                    <div style={styles.pageHeader}>
                        <h1 style={styles.title}>My Enrolled Courses</h1>
                        
                        <div style={styles.filterBox}>
                            <FaSearch color="#6A89A7" />
                            <input 
                                type="text" 
                                placeholder="Filter your courses..." 
                                style={styles.filterInput}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button style={styles.filterBtn}><FaFilter /> Filter</button>
                        </div>
                    </div>

                    {/* Course Grid */}
                    <div style={styles.grid}>
                        {courses.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())).map(course => (
                            <div key={course.id} style={styles.card}>
                                {/* Course Color Block (Image Placeholder) */}
                                <div style={{...styles.cardHeader, backgroundColor: course.color}}>
                                    <FaBook size={40} color="#384959" opacity={0.8} />
                                </div>
                                
                                <div style={styles.cardBody}>
                                    <h3 style={styles.courseTitle}>{course.title}</h3>
                                    
                                    <div style={styles.teacherRow}>
                                        <div style={styles.avatar}><FaUserTie /></div>
                                        <span style={styles.teacherName}>{course.teacher}</span>
                                    </div>

                                    {/* Progress Bar */}
                                    <div style={styles.progressContainer}>
                                        <div style={styles.progressInfo}>
                                            <span>Completed</span>
                                            <strong>{course.progress}%</strong>
                                        </div>
                                        <div style={styles.track}>
                                            <div style={{...styles.fill, width: `${course.progress}%`}}></div>
                                        </div>
                                    </div>

                                    <button style={styles.actionBtn}>
                                        Continue <FaArrowRight />
                                    </button>
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
    // Layout
    container: { display: 'flex', height: '100vh', backgroundColor: '#f3f4f6', fontFamily: "'Inter', sans-serif" },
    main: { marginLeft: '250px', flex: 1, display: 'flex', flexDirection: 'column' },
    content: { padding: '30px', overflowY: 'auto' },

    // Page Specific Headers
    pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    title: { fontSize: '24px', color: '#1f2937', margin: 0, fontWeight: 'bold' },
    
    // Local Filter Bar
    filterBox: { display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '10px 15px', borderRadius: '8px', border: '1px solid #e5e7eb' },
    filterInput: { border: 'none', outline: 'none', marginLeft: '10px', fontSize: '14px', width: '200px' },
    filterBtn: { marginLeft: '10px', display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#384959', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },

    // Grid System
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' },

    // Course Card
    card: { backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', transition: '0.3s' },
    cardHeader: { height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    cardBody: { padding: '20px' },
    
    courseTitle: { margin: '0 0 10px 0', color: '#1f2937', fontSize: '16px', fontWeight: 'bold' },
    
    teacherRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' },
    avatar: { width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: '12px' },
    teacherName: { fontSize: '13px', color: '#6b7280' },

    progressContainer: { marginBottom: '20px' },
    progressInfo: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', color: '#6b7280' },
    track: { width: '100%', height: '6px', backgroundColor: '#f3f4f6', borderRadius: '3px' },
    fill: { height: '100%', backgroundColor: '#2563eb', borderRadius: '3px' }, // Using your blue brand color

    actionBtn: { width: '100%', padding: '10px', backgroundColor: '#1f2937', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px' }
};

export default StudentCourses;