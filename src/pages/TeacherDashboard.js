import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    FaPlay, FaCalendarAlt, FaClock, FaUserGraduate,
    FaChartLine, FaCheckCircle, FaFileAlt, FaBullhorn, FaUsers,
    FaVideo, FaMapMarkerAlt, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import TeacherSidebar from '../components/TeacherSidebar'; // Using the new Teacher Sidebar

// Hardcoded teacher ID — replace with sessionStorage/auth once login is integrated
const TEACHER_ID = 'T2701';

// Helper: generate the dynamic mini-calendar grid for the current month
const buildCalendarData = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { year, month, firstDay, daysInMonth };
};

const TeacherDashboard = () => {
    const navigate = useNavigate();

    const [teacherName, setTeacherName] = useState('');
    const [upcomingClasses, setUpcomingClasses] = useState([]);
    const [activeCourseCount, setActiveCourseCount] = useState(0);
    const [dashboardAssignments, setDashboardAssignments] = useState([]);

    // Mini-calendar state — tracks current visible month
    const [calDate, setCalDate] = useState(new Date());

    // ─── Fetch dashboard stats on mount ──────────────────────────────────────
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/teacher-courses/dashboard-stats/${TEACHER_ID}`
                );
                setTeacherName(res.data.teacherName);
                setUpcomingClasses(res.data.upcomingClasses);
            } catch (err) {
                console.error("Failed to load dashboard stats:", err);
            }
        };

        const fetchCourseCount = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/teacher-courses/my-courses/${TEACHER_ID}`
                );
                setActiveCourseCount(res.data.length);
            } catch (err) {
                console.error("Failed to load course count:", err);
            }
        };

        // Fetch latest assignments for the dashboard table
        const fetchDashboardAssignments = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/teacher-courses/dashboard-assignments/${TEACHER_ID}`
                );
                setDashboardAssignments(res.data);
            } catch (err) {
                console.error("Failed to load dashboard assignments:", err);
            }
        };

        fetchStats();
        fetchCourseCount();
        fetchDashboardAssignments();
    }, []);

    // ─── Mini-calendar helpers ────────────────────────────────────────────────
    const { year, month, firstDay, daysInMonth } = buildCalendarData(calDate);
    const monthName = calDate.toLocaleString('default', { month: 'long' });
    const today = new Date();

    // Dates that have upcoming classes (for dot indicators on the mini-calendar)
    const scheduledDays = new Set(
        upcomingClasses.map(cls => {
            const d = new Date(cls.session_date);
            return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        })
    );

    const renderMiniCalendar = () => {
        const cells = [];
        // Empty leading cells (Sunday-anchored)
        for (let i = 0; i < firstDay; i++) cells.push(<span key={`e-${i}`}></span>);
        for (let d = 1; d <= daysInMonth; d++) {
            const key = `${year}-${month}-${d}`;
            const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const hasClass = scheduledDays.has(key);
            cells.push(
                <span key={d} style={isToday ? styles.activeDate : styles.calDay}>
                    {d}
                    {hasClass && <span style={styles.dot}></span>}
                </span>
            );
        }
        return cells;
    };

    // ─── Format date nicely for class cards ──────────────────────────────────
    const formatDate = (isoDate) => {
        if (!isoDate) return '';
        return new Date(isoDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    };

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        const [h, m] = timeStr.split(':');
        const hour = parseInt(h);
        return `${hour % 12 || 12}:${m} ${hour < 12 ? 'AM' : 'PM'}`;
    };

    const todayDateStr = new Date().toDateString();
    const todayClasses = upcomingClasses.filter(c => new Date(c.session_date).toDateString() === todayDateStr);
    const futureClasses = upcomingClasses.filter(c => new Date(c.session_date).toDateString() !== todayDateStr);

    return (
        <div style={styles.container}>
            <TeacherSidebar />
            <main style={styles.main}>


                <div style={styles.content}>
                    {/* Welcome Section */}
                    <div style={styles.welcomeSection}>
                        <h1 style={styles.welcomeTitle}>
                            Welcome, {teacherName || 'Instructor'}!
                        </h1>
                        {/* Create Announcement button — navigates to /teacher-announcements */}
                        <button style={styles.createBtn} onClick={() => navigate('/teacher-announcements')}>
                            <FaBullhorn style={{ marginRight: 8 }} /> Create Announcement
                        </button>
                    </div>

                    <div style={styles.dashboardGrid}>
                        {/* --- LEFT COLUMN (Main Stats) --- */}
                        <div style={styles.leftColumn}>

                            {/* Today's Classes Section */}
                            <div style={styles.sectionHeader}>
                                <h3 style={styles.sectionTitle}>Today's Classes</h3>
                            </div>

                            {/* Dynamic Today's Class Cards */}
                            {todayClasses.length === 0 ? (
                                <div style={{ ...styles.classCardSimple, justifyContent: 'center', color: '#9CA3AF' }}>
                                    No classes scheduled for today.
                                </div>
                            ) : todayClasses.map((cls, idx) => {
                                const isOnline = cls.class_type === 'Online';
                                const isFirst = idx === 0;

                                return (
                                    <div key={cls.session_id} style={isFirst ? styles.classCard : styles.classCardSimple}>
                                        <div>
                                            <h4 style={styles.classTitle}>{cls.topic || cls.course_title}</h4>
                                            <div style={styles.classMeta}>
                                                <span style={{ marginRight: 12, color: '#6366F1', fontWeight: 600 }}>{cls.course_title}</span>
                                                <span><FaClock size={11} /> {formatTime(cls.session_time)}</span>
                                                {cls.grade && <span style={{ marginLeft: 12 }}>{cls.grade}</span>}
                                            </div>
                                            <div style={{ ...styles.classMeta, marginTop: 6 }}>
                                                {isOnline ? (
                                                    <span style={{ color: '#2563EB' }}><FaVideo size={11} /> Online</span>
                                                ) : (
                                                    <span style={{ color: '#047857' }}><FaMapMarkerAlt size={11} /> {cls.venue || 'Physical'}</span>
                                                )}
                                            </div>
                                        </div>

                                        {isOnline ? (
                                            <button 
                                                style={styles.startClassBtn}
                                                onClick={() => window.open(cls.meeting_link, '_blank')}
                                            >
                                                <FaVideo style={{marginRight: '5px'}}/> Start Class
                                            </button>
                                        ) : (
                                            <div style={styles.startsIn}>
                                                <FaMapMarkerAlt size={12} style={{ marginRight: 5 }} />
                                                {cls.venue || cls.grade}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Upcoming Classes Section */}
                            <div style={{...styles.sectionHeader, marginTop: 20}}>
                                <h3 style={styles.sectionTitle}>Upcoming Classes</h3>
                            </div>

                            {/* Dynamic Upcoming Class Cards */}
                            {futureClasses.length === 0 ? (
                                <div style={{ ...styles.classCardSimple, justifyContent: 'center', color: '#9CA3AF' }}>
                                    No upcoming classes scheduled.
                                </div>
                            ) : futureClasses.map((cls, idx) => {
                                const isOnline = cls.class_type === 'Online';

                                return (
                                    <div key={cls.session_id} style={styles.classCardSimple}>
                                        <div>
                                            <h4 style={styles.classTitle}>{cls.topic || cls.course_title}</h4>
                                            <div style={styles.classMeta}>
                                                <span style={{ marginRight: 12, color: '#6366F1', fontWeight: 600 }}>{cls.course_title}</span>
                                                <span><FaClock size={11} /> {formatTime(cls.session_time)}</span>
                                                <span style={{ marginLeft: 12 }}>
                                                    <FaCalendarAlt size={11} /> {formatDate(cls.session_date)}
                                                </span>
                                            </div>
                                            <div style={{ ...styles.classMeta, marginTop: 6 }}>
                                                {isOnline ? (
                                                    <span style={{ color: '#2563EB' }}><FaVideo size={11} /> Online</span>
                                                ) : (
                                                    <span style={{ color: '#047857' }}><FaMapMarkerAlt size={11} /> {cls.venue || 'Physical'}</span>
                                                )}
                                            </div>
                                        </div>

                                        {isOnline ? (
                                            <button 
                                                style={styles.startClassBtn}
                                                onClick={() => window.open(cls.meeting_link, '_blank')}
                                            >
                                                <FaVideo style={{marginRight: '5px'}}/> Start Class
                                            </button>
                                        ) : (
                                            <div style={styles.startsIn}>
                                                <FaMapMarkerAlt size={12} style={{ marginRight: 5 }} />
                                                {cls.venue || cls.grade}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Class Performance Stats */}
                            <h3 style={{ ...styles.sectionTitle, marginTop: 10 }}>Class Performance</h3>
                            <div style={styles.statsRow}>
                                <StatCard
                                    icon={<FaUserGraduate size={20} color="#4F46E5" />}
                                    label="Active Courses"
                                    value={activeCourseCount}
                                    color="#4F46E5"
                                    bgColor="#EEF2FF"
                                    borderColor="#4F46E5"
                                />
                                <StatCard
                                    icon={<FaCalendarAlt size={20} color="#D97706" />}
                                    label="Upcoming Classes"
                                    value={upcomingClasses.length}
                                    color="#D97706"
                                    bgColor="#FFFBEB"
                                    borderColor="#D97706"
                                />
                            </div>

                            {/* Pending Assignments Table */}
                            <div style={styles.sectionHeader}>
                                <h3 style={styles.sectionTitle}>Pending Assignments to Grade</h3>
                                <span style={styles.linkText} onClick={() => navigate('/teacher-assignments')}>
                                    View all &rarr;
                                </span>
                            </div>
                            <div style={styles.tableCard}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr style={styles.headerRow}>
                                            <th style={styles.th}>Assignment</th>
                                            <th style={styles.th}>Subject</th>
                                            <th style={styles.th}>Submissions</th>
                                            <th style={{ ...styles.th, textAlign: 'right' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboardAssignments.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" style={{ ...styles.td, textAlign: 'center', color: '#9CA3AF', padding: '20px' }}>
                                                    No assignments found.
                                                </td>
                                            </tr>
                                        ) : dashboardAssignments.map(a => (
                                            <tr key={a.assignment_id} style={styles.row}>
                                                <td style={styles.tdTitle}>{a.title}</td>
                                                <td style={styles.td}>{a.subject}</td>
                                                <td style={styles.td}>{a.submitted} / {a.total}</td>
                                                <td style={{ ...styles.td, textAlign: 'right' }}>
                                                    <button style={styles.gradeBtn} onClick={() => navigate('/teacher-assignments')}>
                                                        <FaChartLine /> Grade
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        </div>

                        {/* --- RIGHT COLUMN (Widgets) --- */}
                        <div style={styles.rightColumn}>

                            {/* Quick Actions */}
                            <div style={styles.card}>
                                <h3 style={styles.widgetTitle}>Quick Actions</h3>
                                <div style={styles.actionList}>
                                    <div style={styles.actionItem} onClick={() => navigate('/teacher-assignments')}>
                                        <FaFileAlt color="#2563EB" /> View Assignments
                                    </div>
                                    <div style={styles.actionItem} onClick={() => navigate('/teacher-schedule')}>
                                        <FaCalendarAlt color="#2563EB" /> View Schedule
                                    </div>
                                    <div style={styles.actionItem} onClick={() => navigate('/teacher-courses')}>
                                        <FaUsers color="#2563EB" /> My Courses
                                    </div>
                                </div>
                            </div>

                            {/* Mini Calendar — dynamic, current month with class dots */}
                            <div style={styles.card}>
                                <div style={styles.calHeaderRow}>
                                    <button style={styles.calNavBtn} onClick={() => setCalDate(new Date(year, month - 1, 1))}>
                                        <FaChevronLeft size={11} />
                                    </button>
                                    <h3 style={styles.widgetTitle}>{monthName} {year}</h3>
                                    <button style={styles.calNavBtn} onClick={() => setCalDate(new Date(year, month + 1, 1))}>
                                        <FaChevronRight size={11} />
                                    </button>
                                </div>
                                <div style={styles.miniCalendar}>
                                    {/* Day headers */}
                                    <div style={styles.calRow}>
                                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                            <span key={d} style={styles.calHeader}>{d}</span>
                                        ))}
                                    </div>
                                    {/* Day cells */}
                                    <div style={styles.calRow}>
                                        {renderMiniCalendar()}
                                    </div>
                                </div>
                                {upcomingClasses.length > 0 && (
                                    <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '8px', textAlign: 'center' }}>
                                        🔵 = scheduled class
                                    </p>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

// --- Helper Components ---
const StatCard = ({ icon, label, value, color, bgColor, borderColor }) => (
    <div style={{ ...styles.statCard, borderLeft: `4px solid ${borderColor}` }}>
        <div style={{ ...styles.iconBox, backgroundColor: bgColor }}>{icon}</div>
        <div>
            <div style={styles.statLabel}>{label}</div>
            <div style={{ ...styles.statValue, color: color }}>{value}</div>
        </div>
    </div>
);

const styles = {
    container: { display: 'flex', height: '100vh', backgroundColor: '#F9FAFB', fontFamily: "'Inter', sans-serif" },
    main: { marginLeft: '250px', flex: 1, display: 'flex', flexDirection: 'column' },
    content: { padding: '30px', overflowY: 'auto' },

    // Welcome Section
    welcomeSection: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    welcomeTitle: { fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 },
    createBtn: { backgroundColor: '#1D4ED8', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: '600' },

    dashboardGrid: { display: 'flex', gap: '25px' },
    leftColumn: { flex: 3, display: 'flex', flexDirection: 'column', gap: '20px' },
    rightColumn: { flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' },

    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
    sectionTitle: { fontSize: '16px', fontWeight: 'bold', color: '#374151', margin: 0 },
    linkText: { fontSize: '13px', color: '#2563EB', cursor: 'pointer' },

    // Class Cards
    classCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
    classCardSimple: { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    classTitle: { margin: '0 0 5px 0', fontSize: '16px', color: '#111827' },
    classMeta: { fontSize: '13px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' },
    startClassBtn: { backgroundColor: '#2563EB', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' },
    startsIn: { fontSize: '13px', color: '#6B7280', display: 'flex', alignItems: 'center' },

    // Stats
    statsRow: { display: 'flex', gap: '20px', marginBottom: '10px' },
    statCard: { flex: 1, backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' },
    iconBox: { width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    statLabel: { fontSize: '12px', color: '#6B7280', fontWeight: '600' },
    statValue: { fontSize: '20px', fontWeight: 'bold' },

    // Table
    tableCard: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse' },
    headerRow: { backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' },
    th: { textAlign: 'left', padding: '15px 20px', fontSize: '12px', color: '#6B7280', fontWeight: '600', textTransform: 'uppercase' },
    row: { borderBottom: '1px solid #F9FAFB' },
    td: { padding: '15px 20px', fontSize: '14px', color: '#374151' },
    tdTitle: { padding: '15px 20px', fontSize: '14px', fontWeight: '600', color: '#111827' },
    gradeBtn: { background: 'none', border: 'none', color: '#2563EB', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' },

    // Right Widgets
    card: { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB' },
    widgetTitle: { fontSize: '15px', fontWeight: 'bold', margin: '0 0 15px 0', color: '#374151' },

    actionList: { display: 'flex', flexDirection: 'column', gap: '15px' },
    actionItem: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#2563EB', cursor: 'pointer', fontWeight: '500' },

    // Mini Calendar
    calHeaderRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
    calNavBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: '4px', borderRadius: '4px' },
    miniCalendar: {},
    calRow: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '6px', textAlign: 'center' },
    calHeader: { fontSize: '11px', color: '#9CA3AF', fontWeight: '600' },
    calDay: { fontSize: '12px', color: '#374151', position: 'relative', padding: '3px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    activeDate: { fontSize: '12px', backgroundColor: '#DBEAFE', color: '#1E40AF', borderRadius: '50%', width: '22px', height: '22px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
    dot: { width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#2563EB', display: 'block', margin: '1px auto 0' },
};

export default TeacherDashboard;