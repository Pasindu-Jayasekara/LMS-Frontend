import React, { useState, useEffect } from 'react';
import axios from 'axios'; // <-- Added this import
import { useNavigate } from 'react-router-dom';
import { 
    FaCalendarAlt, FaClock, FaVideo, FaBook, 
    FaExclamationCircle, FaBell, FaRobot
} from 'react-icons/fa';
import Sidebar from '../components/Sidebar';


const StudentDashboard = () => {
    const navigate = useNavigate();
    const [student, setStudent] = useState({ name: 'Student', id: 'ST001' });
    const [notices, setNotices] = useState([]);
    const [classes, setClasses] = useState([]);
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        const userData = sessionStorage.getItem('user');
        if (userData) {
            setStudent(JSON.parse(userData));
        }
        // 2. Fetch the Real Announcements
        const fetchNotices = async () => {
            try {
                // Make sure this URL matches your server route
                const response = await axios.get('http://localhost:5000/api/announcements');
                setNotices(response.data);
            } catch (error) {
                console.error("Error fetching notices:", error);
            }
        };

        const fetchClasses = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/dashboard/student/classes');
                setClasses(response.data);
            } catch (error) { console.error(error); }
        };

        const fetchAssignments = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/dashboard/student/assignments');
                setAssignments(response.data);
            } catch (error) { console.error(error); }
        };

        fetchNotices();
        fetchClasses();
        fetchAssignments();
    }, []);

    // Helper to format MySQL time (e.g., "10:00:00" to "10:00 AM")
    const formatTime = (timeString) => {
        const [hour, minute] = timeString.split(':');
        const h = parseInt(hour);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const formattedHour = h % 12 || 12;
        return `${formattedHour}:${minute} ${ampm}`;
    };

    // Helper to format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const todayDate = new Date();
    const formattedToday = todayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    const todayDateStr = todayDate.toDateString();
    
    // Filter classes for Today and Upcoming
    const todayClasses = classes.filter(c => c.session_date && new Date(c.session_date).toDateString() === todayDateStr);
    const upcomingClasses = classes.filter(c => c.session_date && new Date(c.session_date).toDateString() !== todayDateStr);


    return (
        <div style={styles.container}>

            {/* 1. Wrap Sidebar in a div to control its layout */}
            <div style={styles.sidebarWrapper}>
                <Sidebar />
            </div>

            <main style={styles.main}>

                {/* Header stays at the top */}
                <div style={styles.headerWrapper}>
                    
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
                            <FaCalendarAlt /> {formattedToday}
                        </div>
                    </div>

                    <div style={styles.gridContainer}>
                        
                        {/* --- LEFT COLUMN: CLASSES & ASSIGNMENTS --- */}
                        <div style={styles.leftColumn}>
                            
                            {/* 1. Today's Classes */}
                            <div style={styles.sectionHeader}>
                                <h3>Today's Classes</h3>
                            </div>

                            {todayClasses.length === 0 ? (
                                <p style={{fontSize: 14, color: '#666'}}>No classes scheduled for today.</p>
                            ) : (
                                todayClasses.map((cls, index) => (
                                    <div key={cls.session_id} style={styles.liveCard}>
                                        <div style={styles.cardContent}>
                                            <span style={styles.liveBadge}>🔴 TODAY</span>
                                            <h3 style={styles.classTitle}><strong>{cls.course_title}</strong></h3>
                                            {cls.grade && <span style={styles.gradeBadge}>{cls.grade}</span>}
                                            <p style={styles.classDetail}><FaClock/> {formatTime(cls.session_time)} • {cls.venue}</p>
                                            <p style={styles.classDetail}>{cls.first_name} {cls.last_name}</p>
                                        </div>
                                        { (cls.class_type === 'Online' || cls.link_or_venue?.includes('http') || cls.meeting_link) ? (
                                            <button 
                                                style={styles.joinBtnBlue}
                                                onClick={() => window.open(cls.meeting_link || cls.link_or_venue, '_blank')}
                                            >
                                                <FaVideo /> Join Class
                                            </button>
                                        ) : (
                                            <div style={styles.timeBadge}>Starting Later</div>
                                        )}
                                    </div>
                                ))
                            )}

                            {/* 1.5. Upcoming Classes */}
                            <div style={{...styles.sectionHeader, marginTop: 20}}>
                                <h3>Upcoming Classes</h3>
                            </div>

                            {upcomingClasses.length === 0 ? (
                                <p style={{fontSize: 14, color: '#666'}}>No upcoming classes.</p>
                            ) : (
                                upcomingClasses.map((cls, index) => (
                                    <div key={cls.session_id} style={styles.classCard}>
                                        <div style={styles.cardContent}>
                                            <span style={styles.upcomingBadge}>Upcoming</span>
                                            <h3 style={styles.classTitle}><strong>{cls.course_title}</strong></h3>
                                            {cls.grade && <span style={styles.gradeBadge}>{cls.grade}</span>}
                                            <p style={styles.classDetail}><FaClock/> {formatDate(cls.session_date)} at {formatTime(cls.session_time)} • {cls.venue}</p>
                                            <p style={styles.classDetail}>{cls.first_name} {cls.last_name}</p>
                                        </div>
                                        { (cls.class_type === 'Online' || cls.link_or_venue?.includes('http') || cls.meeting_link) ? (
                                            <button 
                                                style={styles.joinBtnBlue}
                                                onClick={() => window.open(cls.meeting_link || cls.link_or_venue, '_blank')}
                                            >
                                                <FaVideo /> Join Class
                                            </button>
                                        ) : (
                                            <div style={styles.timeBadge}>Starting Later</div>
                                        )}
                                    </div>
                                ))
                            )}

                            {/* 2. Due Assignments */}
                            <div style={styles.sectionHeader}>
                                <h3>Pending Assignments</h3>
                            </div>
                            <div style={styles.whiteCard}>
                                {assignments.length === 0 ? (
                                    <p style={{fontSize: 14, color: '#666'}}>No pending assignments.</p>
                                ) : (
                                    assignments.map((asn, index) => {
                                        // Alternating colors for the icons
                                        const colors = ['#2563eb', '#d97706', '#059669']; 
                                        return (
                                            <AssignmentRow 
                                                key={asn.assignment_id}
                                                subject={asn.course_title} 
                                                task={asn.task_title} 
                                                due={`Due ${formatDate(asn.due_date)}`} 
                                                color={colors[index % colors.length]}
                                            />
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* --- RIGHT COLUMN: NOTICES & AI --- */}
                        <div style={styles.rightColumn}>
                            
                            {/* Study with AI Card */}
                            <div style={styles.aiCard}>
                                <div style={{display:'flex', gap: 15, alignItems: 'center'}}>
                                    <div style={styles.aiIconWrapper}>
                                        <FaRobot size={28} color="#fff" />
                                    </div>
                                    <div style={{flex: 1}}>
                                        <h3 style={{margin:0, color: '#fff', fontSize: 18}}>Study with AI</h3>
                                        <p style={{fontSize: 13, margin: '5px 0', color: '#E0E7FF'}}>
                                            Stuck on a topic? Get instant help from your AI assistant.
                                        </p>
                                        <button 
                                            style={styles.aiBtn}
                                            onClick={() => navigate('/student/ai-assistant')}
                                        >
                                            Start Learning &rarr;
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Announcements */}
                            <div style={styles.whiteCard}>
                                <h3 style={styles.cardTitle}><FaBell color="#2563eb"/> Notices</h3>
                                
                                {notices.length === 0 ? (
                                    <p style={{fontSize:13, color:'#999'}}>No new announcements.</p>
                                ) : (
                                    notices.map((notice, index) => (
                                        <div key={notice.announcement_id}>
                                            <div style={styles.noticeItem}>
                                                <strong>{notice.title}</strong>
                                                <p style={styles.noticeText}>{notice.message}</p>
                                                <small style={styles.timeText}>{notice.date}</small>
                                            </div>
                                            {/* Divider line between items */}
                                            {index < notices.length - 1 && <div style={styles.divider}></div>}
                                        </div>
                                    ))
                                )}
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
    // Fixed typo: "herepadding" to "padding"
    content: { flex: 1, overflowY: 'auto', padding: '30px',boxSizing: 'border-box'},

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
    gradeBadge: { backgroundColor: '#F3F4F6', color: '#4B5563', fontSize: 11, fontWeight: '600', padding: '4px 10px', borderRadius: 12, width: 'fit-content', marginBottom: '8px' },
    
    joinBtn: { backgroundColor: '#DC2626', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: 8 },
    timeBadge: { fontSize: 12, color: '#2563eb', fontWeight: 'bold' },

    // Assignments
    whiteCard: { backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 20 },
    assignmentRow: { display: 'flex', alignItems: 'center', gap: 15, padding: '12px 0', borderBottom: '1px solid #F3F4F6' },
    subjectIcon: { width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    taskTitle: { fontSize: 14, fontWeight: '600', color: '#374151' },
    taskSub: { fontSize: 12, color: '#9CA3AF' },
    dueBadge: { fontSize: 11, backgroundColor: '#F3F4F6', padding: '4px 8px', borderRadius: 4, color: '#6B7280' },

    // Right Column & AI Card
    aiCard: { backgroundColor: '#4F46E5', background: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)', borderRadius: 12, padding: 20, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
    aiIconWrapper: { backgroundColor: 'rgba(255, 255, 255, 0.2)', width: 50, height: 50, borderRadius: 12, display: 'flex', justifyContent: 'center', alignItems: 'center' },
    aiBtn: { backgroundColor: '#fff', color: '#4338CA', border: 'none', padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold', marginTop: 10, fontSize: 13, display: 'inline-block' },
    joinBtnBlue: { backgroundColor: '#2563EB', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: 8 },
    
    cardTitle: { fontSize: 16, fontWeight: 'bold', margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: 8 },
    noticeItem: { marginBottom: 10 },
    noticeText: { fontSize: 13, color: '#4B5563', margin: '4px 0' },
    timeText: { fontSize: 11, color: '#9CA3AF' },
    divider: { height: 1, backgroundColor: '#F3F4F6', margin: '15px 0' },

    statRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F9FAFB', fontSize: 14, color: '#374151' }
};

export default StudentDashboard;