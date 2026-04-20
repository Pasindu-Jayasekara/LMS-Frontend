import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUsers, FaChalkboardTeacher, FaBook, FaBullhorn, FaMoneyBillWave } from 'react-icons/fa'; // Added FaMoneyBillWave
import AdminSidebar from '../components/AdminSidebar';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        students: 0,
        teachers: 0,
        courses: 0,
        revenue: 825000
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/admin/dashboard-stats');
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <div style={styles.sidebarWrapper}>
                <AdminSidebar />
            </div>

            <main style={styles.main}>
                {/* Scrollable Content */}
                <div style={styles.content}>

                    <div style={styles.welcomeSection}>
                        <h1 style={styles.welcomeTitle}>System Overview ⚙️</h1>
                        <p style={styles.dateText}>Manage your LMS users, courses, and announcements here.</p>
                    </div>

                    {/* Quick Stats Grid */}
                    <div style={styles.statsGrid}>
                        <div style={{ ...styles.statCard, borderTop: '4px solid #3b82f6' }}>
                            <div style={styles.statIconWrapper}><FaUsers size={24} color="#3b82f6" /></div>
                            <div>
                                <p style={styles.statLabel}>Total Students</p>
                                <h2 style={styles.statNumber}>{stats.students.toLocaleString()}</h2>
                            </div>
                        </div>

                        <div style={{ ...styles.statCard, borderTop: '4px solid #10b981' }}>
                            <div style={styles.statIconWrapper}><FaChalkboardTeacher size={24} color="#10b981" /></div>
                            <div>
                                <p style={styles.statLabel}>Total Teachers</p>
                                <h2 style={styles.statNumber}>{stats.teachers.toLocaleString()}</h2>
                            </div>
                        </div>

                        <div style={{ ...styles.statCard, borderTop: '4px solid #f59e0b' }}>
                            <div style={styles.statIconWrapper}><FaBook size={24} color="#f59e0b" /></div>
                            <div>
                                <p style={styles.statLabel}>Active Courses</p>
                                <h2 style={styles.statNumber}>{stats.courses.toLocaleString()}</h2>
                            </div>
                        </div>

                        
                    </div>

                    {/* Action Cards */}
                    <div style={styles.actionsGrid}>
                        <div style={styles.actionCard}>
                            <h3>Post an Announcement</h3>
                            <p style={{ fontSize: 14, color: '#666' }}>Publish a new notice to all student dashboards.</p>
                            <button style={styles.primaryBtn} onClick={() => navigate('/AdminAnnouncements')}><FaBullhorn style={{ marginRight: '8px' }} /> Create Notice</button>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

// --- STYLES ---
const styles = {
    container: { display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#F9FAFB', fontFamily: 'sans-serif', overflow: 'hidden' },
    sidebarWrapper: { width: '250px', flexShrink: 0, height: '100%', overflowY: 'auto' },
    main: { flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' },
    content: { flex: 1, overflowY: 'auto', padding: '30px', boxSizing: 'border-box' },

    welcomeSection: { marginBottom: 30 },
    welcomeTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827', margin: 0 },
    dateText: { color: '#6B7280', margin: '5px 0 0 0' },

    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }, // Slightly reduced minmax to fit 4 cards nicely
    statCard: { backgroundColor: '#fff', borderRadius: '8px', padding: '20px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    statIconWrapper: { backgroundColor: '#f3f4f6', padding: '15px', borderRadius: '50%' },
    statLabel: { margin: 0, fontSize: '14px', color: '#6B7280', fontWeight: '500' },
    statNumber: { margin: '5px 0 0 0', fontSize: '24px', color: '#111827', fontWeight: 'bold' }, // Adjusted font size slightly so big numbers fit

    actionsGrid: { display: 'grid', gridTemplateColumns: '1fr', gap: '20px' },
    actionCard: { backgroundColor: '#fff', borderRadius: '8px', padding: '25px', border: '1px solid #e5e7eb' },
    primaryBtn: { marginTop: '15px', backgroundColor: '#2563EB', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center' }
};

export default AdminDashboard;