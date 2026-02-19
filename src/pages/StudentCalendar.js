import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlus, FaClock } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const StudentCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1)); // October 2025 (Month is 0-indexed)

    // Dummy Data for Events matching your design
    const events = [
        { id: 1, day: 10, title: 'Mathematics Class', type: 'class', color: '#DBEAFE', textColor: '#1E40AF' },
        { id: 2, day: 12, title: 'Computer Science', type: 'class', color: '#DBEAFE', textColor: '#1E40AF' },
        { id: 3, day: 15, title: 'Physics Assignment', type: 'assignment', color: '#DCFCE7', textColor: '#166534' },
        { id: 4, day: 18, title: 'Biology Project', type: 'assignment', color: '#DCFCE7', textColor: '#166534' },
        { id: 5, day: 20, title: 'English Literature Exam', type: 'exam', color: '#FEE2E2', textColor: '#991B1B' },
        { id: 6, day: 21, title: 'Chemistry Lab', type: 'class', color: '#DBEAFE', textColor: '#1E40AF' },
    ];

    // Helper: Get days in current month
    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    // Helper: Get day of week for the 1st of the month (0=Sun, 1=Mon...)
    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);

    // Generate Calendar Grid Slots
    const renderCalendarDays = () => {
        const slots = [];
        
        // Empty slots for previous month days
        for (let i = 0; i < firstDay; i++) {
            slots.push(<div key={`empty-${i}`} style={styles.emptySlot}></div>);
        }

        // Actual Days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEvents = events.filter(e => e.day === day);
            
            slots.push(
                <div key={day} style={styles.dayCell}>
                    <span style={styles.dayNumber}>{day}</span>
                    <div style={styles.eventContainer}>
                        {dayEvents.map(event => (
                            <div key={event.id} style={{...styles.eventPill, backgroundColor: event.color, color: event.textColor}}>
                                {event.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return slots;
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <div style={styles.container}>
            <Sidebar />

            <main style={styles.main}>
                <Header />

                <div style={styles.content}>
                    {/* Page Header */}
                    <div style={styles.pageHeader}>
                        <div style={styles.titleGroup}>
                            <h2 style={styles.monthTitle}>
                                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                            </h2>
                            <div style={styles.navButtons}>
                                <button style={styles.iconBtn}><FaChevronLeft /></button>
                                <button style={styles.iconBtn}><FaChevronRight /></button>
                            </div>
                        </div>
                        <button style={styles.addBtn}>
                            <FaPlus style={{marginRight: 8}}/> Add Reminder
                        </button>
                    </div>

                    <div style={styles.splitLayout}>
                        {/* --- CALENDAR GRID --- */}
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

                        {/* --- UPCOMING EVENTS SIDEBAR --- */}
                        <div style={styles.eventSidebar}>
                            <h3 style={styles.sidebarTitle}>Upcoming Events</h3>
                            
                            {/* Logic to show events or empty state */}
                            {events.length > 0 ? (
                                <div style={styles.eventList}>
                                    {events.slice(0, 3).map(event => (
                                        <div key={event.id} style={styles.upcomingCard}>
                                            <div style={{...styles.colorStrip, backgroundColor: event.textColor}}></div>
                                            <div>
                                                <strong style={styles.upcomingTitle}>{event.title}</strong>
                                                <div style={styles.upcomingTime}>
                                                    <FaClock size={12}/> Oct {event.day}, 10:00 AM
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={styles.noEvents}>
                                    <p>No upcoming events</p>
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
    titleGroup: { display: 'flex', alignItems: 'center', gap: '20px' },
    monthTitle: { margin: 0, fontSize: '24px', color: '#1F2937', fontWeight: 'bold' },
    navButtons: { display: 'flex', gap: '10px' },
    iconBtn: { background: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '8px 12px', cursor: 'pointer', color: '#4B5563' },
    addBtn: { display: 'flex', alignItems: 'center', backgroundColor: '#fff', border: '1px solid #E5E7EB', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', color: '#374151' },

    splitLayout: { display: 'flex', gap: '20px', height: 'calc(100vh - 180px)' },
    
    // Calendar Card
    calendarCard: { flex: 3, backgroundColor: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' },
    weekHeader: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '10px', textAlign: 'center' },
    weekDay: { fontWeight: '600', color: '#6B7280', fontSize: '14px' },
    daysGrid: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: 'repeat(5, 1fr)', gap: '1px', backgroundColor: '#F3F4F6', border: '1px solid #E5E7EB', flex: 1 },
    
    // Day Cell
    dayCell: { backgroundColor: '#fff', padding: '10px', minHeight: '100px', display: 'flex', flexDirection: 'column', gap: '5px' },
    emptySlot: { backgroundColor: '#fff' },
    dayNumber: { fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '5px' },
    
    eventContainer: { display: 'flex', flexDirection: 'column', gap: '4px' },
    eventPill: { fontSize: '10px', padding: '4px 8px', borderRadius: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: '600' },

    // Right Sidebar
    eventSidebar: { flex: 1, backgroundColor: '#fff', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    sidebarTitle: { marginTop: 0, marginBottom: '20px', color: '#111827' },
    noEvents: { color: '#9CA3AF', textAlign: 'center', marginTop: '50px' },
    
    upcomingCard: { display: 'flex', gap: '12px', marginBottom: '15px', padding: '10px', backgroundColor: '#F9FAFB', borderRadius: '8px' },
    colorStrip: { width: '4px', borderRadius: '4px' },
    upcomingTitle: { fontSize: '14px', color: '#374151', display: 'block' },
    upcomingTime: { fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }
};

export default StudentCalendar;