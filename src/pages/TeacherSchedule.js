import React, { useState } from 'react';
import { 
    FaChevronLeft, FaChevronRight, FaPlus, FaCalendarAlt, 
    FaClock, FaUsers
} from 'react-icons/fa';
import TeacherSidebar from '../components/TeacherSidebar';
import Header from '../components/Header';

const TeacherSchedule = () => {
    const [view, setView] = useState('Month');
    const [currentDate] = useState(new Date(2025, 9, 19)); // October 19, 2025

    // Dummy Data for Upcoming Classes
    const upcomingClasses = [
        { id: 1, title: 'Integration Techniques', course: 'Advanced Mathematics', date: 'Fri, Sep 15', time: '10:00 - 11:30', students: 32, type: 'Recurring' },
        { id: 2, title: 'Differential Equations', course: 'Advanced Mathematics', date: 'Sun, Sep 17', time: '13:00 - 14:30', students: 30, type: 'Recurring' },
        { id: 3, title: "Newton's Laws of Motion", course: 'Physics Mechanics', date: 'Sat, Sep 16', time: '09:00 - 10:30', students: 28, type: 'Recurring' },
        { id: 4, title: 'Chemical Bonding', course: 'Chemistry Fundamentals', date: 'Mon, Sep 18', time: '15:00 - 16:30', students: 25, type: null },
    ];

    // Calendar Helper Functions
    //const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0 = Sun

    const renderCalendarGrid = () => {
        const slots = [];
        // Empty slots for previous month
        for (let i = 0; i < firstDay - 1; i++) { // Adjusting for Mon start if needed, assuming Mon start based on image logic, but standard JS is Sun=0
             // Image shows Mon first column. Let's stick to standard grid for simplicity or adjust. 
             // Standard JS: 0=Sun. Image: Mon, Tue... Sun.
             // Let's assume standard Sun start for code simplicity unless strict Mon start needed.
             // Actually, looking at image: Mon Tue Wed Thu Fri Sat Sun.
             // So if First Day is Sun (0), we need 6 empty slots. If Mon (1), 0 empty.
             // Logic: (day + 6) % 7
        }
        
        // Let's use simple logic for visual grid: 35 cells
        // Just rendering days 1 to 31 matching the image layout roughly
        // Rows: 5. 
        for (let d = 1; d <= 31; d++) {
            const isToday = d === 19;
            slots.push(
                <div key={d} style={styles.calendarCell}>
                    <span style={isToday ? styles.todayBadge : styles.dateNumber}>{d}</span>
                </div>
            );
        }
        return slots;
    };

    return (
        <div style={styles.container}>
            <TeacherSidebar />
            
            <main style={styles.main}>
                <Header title="Class Schedule" />
                
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
                            <h2 style={styles.monthTitle}>October 2025</h2>
                            <div style={styles.navGroup}>
                                <button style={styles.navBtn}><FaChevronLeft /></button>
                                <span style={styles.todayText}>Today</span>
                                <button style={styles.navBtn}><FaChevronRight /></button>
                            </div>
                        </div>

                        <div style={styles.daysHeader}>
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                <div key={day} style={styles.dayName}>{day}</div>
                            ))}
                        </div>

                        <div style={styles.calendarGrid}>
                            {/* Empty slots for visual match with image (Mon start) */}
                            <div style={styles.calendarCellEmpty}></div>
                            <div style={styles.calendarCellEmpty}></div>
                            <div style={styles.calendarCellEmpty}></div>
                            <div style={styles.calendarCellEmpty}></div>
                            {renderCalendarGrid()}
                        </div>
                    </div>

                    {/* Upcoming Classes List */}
                    <h3 style={styles.sectionTitle}>Upcoming Classes</h3>
                    <div style={styles.classList}>
                        {upcomingClasses.map(cls => (
                            <div key={cls.id} style={styles.classRow}>
                                <div style={styles.classInfo}>
                                    <h4 style={styles.clsTitle}>{cls.title}</h4>
                                    <span style={styles.clsSubtitle}>{cls.course}</span>
                                    <div style={styles.clsMeta}>
                                        <span><FaCalendarAlt /> {cls.date}</span>
                                        <span style={{marginLeft: 15}}><FaClock /> {cls.time}</span>
                                        <span style={{marginLeft: 15}}><FaUsers /> {cls.students} students</span>
                                    </div>
                                </div>
                                
                                <div style={styles.classActions}>
                                    {cls.type && <span style={styles.badge}>{cls.type}</span>}
                                    <button style={styles.actionLink}>Edit</button>
                                    <button style={styles.actionLinkDanger}>Cancel</button>
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