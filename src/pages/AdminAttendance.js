import React, { useState } from 'react';
import { 
    FaSearch, FaQrcode, FaDownload, FaCalendarAlt, 
    FaBook, FaChartBar, FaUsers, FaCheckCircle, FaTimesCircle 
} from 'react-icons/fa';
import AdminSidebar from '../components/AdminSidebar';
import Header from '../components/Header';

const AdminAttendance = () => {
    const [/*searchTerm,*/ setSearchTerm] = useState('');
    const [/*gradeFilter,*/ setGradeFilter] = useState('All Grades');

    // Dummy Data matching your screenshot
    const attendanceRecords = [
        { id: 1, date: 'Jun 15, 2023', class: 'Advanced Mathematics', grade: '12th Grade', teacher: 'Dr. Sarah Miller', present: 87.5, absent: 12.5 },
        { id: 2, date: 'Jun 15, 2023', class: 'Physics 101', grade: '11th Grade', teacher: 'Prof. Robert Davis', present: 89.3, absent: 10.7 },
        { id: 3, date: 'Jun 14, 2023', class: 'Computer Science', grade: '12th Grade', teacher: 'Dr. James Wilson', present: 83.3, absent: 16.7 },
        { id: 4, date: 'Jun 14, 2023', class: 'English Literature', grade: '10th Grade', teacher: 'Prof. Emma Thompson', present: 94.3, absent: 5.7 },
        { id: 5, date: 'Jun 13, 2023', class: 'Biology', grade: '11th Grade', teacher: 'Dr. Michael Brown', present: 90.0, absent: 10.0 },
        { id: 6, date: 'Jun 13, 2023', class: 'World History', grade: '9th Grade', teacher: 'Prof. Sophia Lee', present: 92.1, absent: 7.9 },
    ];

    return (
        <div style={styles.container}>
            <AdminSidebar />
            <main style={styles.main}>
                <Header title="Attendance Management" />
                
                <div style={styles.content}>
                    
                    {/* Top Stats Cards */}
                    <div style={styles.statsGrid}>
                        <StatCard 
                            icon={<FaUsers size={20} color="#2563EB"/>} 
                            label="Overall Attendance" 
                            value="90.7%" 
                            bg="#EFF6FF"
                        />
                        <StatCard 
                            icon={<FaCheckCircle size={20} color="#059669"/>} 
                            label="Present Today" 
                            value="142" 
                            bg="#ECFDF5"
                        />
                        <StatCard 
                            icon={<FaTimesCircle size={20} color="#DC2626"/>} 
                            label="Absent Today" 
                            value="12" 
                            bg="#FEF2F2"
                        />
                    </div>

                    {/* Action Toolbar */}
                    <div style={styles.toolbar}>
                        <div style={{display:'flex', gap: 10}}>
                            <button style={styles.primaryBtn}>
                                <FaQrcode style={{marginRight: 8}}/> Generate QR Code
                            </button>
                            <button style={styles.outlineBtn}>
                                <FaDownload style={{marginRight: 8}}/> Download Report
                            </button>
                        </div>

                        <div style={styles.filters}>
                            <div style={styles.searchBox}>
                                <FaSearch color="#9CA3AF" />
                                <input 
                                    placeholder="Search classes..." 
                                    style={styles.searchInput}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            <select 
                                style={styles.select}
                                onChange={(e) => setGradeFilter(e.target.value)}
                            >
                                <option>All Grades</option>
                                <option>12th Grade</option>
                                <option>11th Grade</option>
                                <option>10th Grade</option>
                            </select>
                        </div>
                    </div>

                    {/* Attendance Table */}
                    <div style={styles.tableCard}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.headerRow}>
                                    <th style={styles.th}>Date</th>
                                    <th style={styles.th}>Class</th>
                                    <th style={styles.th}>Grade</th>
                                    <th style={styles.th}>Teacher</th>
                                    <th style={styles.th}>Present %</th>
                                    <th style={styles.th}>Absent %</th>
                                    <th style={{...styles.th, textAlign: 'right'}}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceRecords.map(item => (
                                    <tr key={item.id} style={styles.row}>
                                        <td style={styles.td}>
                                            <div style={styles.dateCell}>
                                                <FaCalendarAlt color="#9CA3AF" size={12}/> {item.date}
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.classCell}>
                                                <FaBook color="#2563EB" size={12}/> <strong>{item.class}</strong>
                                            </div>
                                        </td>
                                        <td style={styles.td}>{item.grade}</td>
                                        <td style={styles.td}>{item.teacher}</td>
                                        
                                        {/* Present Bar */}
                                        <td style={styles.td}>
                                            <div style={styles.progressRow}>
                                                <div style={styles.progressBarBg}>
                                                    <div style={{...styles.progressBarFill, width: `${item.present}%`, backgroundColor: '#10B981'}}></div>
                                                </div>
                                                <span style={styles.percentText}>{item.present}%</span>
                                            </div>
                                        </td>

                                        {/* Absent Bar */}
                                        <td style={styles.td}>
                                            <div style={styles.progressRow}>
                                                <div style={styles.progressBarBg}>
                                                    <div style={{...styles.progressBarFill, width: `${item.absent}%`, backgroundColor: '#EF4444'}}></div>
                                                </div>
                                                <span style={styles.percentText}>{item.absent}%</span>
                                            </div>
                                        </td>

                                        <td style={{...styles.td, textAlign: 'right'}}>
                                            <div style={styles.actions}>
                                                <button style={styles.iconBtn}><FaQrcode size={14}/> QR</button>
                                                <button style={styles.iconBtn}><FaChartBar size={14}/> Details</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </main>
        </div>
    );
};

