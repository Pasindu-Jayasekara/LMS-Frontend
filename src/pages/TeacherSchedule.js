import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    FaChevronLeft, FaChevronRight, FaPlus, FaCalendarAlt, 
    FaClock, FaUsers, FaVideo, FaMapMarkerAlt
} from 'react-icons/fa';
import TeacherSidebar from '../components/TeacherSidebar';

const loggedInTeacherId = sessionStorage.getItem('userId') || 'T2701';

const TeacherSchedule = () => {
    const [view, setView] = useState('Month');
    const [currentDate, setCurrentDate] = useState(new Date()); // Defaults to dynamic today
    const [schedule, setSchedule] = useState([]);

    // Fetch API Data automatically
    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/teacher-courses/schedule/${loggedInTeacherId}`);
                setSchedule(res.data);
            } catch (error) {
                console.error("Failed to load schedule", error);
            }
        };
        fetchSchedule();
    }, []);

    const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const setToday = () => setCurrentDate(new Date());

    // Calendar Helper Functions
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Sun
    
    // Grid starts on Monday (1), so adjust offset properly
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;

    const renderCalendarGrid = () => {
        const slots = [];
        // Empty slots padding logical weeks
        for (let i = 0; i < startOffset; i++) {
            slots.push(<div key={`empty-${i}`} style={styles.calendarCellEmpty}></div>);
        }
        
        for (let d = 1; d <= daysInMonth; d++) {
            const today = new Date();
            const isToday = d === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
            
            // Format match ISO logic natively parsing "YYYY-MM-DD" accurately
            const matchDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            
            const dayClasses = schedule.filter(cls => {
                if(!cls.session_date) return false;
                return cls.session_date.startsWith(matchDate);
            });

            slots.push(
                <div key={d} style={styles.calendarCell}>
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', width: '75%', overflow: 'hidden' }}>
                            {dayClasses.map(cls => (
                                <div key={cls.session_id} style={styles.cardEvent}>
                                    <div style={styles.eventText}>{cls.session_time.substring(0,5)} - {cls.course_grade}</div>
                                </div>
                            ))}
                        </div>
                        <span style={isToday ? styles.todayBadge : styles.dateNumber}>{d}</span>
                    </div>
                </div>
            );
        }
        return slots;
    };

    return (
        <div style={styles.container}>
            <TeacherSidebar />
            
            <main style={styles.main}>
                
                <div style={styles.content}>
                    
                    {/* Top Controls */}
                    <div style={styles.controlsBar}>
                        <div style={styles.leftControls}>
                            <label style={styles.label}>Course</label>
                            <select style={styles.select}>
                                <option>All Courses</option>
                                <option>Mathematics</option>
                                <option>Physics</option>
                            </select>
                        </div>

                        <div style={styles.rightControls}>
                            <div style={styles.viewSwitcher}>
                                {['Month', 'Week', 'Day'].map(v => (
                                    <button 
                                        key={v}
                                        style={view === v ? styles.viewBtnActive : styles.viewBtn}
                                        onClick={() => setView(v)}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>
                            <button style={styles.scheduleBtn}>
                                <FaPlus style={{marginRight: 8}} /> Schedule New Class
                            </button>
                        </div>
                    </div>

                    {/* Calendar Section */}
                    <div style={styles.calendarCard}>
                        <div style={styles.calHeader}>
                            <h2 style={styles.monthTitle}>
                                {currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}
                            </h2>
                            <div style={styles.navGroup}>
                                <button style={styles.navBtn} onClick={handlePrevMonth}><FaChevronLeft /></button>
                                <span style={styles.todayText} onClick={setToday}>Month</span>
                                <button style={styles.navBtn} onClick={handleNextMonth}><FaChevronRight /></button>
                            </div>
                        </div>

                        <div style={styles.daysHeader}>
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                <div key={day} style={styles.dayName}>{day}</div>
                            ))}
                        </div>

                        <div style={styles.calendarGrid}>
                            {renderCalendarGrid()}
                        </div>
                    </div>

                    {/* Upcoming Classes List */}
                    <h3 style={styles.sectionTitle}>Upcoming Classes</h3>
                    <div style={styles.classList}>
                        {schedule.length === 0 ? (
                            <p style={{ color: '#6B7280' }}>No upcoming classes found.</p>
                        ) : schedule.filter(cls => {
                            if(!cls.session_date) return false;
                            const todayIso = new Date().toISOString().split('T')[0];
                            return cls.session_date.split('T')[0] >= todayIso;
                        }).slice(0, 5).map(cls => (
                            <div key={cls.session_id} style={styles.classRow}>
                                <div style={styles.classInfo}>
                                    <h4 style={styles.clsTitle}>{cls.topic}</h4>
                                    <span style={styles.clsSubtitle}>Course: {cls.course_title} | {cls.course_grade}</span>
                                    <div style={styles.clsMeta}>
                                        <span><FaCalendarAlt /> {new Date(cls.session_date).toLocaleDateString()}</span>
                                        <span style={{marginLeft: 15}}><FaClock /> {cls.session_time}</span>
                                        {cls.class_type === 'Online' ? (
                                            <span style={{marginLeft: 15, color: '#2563EB'}}><FaVideo /> Online Link</span>
                                        ) : (
                                            <span style={{marginLeft: 15, color: '#047857'}}><FaMapMarkerAlt /> {cls.venue}</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div style={styles.classActions}>
                                    <span style={styles.badge}>{cls.class_type || 'Virtual'}</span>
                                    {cls.class_type === 'Online' && cls.meeting_link && (
                                        <a href={cls.meeting_link.startsWith('http') ? cls.meeting_link : `https://${cls.meeting_link}`} target="_blank" rel="noreferrer" style={{textDecoration: 'none'}}>
                                            <button style={styles.actionLink}>Join Zoom</button>
                                        </a>
                                    )}
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

    // Controls
    controlsBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '25px' },
    leftControls: { display: 'flex', flexDirection: 'column', gap: '5px' },
    label: { fontSize: '13px', color: '#374151', fontWeight: '500' },
    select: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', width: '200px', fontSize: '14px' },
    
    rightControls: { display: 'flex', gap: '15px', alignItems: 'center' },
    viewSwitcher: { display: 'flex', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #D1D5DB', overflow: 'hidden' },
    viewBtn: { border: 'none', background: 'transparent', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', color: '#6B7280', borderRight: '1px solid #E5E7EB' },
    viewBtnActive: { border: 'none', background: '#1D4ED8', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', color: '#fff', fontWeight: '600' },
    scheduleBtn: { backgroundColor: '#1D4ED8', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center' },

    // Calendar Card
    calendarCard: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '25px', marginBottom: '30px' },
    calHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    monthTitle: { fontSize: '18px', fontWeight: '600', margin: 0 },
    navGroup: { display: 'flex', alignItems: 'center', gap: '10px' },
    navBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' },
    todayText: { fontSize: '14px', color: '#2563EB', fontWeight: '600', cursor: 'pointer' },

    daysHeader: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '15px' },
    dayName: { fontSize: '13px', fontWeight: '600', color: '#6B7280' },
    
    calendarGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0' },
    calendarCell: { height: '80px', borderTop: '1px solid #F3F4F6', padding: '10px', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' },
    calendarCellEmpty: { height: '80px', borderTop: '1px solid #F3F4F6', backgroundColor: '#FAFAFA' },
    
    dateNumber: { fontSize: '14px', color: '#374151' },
    todayBadge: { width: '28px', height: '28px', backgroundColor: '#2563EB', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold' },
    
    cardEvent: { backgroundColor: '#EFF6FF', borderRadius: '4px', padding: '2px 4px', fontSize: '10px', color: '#1E40AF', borderLeft: '2px solid #3B82F6', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    eventText: { fontWeight: '600' },

    // Upcoming List
    sectionTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#111827' },
    classList: { display: 'flex', flexDirection: 'column', gap: '15px' },
    classRow: { backgroundColor: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    
    classInfo: { flex: 1 },
    clsTitle: { margin: '0 0 5px 0', fontSize: '16px', color: '#111827' },
    clsSubtitle: { fontSize: '13px', color: '#6B7280', display: 'block', marginBottom: '8px' },
    clsMeta: { fontSize: '13px', color: '#374151', display: 'flex', alignItems: 'center' },

    classActions: { display: 'flex', alignItems: 'center', gap: '15px' },
    badge: { backgroundColor: '#F3E8FF', color: '#7E22CE', fontSize: '12px', padding: '4px 10px', borderRadius: '15px', fontWeight: '600' },
    actionLink: { background: 'none', border: 'none', color: '#2563EB', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
    actionLinkDanger: { background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }
};

export default TeacherSchedule;