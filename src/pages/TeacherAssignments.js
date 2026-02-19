import React, { useState } from 'react';
import { FaSearch, FaEye, FaEdit, FaFilePdf, FaFileWord } from 'react-icons/fa';
import TeacherSidebar from '../components/TeacherSidebar';
import Header from '../components/Header';

const TeacherAssignments = () => {
    // 1. State for selected assignment
    const [selectedId, setSelectedId] = useState(1);

    // 2. Simple Dummy Data
    const assignments = [
        { id: 1, title: 'Math Problem Set 3', course: 'Adv. Math', due: 'Jun 15', submitted: 28, total: 32, status: 'Active' },
        { id: 2, title: 'Physics Lab Report', course: 'Physics 101', due: 'Jun 20', submitted: 15, total: 28, status: 'Active' },
        { id: 3, title: 'Literary Analysis', course: 'English Lit', due: 'Jun 10', submitted: 35, total: 35, status: 'Past' },
    ];

    const submissions = [
        { id: 1, name: 'Emma Wilson', file: 'math_hw.pdf', grade: '95/100', feedback: 'Excellent' },
        { id: 2, name: 'James Johnson', file: 'prob_set.docx', grade: '88/100', feedback: 'Good work' },
        { id: 3, name: 'Noah Davis', file: 'math_v2.pdf', grade: 'Pending', feedback: '-' },
    ];

    // Get current active assignment data
    const active = assignments.find(a => a.id === selectedId);

    return (
        <div style={styles.container}>
            <TeacherSidebar />
            <main style={styles.main}>
                <Header title="Assignments" />
                
                <div style={styles.content}>
                    
                    {/* --- LEFT: Assignment List --- */}
                    <div style={styles.listPanel}>
                        <h3 style={{marginTop: 0}}>Assignments</h3>
                        <div style={styles.search}><FaSearch color="#888"/><span style={{marginLeft:10}}>Search...</span></div>
                        
                        {assignments.map(item => (
                            <div 
                                key={item.id} 
                                style={selectedId === item.id ? styles.cardActive : styles.card}
                                onClick={() => setSelectedId(item.id)}
                            >
                                <strong>{item.title}</strong>
                                <div style={{fontSize: 12, marginTop: 5}}>
                                    {item.course} • Due {item.due}
                                </div>
                                <div style={{fontSize: 12, marginTop: 5, color: selectedId === item.id ? '#ddd':'#666'}}>
                                    {item.submitted}/{item.total} Submitted
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* --- RIGHT: Details & Grading --- */}
                    <div style={styles.detailPanel}>
                        {/* Header */}
                        <div style={styles.detailHeader}>
                            <h2>{active.title}</h2>
                            <div style={{display:'flex', gap: 10}}>
                                <button style={styles.btn}><FaEye/> View</button>
                                <button style={styles.btn}><FaEdit/> Edit</button>
                            </div>
                        </div>

                        {/* Stats Cards (From Image) */}
                        <div style={styles.statsGrid}>
                            <div style={styles.statBox}>
                                <small>Total Students</small>
                                <h2>{active.total}</h2>
                            </div>
                            <div style={styles.statBox}>
                                <small>Submissions</small>
                                <h2 style={{color: '#16A34A'}}>{active.submitted}</h2>
                            </div>
                            <div style={styles.statBox}>
                                <small>Pending</small>
                                <h2 style={{color: '#D97706'}}>{active.total - active.submitted}</h2>
                            </div>
                        </div>

                        {/* Grading Table (From Image) */}
                        <h3>Submissions</h3>
                        <table style={styles.table}>
                            <thead>
                                <tr style={{textAlign:'left', color:'#666', borderBottom:'1px solid #eee'}}>
                                    <th style={{padding:10}}>Student</th>
                                    <th style={{padding:10}}>File</th>
                                    <th style={{padding:10}}>Grade</th>
                                    <th style={{padding:10}}>Feedback</th>
                                </tr>
                            </thead>
                            <tbody>
                                {submissions.map(sub => (
                                    <tr key={sub.id} style={{borderBottom:'1px solid #f9f9f9'}}>
                                        <td style={{padding:15, fontWeight:'bold'}}>{sub.name}</td>
                                        <td style={{padding:15, color:'#2563EB'}}>
                                            {sub.file.includes('pdf') ? <FaFilePdf/> : <FaFileWord/>} {sub.file}
                                        </td>
                                        <td style={{padding:15}}>
                                            <span style={sub.grade === 'Pending' ? styles.badgePending : styles.badgeDone}>
                                                {sub.grade}
                                            </span>
                                        </td>
                                        <td style={{padding:15}}>{sub.feedback}</td>
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

const styles = {
    container: { display: 'flex', height: '100vh', background: '#F3F4F6', fontFamily: 'sans-serif' },
    main: { marginLeft: '250px', flex: 1, display: 'flex', flexDirection: 'column' },
    content: { padding: '20px', display: 'flex', gap: '20px', height: '90%' },

    // Left Panel Styles
    listPanel: { width: '300px', background: '#fff', padding: '20px', borderRadius: '10px', overflowY: 'auto' },
    search: { background: '#f0f0f0', padding: '8px', borderRadius: '5px', marginBottom: '15px', display:'flex', alignItems:'center', color: '#888' },
    card: { padding: '15px', border: '1px solid #eee', borderRadius: '8px', marginBottom: '10px', cursor: 'pointer' },
    cardActive: { padding: '15px', border: '1px solid #2563EB', borderRadius: '8px', marginBottom: '10px', cursor: 'pointer', background: '#2563EB', color: '#fff' },

    // Right Panel Styles
    detailPanel: { flex: 1, background: '#fff', padding: '30px', borderRadius: '10px', overflowY: 'auto' },
    detailHeader: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '20px' },
    btn: { background: '#fff', border: '1px solid #ddd', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', display:'flex', gap:5, alignItems:'center' },
    
    // Stats
    statsGrid: { display: 'flex', gap: '20px', marginBottom: '30px' },
    statBox: { flex: 1, background: '#f9f9f9', padding: '15px', borderRadius: '8px', textAlign: 'center' },

    // Table
    table: { width: '100%', borderCollapse: 'collapse' },
    badgeDone: { background: '#fff', color: '#000', fontWeight: 'bold' },
    badgePending: { background: '#FEF3C7', color: '#B45309', padding: '4px 8px', borderRadius: '5px', fontSize: 12 }
};

export default TeacherAssignments;