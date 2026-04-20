import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChevronLeft, FaChevronRight, FaClock, FaVideo, FaMapMarkerAlt } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';

// Student ID from sessionStorage — set during login
// (read inside component to always reflect current session)

const StudentCalendar = () => {
    // Read on every render so stale module-level values can't bleed through
    const STUDENT_ID = sessionStorage.getItem('userId');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [sessions, setSessions] = useState([]);
    const [studentGrade, setStudentGrade] = useState('');

    // ─── Fetch class sessions for active enrolled courses ─────────────────────
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/student/classes/${STUDENT_ID}`
                );
                setSessions(res.data.sessions || []);
                setStudentGrade(res.data.studentGrade || '');
            } catch (err) {
                console.error('Error fetching student classes:', err);
            }
        };
        fetchClasses();
    }, []);

    // ─── Calendar helpers ─────────────────────────────────────────────────────
    const getDaysInMonth = (date) =>
        new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    const getFirstDayOfMonth = (date) =>
        new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    // Map session dates to day numbers for the current month
    const sessionsByDay = {};
    sessions.forEach(s => {
        const d = new Date(s.session_date);
        if (d.getFullYear() === currentDate.getFullYear() && d.getMonth() === currentDate.getMonth()) {
            const day = d.getDate();
            if (!sessionsByDay[day]) sessionsByDay[day] = [];
            sessionsByDay[day].push(s);
        }
    });

    const formatTime = (timeStr) => {
        if (!timeStr) return '';
        const [h, m] = timeStr.split(':');
        const hour = parseInt(h);
        return `${hour % 12 || 12}:${m} ${hour < 12 ? 'AM' : 'PM'}`;
    };

    const today = new Date();

    const renderCalendarDays = () => {
        const slots = [];
        // Empty leading slots
        for (let i = 0; i < firstDay; i++) {
            slots.push(<div key={`e-${i}`} style={styles.emptySlot} />);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday =
                day === today.getDate() &&
                currentDate.getMonth() === today.getMonth() &&
                currentDate.getFullYear() === today.getFullYear();

            const dayEvents = sessionsByDay[day] || [];

            slots.push(
                <div key={day} style={{ ...styles.dayCell, ...(isToday ? styles.todayCell : {}) }}>
                    <span style={isToday ? styles.todayNumber : styles.dayNumber}>{day}</span>
                    <div style={styles.eventContainer}>
                        {dayEvents.map(s => (
                            <div key={s.session_id} style={styles.eventPill}>
                                {s.topic || s.course_title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return slots;
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    // Upcoming = sessions from today onward, sorted, take first 5
    const upcomingSessions = sessions
        .filter(s => new Date(s.session_date) >= new Date(today.toDateString()))
        .sort((a, b) => new Date(a.session_date) - new Date(b.session_date))
        .slice(0, 5);

    return (
        <div style={styles.container}>
            <Sidebar />

            <main style={styles.main}>
                <div style={styles.content}>

                    {/* Page Header */}
                    <div style={styles.pageHeader}>
                        <div style={styles.titleGroup}>
                            <h2 style={styles.monthTitle}>
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </h2>
                            {studentGrade && (
                                <span style={styles.gradeBadge}>{studentGrade}</span>
                            )}
                            <div style={styles.navButtons}>
                                <button
                                    style={styles.iconBtn}
                                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                                >
                                    <FaChevronLeft />
                                </button>
                                <button
                                    style={styles.iconBtn}
                                    onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                                >
                                    <FaChevronRight />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div style={styles.splitLayout}>
                        {/* ── CALENDAR GRID ─────────────────── */}
                        <div style={styles.calendarCard}>
                            {/* Weekday Headers */}
                            <div style={styles.weekHeader}>
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                    <div key={d} style={styles.weekDay}>{d}</div>
                                ))}
                            </div>
                            {/* Days Grid */}
                            <div style={styles.daysGrid}>
                                {renderCalendarDays()}
                            </div>
                        </div>

                        {/* ── UPCOMING SESSIONS SIDEBAR ─────── */}
                        <div style={styles.eventSidebar}>
                            <h3 style={styles.sidebarTitle}>Upcoming Classes</h3>

                            {upcomingSessions.length === 0 ? (
                                <div style={styles.noEvents}>
                                    <p>No upcoming classes.</p>
                                    <p style={{ fontSize: 12, marginTop: 8, color: '#D1D5DB' }}>
                                        Enroll in a course to see your schedule here.
                                    </p>
                                </div>
                            ) : (
                                <div style={styles.eventList}>
                                    {upcomingSessions.map(s => {
                                        const isOnline = s.class_type === 'Online';
                                        return (
                                            <div key={s.session_id} style={styles.upcomingCard}>
                                                <div style={styles.colorStrip} />
                                                <div style={{ flex: 1 }}>
                                                    <strong style={styles.upcomingTitle}>
                                                        {s.topic || '—'}
                                                    </strong>
                                                    <div style={styles.upcomingCourse}>{s.course_title}</div>
                                                    <div style={styles.upcomingTime}>
                                                        <FaClock size={11} />
                                                        {new Date(s.session_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                                        {' '}{formatTime(s.session_time)}
                                                    </div>
                                                    <div style={{ ...styles.upcomingTime, marginTop: 4 }}>
                                                        {isOnline ? (
                                                            s.meeting_link ? (
                                                                <a
                                                                    href={s.meeting_link.startsWith('http') ? s.meeting_link : `https://${s.meeting_link}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    style={styles.joinLink}
                                                                >
                                                                    <FaVideo size={11} style={{ marginRight: 4 }} /> Join Online
                                                                </a>
                                                            ) : (
                                                                <span style={{ color: '#6B7280' }}><FaVideo size={11} /> Online</span>
                                                            )
                                                        ) : (
                                                            <span style={{ color: '#6B7280' }}>
                                                                <FaMapMarkerAlt size={11} style={{ marginRight: 4 }} />
                                                                {s.venue || 'Physical'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const styles = {
    container: { display: 'flex', height: '100vh', backgroundColor: '#F3F4F6', fontFamily: "'Inter', sans-serif" },
    main: { marginLeft: '250px', flex: 1, display: 'flex', flexDirection: 'column' },
    content: { padding: '30px', overflowY: 'auto' },

    pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    titleGroup: { display: 'flex', alignItems: 'center', gap: '14px' },
    monthTitle: { margin: 0, fontSize: '22px', color: '#1F2937', fontWeight: 'bold' },
    gradeBadge: { backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '3px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '600' },
    navButtons: { display: 'flex', gap: '8px' },
    iconBtn: { background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '7px 12px', cursor: 'pointer', color: '#4B5563', display: 'flex', alignItems: 'center' },

    splitLayout: { display: 'flex', gap: '20px', height: 'calc(100vh - 180px)' },

    // Calendar Card
    calendarCard: { flex: 3, backgroundColor: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' },
    weekHeader: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '10px', textAlign: 'center' },
    weekDay: { fontWeight: '600', color: '#6B7280', fontSize: '13px' },
    daysGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: 'repeat(6, 1fr)', gap: '1px', backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB', flex: 1 },

    // Day Cell
    dayCell: { backgroundColor: '#fff', padding: '8px', minHeight: '80px', display: 'flex', flexDirection: 'column', gap: '3px' },
    todayCell: { backgroundColor: '#EFF6FF' },
    emptySlot: { backgroundColor: '#FAFAFA' },
    dayNumber: { fontSize: '13px', fontWeight: '500', color: '#374151' },
    todayNumber: { fontSize: '13px', fontWeight: 'bold', color: '#2563EB' },

    eventContainer: { display: 'flex', flexDirection: 'column', gap: '3px' },
    eventPill: { fontSize: '10px', padding: '3px 6px', borderRadius: '4px', backgroundColor: '#DBEAFE', color: '#1E40AF', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },

    // Right Sidebar
    eventSidebar: { flex: 1, backgroundColor: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflowY: 'auto' },
    sidebarTitle: { marginTop: 0, marginBottom: '15px', color: '#111827', fontSize: '15px', fontWeight: 'bold' },
    noEvents: { color: '#9CA3AF', textAlign: 'center', marginTop: '40px', fontSize: '14px' },
    eventList: { display: 'flex', flexDirection: 'column', gap: '10px' },

    upcomingCard: { display: 'flex', gap: '10px', padding: '12px', backgroundColor: '#F9FAFB', borderRadius: '10px', border: '1px solid #E5E7EB' },
    colorStrip: { width: '4px', borderRadius: '4px', backgroundColor: '#2563EB', flexShrink: 0 },
    upcomingTitle: { fontSize: '13px', color: '#111827', display: 'block', fontWeight: '600' },
    upcomingCourse: { fontSize: '11px', color: '#6B7280', marginTop: '2px', marginBottom: '4px' },
    upcomingTime: { fontSize: '11px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' },
    joinLink: { color: '#2563EB', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center' },
};

export default StudentCalendar;