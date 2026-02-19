import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const StudentAssignments = () => {
    const [activeTab, setActiveTab] = useState('All');

    // Dummy Data matching your image
    const assignments = [
        { id: 1, title: 'Calculus Problem Set', subject: 'Mathematics', due: 'Sep 15, 2023', status: 'Pending', grade: '-', action: 'Submit' },
        { id: 2, title: 'Physics Lab Report', subject: 'Physics', due: 'Sep 17, 2023', status: 'Pending', grade: '-', action: 'Submit' },
        { id: 3, title: 'Chemistry Equations', subject: 'Chemistry', due: 'Sep 10, 2023', status: 'Submitted', grade: '-', action: 'View' },
        { id: 4, title: 'Linear Algebra Quiz', subject: 'Mathematics', due: 'Sep 5, 2023', status: 'Graded', grade: '85/100', action: 'View' },
        { id: 5, title: 'Mechanics Assignment', subject: 'Physics', due: 'Sep 3, 2023', status: 'Graded', grade: '92/100', action: 'View' },
    ];

    // Filter logic based on active tab
    const filteredAssignments = activeTab === 'All' 
        ? assignments 
        : assignments.filter(a => a.status === activeTab);

    return (
        <div style={styles.container}>
            <Sidebar />
            <main style={styles.main}>
                <Header />
                <div style={styles.content}>
                    
                    <h1 style={styles.pageTitle}>My Assignments</h1>

                    {/* Tabs */}
                    <div style={styles.tabsContainer}>
                        {['All', 'Pending', 'Submitted', 'Graded'].map(tab => (
                            <button 
                                key={tab} 
                                style={activeTab === tab ? styles.activeTab : styles.tab}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Table Card */}
                    <div style={styles.tableCard}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.headerRow}>
                                    <th style={styles.th}>Assignment</th>
                                    <th style={styles.th}>Subject</th>
                                    <th style={styles.th}>Due Date</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Grade</th>
                                    <th style={{...styles.th, textAlign: 'right'}}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAssignments.map(item => (
                                    <tr key={item.id} style={styles.row}>
                                        <td style={styles.tdTitle}>{item.title}</td>
                                        <td style={styles.td}>{item.subject}</td>
                                        <td style={styles.td}>{item.due}</td>
                                        <td style={styles.td}>
                                            <span style={getStatusStyle(item.status)}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td style={styles.td}>{item.grade}</td>
                                        <td style={{...styles.td, textAlign: 'right'}}>
                                            <button style={styles.actionBtn}>{item.action}</button>
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

// Helper for Status Badge Colors
const getStatusStyle = (status) => {
    const base = { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' };
    if (status === 'Pending') return { ...base, backgroundColor: '#FEF3C7', color: '#D97706' }; // Yellow
    if (status === 'Submitted') return { ...base, backgroundColor: '#DBEAFE', color: '#1E40AF' }; // Blue
    if (status === 'Graded') return { ...base, backgroundColor: '#D1FAE5', color: '#065F46' }; // Green
    return base;
};

const styles = {
    container: { display: 'flex', height: '100vh', backgroundColor: '#F9FAFB', fontFamily: "'Inter', sans-serif" },
    main: { marginLeft: '250px', flex: 1, display: 'flex', flexDirection: 'column' },
    content: { padding: '30px' },
    pageTitle: { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#111827' },
    
    // Tabs
    tabsContainer: { display: 'flex', gap: '20px', marginBottom: '20px', borderBottom: '1px solid #E5E7EB' },
    tab: { padding: '10px 0', background: 'transparent', border: 'none', cursor: 'pointer', color: '#6B7280', fontSize: '14px', marginRight: '10px' },
    activeTab: { padding: '10px 0', background: 'transparent', border: 'none', cursor: 'pointer', color: '#2563EB', fontSize: '14px', fontWeight: '600', borderBottom: '2px solid #2563EB', marginRight: '10px' },

    // Table
    tableCard: { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden', padding: '20px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    headerRow: { borderBottom: '1px solid #F3F4F6' },
    th: { textAlign: 'left', padding: '15px 10px', fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', fontWeight: '600' },
    row: { borderBottom: '1px solid #F9FAFB' },
    td: { padding: '15px 10px', fontSize: '14px', color: '#374151' },
    tdTitle: { padding: '15px 10px', fontSize: '14px', fontWeight: '500', color: '#111827' },
    
    actionBtn: { background: 'none', border: 'none', color: '#2563EB', fontWeight: '600', cursor: 'pointer' }
};

export default StudentAssignments;