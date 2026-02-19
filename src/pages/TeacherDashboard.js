import React from 'react';
import { 
     FaPlay, FaCalendarAlt, FaClock, FaUserGraduate, 
    FaChartLine, FaCheckCircle, FaFileAlt, FaBullhorn, FaUsers
} from 'react-icons/fa';
import TeacherSidebar from '../components/TeacherSidebar'; // Using the new Teacher Sidebar
import Header from '../components/Header';

const TeacherDashboard = () => {
    return (
        <div style={styles.container}>
            <TeacherSidebar />
            <main style={styles.main}>
                <Header title="Teacher Portal" />
                
                <div style={styles.content}>
                    {/* Welcome Section */}
                    <div style={styles.welcomeSection}>
                        <h1 style={styles.welcomeTitle}>Welcome back, Mr. Saman</h1>
                        <button style={styles.createBtn}>
                            <FaBullhorn style={{marginRight: 8}}/> Create Announcement
                        </button>
                    </div>

                    <div style={styles.dashboardGrid}>
                        {/* --- LEFT COLUMN (Main Stats) --- */}
                        <div style={styles.leftColumn}>
                            
                            {/* Today's Classes */}
                            <div style={styles.sectionHeader}>
                                <h3 style={styles.sectionTitle}>Today's Classes</h3>
                                <span style={styles.linkText}>View schedule &rarr;</span>
                            </div>

                            {/* Active Class Card */}
                            <div style={styles.classCard}>
                                <div>
                                    <h4 style={styles.classTitle}>Advanced Mathematics</h4>
                                    <div style={styles.classMeta}>
                                        <span><FaClock size={12}/> 10:00 AM - 11:30 AM</span>
                                        <span style={{marginLeft: 15}}><FaUsers size={12}/> 32 students</span>
                                    </div>
                                </div>
                                <button style={styles.startClassBtn}><FaPlay size={10} style={{marginRight: 5}}/> Start Class</button>
                            </div>

                            {/* Upcoming Class Card */}
                            <div style={styles.classCardSimple}>
                                <div>
                                    <h4 style={styles.classTitle}>Physics Mechanics</h4>
                                    <div style={styles.classMeta}>
                                        <span><FaClock size={12}/> 1:00 PM - 2:30 PM</span>
                                        <span style={{marginLeft: 15}}><FaUsers size={12}/> 28 students</span>
                                    </div>
                                </div>
                                <div style={styles.startsIn}><FaCalendarAlt size={12} style={{marginRight: 5}}/> Starts in 3 hrs</div>
                            </div>

                            {/* Class Performance Stats */}
                            <h3 style={{...styles.sectionTitle, marginTop: 30}}>Class Performance</h3>
                            <div style={styles.statsRow}>
                                <StatCard 
                                    icon={<FaUserGraduate size={20} color="#4F46E5"/>} 
                                    label="Total Students" 
                                    value="128" 
                                    color="#4F46E5" 
                                    bgColor="#EEF2FF"
                                    borderColor="#4F46E5"
                                />
                                <StatCard 
                                    icon={<FaCalendarAlt size={20} color="#D97706"/>} 
                                    label="Classes This Week" 
                                    value="12" 
                                    color="#D97706" 
                                    bgColor="#FFFBEB"
                                    borderColor="#D97706"
                                />
                                <StatCard 
                                    icon={<FaCheckCircle size={20} color="#059669"/>} 
                                    label="Avg. Attendance" 
                                    value="92%" 
                                    color="#059669" 
                                    bgColor="#ECFDF5"
                                    borderColor="#059669"
                                />
                            </div>

                            {/* Pending Assignments Table */}
                            <div style={styles.sectionHeader}>
                                <h3 style={styles.sectionTitle}>Pending Assignments to Grade</h3>
                                <span style={styles.linkText}>View all &rarr;</span>
                            </div>
                            <div style={styles.tableCard}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr style={styles.headerRow}>
                                            <th style={styles.th}>Assignment</th>
                                            <th style={styles.th}>Subject</th>
                                            <th style={styles.th}>Submissions</th>
                                            <th style={{...styles.th, textAlign: 'right'}}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style={styles.row}>
                                            <td style={styles.tdTitle}>Calculus Problem Set</td>
                                            <td style={styles.td}>Mathematics</td>
                                            <td style={styles.td}>18 / 32</td>
                                            <td style={{...styles.td, textAlign: 'right'}}>
                                                <button style={styles.gradeBtn}><FaChartLine/> Grade</button>
                                            </td>
                                        </tr>
                                        <tr style={styles.row}>
                                            <td style={styles.tdTitle}>Physics Lab Report</td>
                                            <td style={styles.td}>Physics</td>
                                            <td style={styles.td}>22 / 28</td>
                                            <td style={{...styles.td, textAlign: 'right'}}>
                                                <button style={styles.gradeBtn}><FaChartLine/> Grade</button>
                                            </td>
                                        </tr>
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
                                    <div style={styles.actionItem}><FaFileAlt color="#2563EB"/> Create Assignment</div>
                                    <div style={styles.actionItem}><FaCalendarAlt color="#2563EB"/> Schedule Class</div>
                                    <div style={styles.actionItem}><FaUsers color="#2563EB"/> View Students</div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div style={styles.card}>
                                <h3 style={styles.widgetTitle}>Recent Activity</h3>
                                <div style={styles.activityList}>
                                    <ActivityItem text="You marked 12 assignments for Physics Class" time="2 hours ago" />
                                    <ActivityItem text="You posted a new announcement about exam schedule" time="Yesterday" />
                                    <ActivityItem text="You uploaded new study materials for Chemistry" time="2 days ago" />
                                </div>
                            </div>

                            {/* Mini Calendar (Visual Only) */}
                            <div style={styles.card}>
                                <h3 style={styles.widgetTitle}>September 2023</h3>
                                <div style={styles.miniCalendar}>
                                    <div style={styles.calRow}><span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span></div>
                                    <div style={styles.calRow}><span>1</span><span>2</span><span style={styles.activeDate}>3</span><span>4</span><span>5</span><span>6</span><span>7</span></div>
                                    <div style={styles.calRow}><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span><span>13</span><span>14</span></div>
                                    <div style={styles.calRow}><span>15</span><span>16</span><span>17</span><span>18</span><span>19</span><span>20</span><span>21</span></div>
                                </div>
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
    <div style={{...styles.statCard, borderLeft: `4px solid ${borderColor}`}}>
        <div style={{...styles.iconBox, backgroundColor: bgColor}}>{icon}</div>
        <div>
            <div style={styles.statLabel}>{label}</div>
            <div style={{...styles.statValue, color: color}}>{value}</div>
        </div>
    </div>
);

const ActivityItem = ({ text, time }) => (
    <div style={styles.activityItem}>
        <p style={styles.activityText}>{text}</p>
        <span style={styles.activityTime}>{time}</span>
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
    classCardSimple: { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' },
    classTitle: { margin: '0 0 5px 0', fontSize: '16px', color: '#111827' },
    classMeta: { fontSize: '13px', color: '#6B7280', display: 'flex', alignItems: 'center' },
    startClassBtn: { backgroundColor: '#2563EB', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center' },
    startsIn: { fontSize: '13px', color: '#6B7280', display: 'flex', alignItems: 'center' },

    // Stats
    statsRow: { display: 'flex', gap: '20px', marginBottom: '30px' },
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

    activityList: { display: 'flex', flexDirection: 'column', gap: '20px' },
    activityItem: { display: 'flex', flexDirection: 'column', gap: '5px' },
    activityText: { fontSize: '13px', color: '#374151', margin: 0 },
    activityTime: { fontSize: '11px', color: '#9CA3AF' },

    miniCalendar: { textAlign: 'center' },
    calRow: { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '10px', fontSize: '12px', color: '#6B7280' },
    activeDate: { backgroundColor: '#DBEAFE', color: '#1E40AF', borderRadius: '50%', width: '24px', height: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }
};

export default TeacherDashboard;