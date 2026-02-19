import React from 'react';
import { 
    FaUsers, FaBook, FaMoneyBillWave, FaArrowUp, 
    FaArrowDown, FaDownload 
} from 'react-icons/fa';
import AdminSidebar from '../components/AdminSidebar';
import Header from '../components/Header';

const AdminAnalytics = () => {
    // 1. Simple Data for the Table
    const courseStats = [
        { id: 1, name: 'A/L Science', students: 450, revenue: 'Rs. 225,000', status: 'Excellent' },
        { id: 2, name: 'A/L Commerce', students: 380, revenue: 'Rs. 190,000', status: 'Good' },
        { id: 3, name: 'A/L Arts', students: 210, revenue: 'Rs. 105,000', status: 'Average' },
        { id: 4, name: 'O/L Maths', students: 520, revenue: 'Rs. 260,000', status: 'Excellent' },
        { id: 5, name: 'O/L Science', students: 480, revenue: 'Rs. 240,000', status: 'Good' },
    ];

    // 2. Simple Data for "Demographics" List (Replaces Pie Chart)
    const demographics = [
        { grade: 'Grade 13', count: 450, percent: '35%' },
        { grade: 'Grade 12', count: 380, percent: '30%' },
        { grade: 'Grade 11', count: 300, percent: '25%' },
        { grade: 'Grade 10', count: 120, percent: '10%' },
    ];

    return (
        <div style={styles.container}>
            <AdminSidebar />
            <main style={styles.main}>
                <Header title="Analytics" />
                
                <div style={styles.content}>
                    
                    {/* Header with Export Button */}
                    <div style={styles.pageHeader}>
                        <h2 style={styles.title}>System Analytics</h2>
                        <button style={styles.exportBtn}>
                            <FaDownload style={{marginRight:8}}/> Download Report
                        </button>
                    </div>

                    {/* KPI Cards (Key Performance Indicators) */}
                    {/* Explanation: "These are just total counts fetched from the Database." */}
                    <div style={styles.statsGrid}>
                        <StatCard 
                            label="Total Students" 
                            value="1,248" 
                            trend="+12 New this week" 
                            isPositive={true}
                            icon={<FaUsers size={24} color="#2563EB"/>}
                            bg="#EFF6FF"
                        />
                        <StatCard 
                            label="Total Revenue" 
                            value="Rs. 825,000" 
                            trend="-5% from last month" 
                            isPositive={false}
                            icon={<FaMoneyBillWave size={24} color="#059669"/>}
                            bg="#ECFDF5"
                        />
                        <StatCard 
                            label="Active Courses" 
                            value="42" 
                            trend="+2 New Courses" 
                            isPositive={true}
                            icon={<FaBook size={24} color="#D97706"/>}
                            bg="#FFFBEB"
                        />
                    </div>

                    <div style={styles.splitLayout}>
                        
                        {/* LEFT: Detailed Table */}
                        {/* Explanation: "This table simply lists the courses and their total revenue." */}
                        <div style={styles.leftPanel}>
                            <div style={styles.panelHeader}>
                                <h3>Course Performance</h3>
                            </div>
                            <table style={styles.table}>
                                <thead>
                                    <tr style={styles.headerRow}>
                                        <th style={styles.th}>Course Name</th>
                                        <th style={styles.th}>Students</th>
                                        <th style={styles.th}>Revenue</th>
                                        <th style={styles.th}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courseStats.map(item => (
                                        <tr key={item.id} style={styles.row}>
                                            <td style={styles.tdBold}>{item.name}</td>
                                            <td style={styles.td}>{item.students}</td>
                                            <td style={styles.td}>{item.revenue}</td>
                                            <td style={styles.td}>
                                                <span style={getStatusStyle(item.status)}>
                                                    {item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* RIGHT: Simple Lists (Replaces Charts) */}
                        {/* Explanation: "This list shows the breakdown of students by grade level." */}
                        <div style={styles.rightPanel}>
                            <div style={styles.card}>
                                <h3 style={styles.cardTitle}>Student Demographics</h3>
                                <div style={styles.list}>
                                    {demographics.map((demo, index) => (
                                        <div key={index} style={styles.listItem}>
                                            <div style={styles.listLeft}>
                                                <div style={styles.barContainer}>
                                                    <div style={{...styles.barFill, width: demo.percent}}></div>
                                                </div>
                                                <span style={styles.listLabel}>{demo.grade}</span>
                                            </div>
                                            <span style={styles.listValue}>{demo.count} Students</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={styles.card}>
                                <h3 style={styles.cardTitle}>Quick Summary</h3>
                                <div style={styles.summaryItem}>
                                    <span style={{color:'#6B7280'}}>Avg. Attendance</span>
                                    <strong>85%</strong>
                                </div>
                                <div style={styles.summaryItem}>
                                    <span style={{color:'#6B7280'}}>Fee Collection</span>
                                    <strong>92% Collected</strong>
                                </div>
                                <div style={styles.summaryItem}>
                                    <span style={{color:'#6B7280'}}>Teacher Satisfaction</span>
                                    <strong>4.8/5.0</strong>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

// Helper Components
const StatCard = ({ label, value, trend, isPositive, icon, bg }) => (
    <div style={styles.statCard}>
        <div style={{...styles.iconBox, backgroundColor: bg}}>{icon}</div>
        <div>
            <div style={{fontSize: 14, color: '#6B7280'}}>{label}</div>
            <div style={{fontSize: 26, fontWeight: 'bold', color: '#111827'}}>{value}</div>
            <div style={{fontSize: 12, color: isPositive ? '#059669' : '#DC2626', display: 'flex', alignItems: 'center', gap: 5}}>
                {isPositive ? <FaArrowUp size={10}/> : <FaArrowDown size={10}/>}
                {trend}
            </div>
        </div>
    </div>
);

const getStatusStyle = (status) => {
    const base = { padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' };
    if (status === 'Excellent') return { ...base, backgroundColor: '#DCFCE7', color: '#166534' };
    if (status === 'Good') return { ...base, backgroundColor: '#DBEAFE', color: '#1E40AF' };
    return { ...base, backgroundColor: '#FEF3C7', color: '#B45309' };
};

const styles = {
    container: { display: 'flex', height: '100vh', background: '#F9FAFB', fontFamily: 'sans-serif' },
    main: { marginLeft: '250px', flex: 1, display: 'flex', flexDirection: 'column' },
    content: { padding: '30px', overflowY: 'auto' },

    pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
    title: { margin: 0, fontSize: '22px', fontWeight: 'bold', color: '#111827' },
    exportBtn: { backgroundColor: '#fff', border: '1px solid #D1D5DB', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: '500' },

    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' },
    statCard: { background: '#fff', padding: '20px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid #E5E7EB', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
    iconBox: { width: '50px', height: '50px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },

    splitLayout: { display: 'flex', gap: '25px' },
    leftPanel: { flex: 2, backgroundColor: '#fff', borderRadius: '10px', border: '1px solid #E5E7EB', overflow: 'hidden' },
    rightPanel: { flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' },

    panelHeader: { padding: '20px', borderBottom: '1px solid #E5E7EB' },
    table: { width: '100%', borderCollapse: 'collapse' },
    headerRow: { textAlign: 'left', borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' },
    th: { padding: '15px 20px', fontSize: '12px', color: '#6B7280', fontWeight: '600' },
    row: { borderBottom: '1px solid #F9FAFB' },
    td: { padding: '15px 20px', fontSize: '14px', color: '#374151' },
    tdBold: { padding: '15px 20px', fontSize: '14px', fontWeight: '600', color: '#111827' },

    card: { backgroundColor: '#fff', padding: '20px', borderRadius: '10px', border: '1px solid #E5E7EB' },
    cardTitle: { margin: '0 0 15px 0', fontSize: '16px', fontWeight: 'bold' },
    
    list: { display: 'flex', flexDirection: 'column', gap: '15px' },
    listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    listLeft: { display: 'flex', alignItems: 'center', gap: '10px', flex: 1 },
    listLabel: { fontSize: '13px', fontWeight: '500' },
    listValue: { fontSize: '13px', color: '#6B7280' },
    
    barContainer: { width: '60px', height: '6px', backgroundColor: '#F3F4F6', borderRadius: '3px', overflow: 'hidden' },
    barFill: { height: '100%', backgroundColor: '#2563EB', borderRadius: '3px' },

    summaryItem: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F3F4F6', fontSize: '14px' }
};

export default AdminAnalytics;