// Helper Stats Component
const StatCard = ({ icon, label, value, bg }) => (
    <div style={styles.statCard}>
        <div style={{...styles.iconBox, backgroundColor: bg}}>{icon}</div>
        <div>
            <div style={{fontSize: 13, color: '#6B7280'}}>{label}</div>
            <div style={{fontSize: 24, fontWeight: 'bold', color: '#111827'}}>{value}</div>
        </div>
    </div>
);

const styles = {
    container: { display: 'flex', height: '100vh', background: '#F9FAFB', fontFamily: 'sans-serif' },
    main: { marginLeft: '250px', flex: 1, display: 'flex', flexDirection: 'column' },
    content: { padding: '30px', overflowY: 'auto' },

    // Stats
    statsGrid: { display: 'flex', gap: '20px', marginBottom: '30px' },
    statCard: { flex: 1, background: '#fff', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #E5E7EB', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
    iconBox: { width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },

    // Toolbar
    toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
    primaryBtn: { backgroundColor: '#2563EB', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '13px' },
    outlineBtn: { backgroundColor: '#fff', color: '#374151', border: '1px solid #D1D5DB', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: '600', fontSize: '13px' },

    filters: { display: 'flex', gap: '15px' },
    searchBox: { display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', width: '250px' },
    searchInput: { border: 'none', outline: 'none', marginLeft: '10px', width: '100%', fontSize: '14px' },
    select: { padding: '8px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none', cursor: 'pointer', backgroundColor: '#fff' },

    // Table
    tableCard: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    headerRow: { textAlign: 'left', borderBottom: '1px solid #E5E7EB' },
    th: { padding: '15px 20px', fontSize: '12px', color: '#6B7280', fontWeight: '600' },
    
    row: { borderBottom: '1px solid #F9FAFB' },
    td: { padding: '15px 20px', fontSize: '14px', color: '#374151', verticalAlign: 'middle' },
    
    dateCell: { display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280', fontSize: '13px' },
    classCell: { display: 'flex', alignItems: 'center', gap: '8px' },

    // Progress Bars
    progressRow: { display: 'flex', alignItems: 'center', gap: '10px' },
    progressBarBg: { width: '60px', height: '6px', backgroundColor: '#F3F4F6', borderRadius: '3px', overflow: 'hidden' },
    progressBarFill: { height: '100%', borderRadius: '3px' },
    percentText: { fontSize: '12px', color: '#6B7280', width: '35px' },

    actions: { display: 'flex', justifyContent: 'flex-end', gap: '10px' },
    iconBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }
};

export default AdminAttendance;