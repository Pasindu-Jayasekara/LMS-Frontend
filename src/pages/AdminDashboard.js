import React from 'react';
import { 
    FaUsers, FaBook, FaMoneyBillWave, FaChartLine, 
    FaCheckCircle, FaExclamationCircle, FaArrowRight,
    FaUserPlus 
} from 'react-icons/fa';
import AdminSidebar from '../components/AdminSidebar';
import Header from '../components/Header';

const AdminDashboard = () => {
    // Dummy Data
    const recentUsers = [
        { id: 1, name: 'Pasindu Silva', role: 'Student', subject: 'A/L Science', joined: 'Today' },
        { id: 2, name: 'Dilini Perera', role: 'Student', subject: 'A/L Commerce', joined: 'Yesterday' },
        { id: 3, name: 'Chamari Fernando', role: 'Teacher', subject: 'Mathematics', joined: '3 days ago' },
    ];

    const approvals = [
        { id: 1, type: 'Course Creation', title: 'Advanced Biology', user: 'Mr. Nimal', status: 'Pending' },
        { id: 2, type: 'Teacher Registration', title: 'Mrs. Kumari Perera', user: 'Admin', status: 'Pending' },
    ];

    return (
        <div style={styles.container}>
            <AdminSidebar />
            <main style={styles.main}>
                <Header title="Admin Portal" />
                
                <div style={styles.content}>
                    
                    {/* Top Action Bar */}
                    <div style={styles.topActions}>
                        <h1 style={styles.pageTitle}>Admin Dashboard</h1>
                        <div style={{display:'flex', gap: 10}}>
                            <button style={styles.outlineBtn}><FaBook style={{marginRight:5}}/> Create Course</button>
                            <button style={styles.primaryBtn}><FaUserPlus style={{marginRight:5}}/> Add User</button>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div style={styles.statsGrid}>
                        <StatCard 
                            icon={<FaUsers size={20} color="#2563EB"/>} 
                            title="Total Students" 
                            value="1,248" 
                            color="#2563EB"
                            bg="#EFF6FF"
                            border="#2563EB"
                        />
                        <StatCard 
                            icon={<FaBook size={20} color="#D97706"/>} 
                            title="Active Courses" 
                            value="42" 
                            color="#D97706"
                            bg="#FFFBEB"
                            border="#D97706"
                        />
                        <StatCard 
                            icon={<FaChartLine size={20} color="#059669"/>} 
                            title="Monthly Growth" 
                            value="+8.5%" 
                            color="#059669"
                            bg="#ECFDF5"
                            border="#059669"
                        />
                        <StatCard 
                            icon={<FaMoneyBillWave size={20} color="#2563EB"/>} 
                            title="Revenue (Monthly)" 
                            value="Rs. 825,000" 
                            color="#2563EB"
                            bg="#EFF6FF"
                            border="#2563EB"
                        />
                    </div>

                    <div style={styles.dashboardLayout}>
                        {/* --- LEFT COLUMN --- */}
                        <div style={styles.leftColumn}>
                            
                            {/* Revenue Placeholder (Graph) 
                            <div style={styles.card}>
                                <div style={styles.cardHeader}>
                                    <h3 style={styles.cardTitle}>Revenue Overview</h3>
                                    <span style={styles.linkText}>Last 30 Days</span>
                                </div>
                                <div style={styles.chartPlaceholder}>
                                    <div style={styles.chartCircle}></div>
                                    <p style={{color: '#9CA3AF', fontSize: 13, marginTop: 10}}>Revenue chart visualization</p>
                                </div>
                            </div>*/}

                            {/* Recent Users Table */}
                            <div style={styles.card}>
                                <div style={styles.cardHeader}>
                                    <h3 style={styles.cardTitle}>Recent Users</h3>
                                    <span style={styles.linkText}>View all <FaArrowRight size={10}/></span>
                                </div>
                                <table style={styles.table}>
                                    <thead>
                                        <tr style={styles.headerRow}>
                                            <th style={styles.th}>Name</th>
                                            <th style={styles.th}>Role</th>
                                            <th style={styles.th}>Course/Subject</th>
                                            <th style={styles.th}>Joined</th>
                                            <th style={styles.th}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentUsers.map(user => (
                                            <tr key={user.id} style={styles.row}>
                                                <td style={styles.tdBold}>{user.name}</td>
                                                <td style={styles.td}>
                                                    <span style={user.role === 'Student' ? styles.roleStudent : styles.roleTeacher}>{user.role}</span>
                                                </td>
                                                <td style={styles.td}>{user.subject}</td>
                                                <td style={styles.td}>{user.joined}</td>
                                                <td style={styles.tdLink}>View</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        </div>

                        {/* --- RIGHT COLUMN --- */}
                        <div style={styles.rightColumn}>
                            
                            {/* Pending Approvals */}
                            <div style={styles.card}>
                                <h3 style={styles.cardTitle}>Pending Approvals</h3>
                                <div style={styles.approvalList}>
                                    {approvals.map(item => (
                                        <div key={item.id} style={styles.approvalItem}>
                                            <span style={item.type === 'Course Creation' ? styles.tagPurple : styles.tagBlue}>{item.type}</span>
                                            <div style={styles.approvalContent}>
                                                <strong>{item.title}</strong>
                                                <div style={{fontSize: 12, color: '#6B7280'}}>Requested by: {item.user}</div>
                                            </div>
                                            <div style={styles.approvalActions}>
                                                <FaCheckCircle color="#059669" style={{cursor:'pointer'}} />
                                                <FaExclamationCircle color="#DC2626" style={{cursor:'pointer'}} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* System Status */}
                            <div style={styles.card}>
                                <h3 style={styles.cardTitle}>System Status</h3>
                                <StatusRow label="Server Load" percent="25%" color="#059669" />
                                <StatusRow label="Database" percent="40%" color="#059669" />
                                <StatusRow label="Storage" percent="75%" color="#D97706" />
                                <StatusRow label="API Calls" percent="30%" color="#059669" />
                            </div>

                            {/* Quick Links */}
                            <div style={styles.card}>
                                <h3 style={styles.cardTitle}>Quick Links</h3>
                                <div style={styles.linkList}>
                                    <div style={styles.quickLink}><FaBook color="#2563EB"/> Manage Courses</div>
                                    <div style={styles.quickLink}><FaUsers color="#2563EB"/> Manage Users</div>
                                    <div style={styles.quickLink}><FaMoneyBillWave color="#2563EB"/> Payment Reports</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

// Helpers
const StatCard = ({ icon, title, value, color, bg, border }) => (
    <div style={{...styles.statCard, borderLeft: `4px solid ${border}`}}>
        <div style={{...styles.iconBox, backgroundColor: bg}}>{icon}</div>
        <div>
            <div style={{fontSize: 12, color: '#6B7280'}}>{title}</div>
            <div style={{fontSize: 20, fontWeight: 'bold', color: '#111827'}}>{value}</div>
        </div>
    </div>
);

const StatusRow = ({ label, percent, color }) => (
    <div style={{marginBottom: 10}}>
        <div style={{display:'flex', justifyContent:'space-between', fontSize: 12, marginBottom: 4}}>
            <span>{label}</span>
            <span>{percent}</span>
        </div>
        <div style={{height: 6, backgroundColor: '#F3F4F6', borderRadius: 3, overflow: 'hidden'}}>
            <div style={{height: '100%', width: percent, backgroundColor: color}}></div>
        </div>
    </div>
);

const styles = {
    container: { display: 'flex', height: '100vh', background: '#F9FAFB', fontFamily: 'sans-serif' },
    main: { marginLeft: '250px', flex: 1, display: 'flex', flexDirection: 'column' },
    content: { padding: '30px', overflowY: 'auto' },

    topActions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
    pageTitle: { fontSize: '24px', fontWeight: 'bold', margin: 0 },
    primaryBtn: { background: '#1D4ED8', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: '600' },
    outlineBtn: { background: '#fff', color: '#1D4ED8', border: '1px solid #1D4ED8', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: '600' },

    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '25px' },
    statCard: { background: '#fff', padding: '20px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    iconBox: { width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },

    dashboardLayout: { display: 'flex', gap: '25px' },
    leftColumn: { flex: 3, display: 'flex', flexDirection: 'column', gap: '20px' },
    rightColumn: { flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' },

    card: { background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #E5E7EB', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' },
    cardTitle: { margin: 0, fontSize: '16px', fontWeight: 'bold' },
    linkText: { fontSize: '12px', color: '#2563EB', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 },

    // Chart Placeholder
    chartPlaceholder: { height: '200px', background: '#F9FAFB', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
    chartCircle: { width: '40px', height: '40px', border: '4px solid #E5E7EB', borderTop: '4px solid #2563EB', borderRadius: '50%' },

    // Table
    table: { width: '100%', borderCollapse: 'collapse' },
    headerRow: { textAlign: 'left', borderBottom: '1px solid #E5E7EB' },
    th: { padding: '10px', fontSize: '12px', color: '#6B7280' },
    row: { borderBottom: '1px solid #F9FAFB' },
    td: { padding: '12px 10px', fontSize: '13px', color: '#374151' },
    tdBold: { padding: '12px 10px', fontSize: '13px', fontWeight: '600' },
    tdLink: { padding: '12px 10px', fontSize: '13px', fontWeight: '600', color: '#2563EB', cursor: 'pointer' },

    roleStudent: { background: '#F3E8FF', color: '#7E22CE', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '600' },
    roleTeacher: { background: '#DBEAFE', color: '#1E40AF', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '600' },

    // Approvals
    approvalList: { display: 'flex', flexDirection: 'column', gap: '15px' },
    approvalItem: { display: 'flex', flexDirection: 'column', gap: '5px', paddingBottom: '10px', borderBottom: '1px solid #F9FAFB' },
    tagPurple: { background: '#F3E8FF', color: '#7E22CE', width: 'fit-content', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' },
    tagBlue: { background: '#DBEAFE', color: '#1E40AF', width: 'fit-content', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' },
    approvalContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' },
    approvalActions: { display: 'flex', gap: '10px', marginTop: '5px' },

    // Links
    linkList: { display: 'flex', flexDirection: 'column', gap: '15px' },
    quickLink: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#2563EB', cursor: 'pointer', fontWeight: '500' },
};

export default AdminDashboard;