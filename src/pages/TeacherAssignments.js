import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch, FaEye, FaEdit, FaFilePdf, FaFileWord, FaTimes } from 'react-icons/fa';
import TeacherSidebar from '../components/TeacherSidebar';


const TeacherAssignments = () => {
    const loggedInTeacherId = sessionStorage.getItem('userId') || 'T2701';

    const [assignments, setAssignments] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [showGradeModal, setShowGradeModal] = useState(false);
    const [activeSubmission, setActiveSubmission] = useState(null);
    const [gradeForm, setGradeForm] = useState({ grade: '', feedback: '' });

    // Fetch Global Assignments
    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/assignments/teacher/${loggedInTeacherId}`);
                setAssignments(res.data);
                if (res.data.length > 0) setSelectedId(res.data[0].id);
            } catch (error) {
                console.error("Failed to load global assignments", error);
            }
        };
        fetchAssignments();
    }, []);

    // Fetch Target Details when ID changes
    useEffect(() => {
        if (!selectedId) return;
        const fetchDetails = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/assignments/details/${selectedId}`);
                setSubmissions(res.data.submissions);
            } catch (error) {
                console.error("Failed to fetch assignment details", error);
            }
        };
        fetchDetails();
    }, [selectedId]);

    const active = assignments.find(a => a.id === selectedId) || {};
    const filteredAssignments = assignments.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));

    // Handlers
    const openGradeModal = (sub) => {
        if (!sub.submission_id) return alert("Student hasn't submitted a file yet!");
        setActiveSubmission(sub);
        setGradeForm({ grade: sub.grade === 'Pending' ? '' : sub.grade, feedback: sub.feedback === '-' ? '' : sub.feedback });
        setShowGradeModal(true);
    };

    const submitGrade = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/assignments/grade/${activeSubmission.submission_id}`, gradeForm);
            alert("Grade Successfully Updated!");
            setShowGradeModal(false);
            
            // Refetch details
            const res = await axios.get(`http://localhost:5000/api/assignments/details/${selectedId}`);
            setSubmissions(res.data.submissions);
        } catch (error) {
            console.error("Error submitting grade", error);
            alert("Failed to assign grade.");
        }
    };

    return (
        <div style={styles.container}>
            <TeacherSidebar />
            <main style={styles.main}>                
                <div style={styles.content}>
                    
                    {/* --- LEFT: Assignment List --- */}
                    <div style={styles.listPanel}>
                        <h3 style={{marginTop: 0}}>Assignments</h3>
                        <div style={styles.search}>
                            <FaSearch color="#888"/>
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                style={{border: 'none', background: 'transparent', outline: 'none', marginLeft: 10, width: '100%'}} 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        {filteredAssignments.map(item => {
                            const formattedDate = new Date(item.due).toLocaleDateString();
                            return (
                                <div 
                                    key={item.id} 
                                    style={selectedId === item.id ? styles.cardActive : styles.card}
                                    onClick={() => setSelectedId(item.id)}
                                >
                                    <strong>{item.title}</strong>
                                    <div style={{fontSize: 12, marginTop: 5}}>
                                        {item.course} • Due {formattedDate}
                                    </div>
                                    <div style={{fontSize: 12, marginTop: 5, color: selectedId === item.id ? '#ddd':'#666'}}>
                                        {item.submitted}/{item.total} Submitted
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* --- RIGHT: Details & Grading --- */}
                    <div style={styles.detailPanel}>
                        {active.id ? (
                            <>
                                {/* Header */}
                                <div style={styles.detailHeader}>
                                    <h2>{active.title}</h2>
                                    <div style={{display:'flex', gap: 10}}>
                                        <button style={styles.btn}><FaEye/> View</button>
                                        <button style={styles.btn}><FaEdit/> Edit</button>
                                    </div>
                                </div>

                                {/* Stats Cards */}
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

                                {/* Grading Table */}
                                <h3>Submissions</h3>
                                <div style={{overflowX: 'auto'}}>
                                    <table style={styles.table}>
                                        <thead>
                                            <tr style={{textAlign:'left', color:'#666', borderBottom:'1px solid #eee'}}>
                                                <th style={{padding:15}}>Student</th>
                                                <th style={{padding:15}}>File</th>
                                                <th style={{padding:15}}>Grade</th>
                                                <th style={{padding:15}}>Feedback</th>
                                                <th style={{padding:15}}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {submissions.map(sub => (
                                                <tr key={sub.id} style={{borderBottom:'1px solid #f9f9f9'}}>
                                                    <td style={{padding:15, fontWeight:'bold'}}>{sub.name}</td>
                                                    <td style={{padding:15, color:'#2563EB'}}>
                                                        {sub.file ? (
                                                            <a href={`http://localhost:5000${sub.file}`} target="_blank" rel="noreferrer" style={{color: '#2563EB', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px'}}>
                                                                {sub.file.includes('.pdf') ? <FaFilePdf/> : <FaFileWord/>} View File
                                                            </a>
                                                        ) : (
                                                            <span style={{color: '#9CA3AF'}}>-</span>
                                                        )}
                                                    </td>
                                                    <td style={{padding:15}}>
                                                        <span style={sub.grade === 'Pending' ? styles.badgePending : styles.badgeDone}>
                                                            {sub.grade}
                                                        </span>
                                                    </td>
                                                    <td style={{padding:15}}>{sub.feedback}</td>
                                                    <td style={{padding:15}}>
                                                        <button 
                                                            style={{...styles.btn, fontSize: 13, padding: '6px 12px', background: sub.submission_id ? '#fff' : '#f3f4f6', cursor: sub.submission_id ? 'pointer' : 'not-allowed', color: sub.submission_id ? '#2563EB' : '#9CA3AF'}} 
                                                            onClick={() => openGradeModal(sub)}
                                                            disabled={!sub.submission_id}
                                                        >
                                                            {sub.grade === 'Pending' ? 'Grade' : 'Edit'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        ) : (
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9CA3AF'}}>
                                Select an assignment to view details.
                            </div>
                        )}
                    </div>

                </div>
            </main>

            {/* --- MODAL --- */}
            {showGradeModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <h3 style={{margin: 0}}>Grade: {activeSubmission.name}</h3>
                            <FaTimes style={{cursor: 'pointer', color: '#9CA3AF'}} onClick={() => setShowGradeModal(false)} />
                        </div>
                        <form onSubmit={submitGrade}>
                            <div style={{padding: 20}}>
                                <div style={{marginBottom: 15}}>
                                    <label style={{display: 'block', marginBottom: 8, fontWeight: 600}}>Score (out of 100)</label>
                                    <input 
                                        type="number" 
                                        max="100" 
                                        min="0" 
                                        required 
                                        style={styles.input} 
                                        value={gradeForm.grade}
                                        onChange={e => setGradeForm({...gradeForm, grade: e.target.value})}
                                    />
                                </div>
                                <div style={{marginBottom: 15}}>
                                    <label style={{display: 'block', marginBottom: 8, fontWeight: 600}}>Feedback</label>
                                    <textarea 
                                        rows="4" 
                                        style={styles.input} 
                                        value={gradeForm.feedback}
                                        onChange={e => setGradeForm({...gradeForm, feedback: e.target.value})}
                                        placeholder="Excellent work on..."
                                    ></textarea>
                                </div>
                            </div>
                            <div style={styles.modalFooter}>
                                <button type="button" style={{...styles.btn, background: 'transparent'}} onClick={() => setShowGradeModal(false)}>Cancel</button>
                                <button type="submit" style={{...styles.btn, background: '#2563EB', color: '#fff', border: 'none'}}>Save Grade</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { display: 'flex', height: '100vh', background: '#F3F4F6', fontFamily: 'sans-serif' },
    main: { marginLeft: '250px', flex: 1, display: 'flex', flexDirection: 'column' },
    content: { padding: '20px', display: 'flex', gap: '20px', height: '95%' },

    // Left Panel Styles
    listPanel: { width: '300px', background: '#fff', padding: '20px', borderRadius: '10px', overflowY: 'auto' },
    search: { background: '#f0f0f0', padding: '8px', borderRadius: '5px', marginBottom: '15px', display:'flex', alignItems:'center', color: '#888' },
    card: { padding: '15px', border: '1px solid #eee', borderRadius: '8px', marginBottom: '10px', cursor: 'pointer', transition: 'all 0.2s', },
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
    badgeDone: { background: '#D1FAE5', color: '#065F46', fontWeight: 'bold', padding: '4px 8px', borderRadius: '5px', fontSize: 12 },
    badgePending: { background: '#FEF3C7', color: '#B45309', padding: '4px 8px', borderRadius: '5px', fontSize: 12 },

    // Modal
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(17,24,39,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalContent: { background: '#fff', width: '400px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #eee' },
    input: { width: '100%', boxSizing: 'border-box', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontFamily: 'inherit' },
    modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '20px', background: '#F9FAFB', borderTop: '1px solid #eee' }
};

export default TeacherAssignments;