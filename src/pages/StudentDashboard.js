import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaCalendarAlt, FaClock, FaVideo, FaBook, 
    FaExclamationCircle, FaBell,
} from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [student, setStudent] = useState({ name: 'Student', id: 'ST001' });
    const [notices, setNotices] = useState([]);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setStudent(JSON.parse(userData));
        }
    }, []);

    return (
        <div style={styles.container}>

            {/* 1. Wrap Sidebar in a div to control its layout */}
            <div style={styles.sidebarWrapper}>
                <Sidebar />
            </div>

            <main style={styles.main}>

                {/* Header stays at the top */}
                <div style={styles.headerWrapper}>
                    <Header title="Dashboard" />
                </div>

                {/* 2. The Content div handles the scrolling */}
                <div style={styles.content}>

                    {/* Welcome Section */}
                    <div style={styles.welcomeSection}>
                        <div>
                            <h1 style={styles.welcomeTitle}>Hello, {student.name}! 👋</h1>
                            <p style={styles.dateText}>Here is your schedule for today.</p>
                        </div>
                        <div style={styles.dateBadge}>
                            <FaCalendarAlt /> Oct 18, 2025
                        </div>
                    </div>

                    <div style={styles.gridContainer}>
                        
                        {/* --- LEFT COLUMN: CLASSES & ASSIGNMENTS --- */}
                        <div style={styles.leftColumn}>
                            
                            {/* 1. Today's Classes */}
                            <div style={styles.sectionHeader}>
                                <h3>Today's Classes</h3>
                            </div>

                            {/* Live Class Card */}
                            <div style={styles.liveCard}>
                                <div style={styles.cardContent}>
                                    <span style={styles.liveBadge}>🔴 LIVE NOW</span>
                                    <h3 style={styles.classTitle}>Advanced Mathematics</h3>
                                    <p style={styles.classDetail}><FaClock/> 10:00 AM - 11:30 AM</p>
                                    <p style={styles.classDetail}>Mr. Saman Kumara</p>
                                </div>
                                <button style={styles.joinBtn}>
                                    <FaVideo /> Join Class
                                </button>
                            </div>

                            {/* Next Class Card */}
                            <div style={styles.classCard}>
                                <div style={styles.cardContent}>
                                    <span style={styles.upcomingBadge}>Upcoming</span>
                                    <h3 style={styles.classTitle}>Physics Mechanics</h3>
                                    <p style={styles.classDetail}><FaClock/> 1:00 PM - 2:30 PM</p>
                                    <p style={styles.classDetail}>Mrs. Chamari Perera</p>
                                </div>
                                <div style={styles.timeBadge}>Starts in 2 hrs</div>
                            </div>

                            {/* 2. Due Assignments */}
                            <div style={styles.sectionHeader}>
                                <h3>Pending Assignments</h3>
                            </div>
                            <div style={styles.whiteCard}>
                                <AssignmentRow 
                                    subject="Mathematics" 
                                    task="Calculus Problem Set 3" 
                                    due="Due Tomorrow" 
                                    color="#2563eb"
                                />
                                <AssignmentRow 
                                    subject="Physics" 
                                    task="Lab Report: Kinetics" 
                                    due="Due Sep 20" 
                                    color="#d97706"
                                />
                                <AssignmentRow 
                                    subject="English" 
                                    task="Literature Essay" 
                                    due="Due Sep 22" 
                                    color="#059669"
                                />
                            </div>
                        </div>

                        {/* --- RIGHT COLUMN: NOTICES & PAYMENT --- */}
                        <div style={styles.rightColumn}>
                            
                            {/* Payment Alert */}
                            <div style={styles.paymentCard}>
                                <div style={{display:'flex', gap: 10}}>
                                    <FaExclamationCircle size={24} color="#b45309" />
                                    <div>
                                        <h4 style={{margin:0, color: '#92400e'}}>Payment Due</h4>
                                        <p style={{fontSize: 13, margin: '5px 0', color: '#b45309'}}>
                                            Your monthly fee of <strong>Rs. 15,000</strong> is due in 5 days.
                                        </p>
                                        <button style={styles.payLink}>Pay Now &rarr;</button>
                                    </div>
                                </div>
                            </div>

                            {/* Announcements */}
                            <div style={styles.whiteCard}>
                                <h3 style={styles.cardTitle}><FaBell color="#2563eb"/> Notices</h3>
                                
                                <div style={styles.noticeItem}>
                                    <strong>Exam Schedule Released</strong>
                                    <p style={styles.noticeText}>The mid-term timetable is now available for download.</p>
                                    <small style={styles.timeText}>2 hours ago</small>
                                </div>
                                <div style={styles.divider}></div>
                                <div style={styles.noticeItem}>
                                    <strong>Holiday Notice</strong>
                                    <p style={styles.noticeText}>No classes on Sep 15th due to Poya Day.</p>
                                    <small style={styles.timeText}>Yesterday</small>
                                </div>
                            </div>

                            {/* Quick Stats (Simplified) */}
                            <div style={styles.whiteCard}>
                                <h3 style={styles.cardTitle}>My Stats</h3>
                                <div style={styles.statRow}>
                                    <span>Attendance</span>
                                    <span style={{fontWeight:'bold', color:'#059669'}}>92%</span>
                                </div>
                                <div style={styles.statRow}>
                                    <span>Assignments</span>
                                    <span style={{fontWeight:'bold', color:'#2563eb'}}>12 Completed</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

// --- Sub-Components ---

const AssignmentRow = ({ subject, task, due, color }) => (
    <div style={styles.assignmentRow}>
        <div style={{...styles.subjectIcon, backgroundColor: color}}>
            <FaBook color="#fff" size={12}/>
        </div>
        <div style={{flex: 1}}>
            <div style={styles.taskTitle}>{task}</div>
            <div style={styles.taskSub}>{subject}</div>
        </div>
        <div style={styles.dueBadge}>{due}</div>
    </div>
);

// --- Styles ---

const styles = {

    // 1. Container locks the screen size
    container: { display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#F9FAFB', fontFamily: 'sans-serif', overflow: 'hidden' // Prevents body scrollbar
    },

    // 2. Sidebar Wrapper: Sits on the left, fixed width
    sidebarWrapper: { width: '250px', flexShrink: 0,height: '100%',overflowY: 'auto'},

    // 3. Main: Takes remaining space
    main: { flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' // Prevents main wrapper scroll
    },

    // 4. Header: Fixed height
    headerWrapper: { flexShrink: 0, // Don't shrink
    },

    // 5. Content: This is the ONLY part that scrolls
    content: { flex: 1, overflowY: 'auto', herepadding: '30px',boxSizing: 'border-box'},

    welcomeSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    welcomeTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827', margin: 0 },
    dateText: { color: '#6B7280', margin: '5px 0 0 0' },
    dateBadge: { backgroundColor: '#fff', padding: '8px 15px', borderRadius: 20, fontSize: 14, color: '#374151', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 8 },

    gridContainer: { display: 'flex', gap: 25 },
    leftColumn: { flex: 2, display: 'flex', flexDirection: 'column', gap: 20 },
    rightColumn: { flex: 1, display: 'flex', flexDirection: 'column', gap: 20 },

    sectionHeader: { marginBottom: 10, color: '#374151', fontSize: 16 },

    // Classes
    liveCard: { backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    classCard: { backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    
    cardContent: { display: 'flex', flexDirection: 'column', gap: 5 },
    classTitle: { margin: '5px 0', fontSize: 18, color: '#111827' },
    classDetail: { margin: 0, fontSize: 13, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 5 },
    
    liveBadge: { backgroundColor: '#DC2626', color: '#fff', fontSize: 10, fontWeight: 'bold', padding: '2px 8px', borderRadius: 4, width: 'fit-content' },
    upcomingBadge: { backgroundColor: '#DBEAFE', color: '#1E40AF', fontSize: 10, fontWeight: 'bold', padding: '2px 8px', borderRadius: 4, width: 'fit-content' },
    
    joinBtn: { backgroundColor: '#DC2626', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: 8 },
    timeBadge: { fontSize: 12, color: '#2563eb', fontWeight: 'bold' },

    // Assignments
    whiteCard: { backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 20 },
    assignmentRow: { display: 'flex', alignItems: 'center', gap: 15, padding: '12px 0', borderBottom: '1px solid #F3F4F6' },
    subjectIcon: { width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    taskTitle: { fontSize: 14, fontWeight: '600', color: '#374151' },
    taskSub: { fontSize: 12, color: '#9CA3AF' },
    dueBadge: { fontSize: 11, backgroundColor: '#F3F4F6', padding: '4px 8px', borderRadius: 4, color: '#6B7280' },

    // Right Column
    paymentCard: { backgroundColor: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 12, padding: 20 },
    payLink: { background: 'none', border: 'none', color: '#B45309', fontWeight: 'bold', cursor: 'pointer', padding: 0, marginTop: 5, fontSize: 13 },
    
    cardTitle: { fontSize: 16, fontWeight: 'bold', margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: 8 },
    noticeItem: { marginBottom: 10 },
    noticeText: { fontSize: 13, color: '#4B5563', margin: '4px 0' },
    timeText: { fontSize: 11, color: '#9CA3AF' },
    divider: { height: 1, backgroundColor: '#F3F4F6', margin: '15px 0' },

    statRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F9FAFB', fontSize: 14, color: '#374151' }
};

export default StudentDashboard;