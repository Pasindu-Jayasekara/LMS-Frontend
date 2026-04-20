import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaBookOpen, FaUpload, FaTimes } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';

const StudentAssignments = () => {
    const STUDENT_ID = sessionStorage.getItem('userId');
    const STUDENT_NAME = `${sessionStorage.getItem('firstName') || ''} ${sessionStorage.getItem('lastName') || ''}`.trim() || 'Student';

    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [uploadFile, setUploadFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchAssignments = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`http://localhost:5000/api/student/assignments/pending/${STUDENT_ID}`);
                setAssignments(res.data);
            } catch (err) {
                console.error('Error fetching assignments:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAssignments();
    }, [STUDENT_ID]);

    const formatDate = (isoDate) => {
        if (!isoDate) return '-';
        return new Date(isoDate).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    const openModal = (assignment) => {
        setSelectedAssignment(assignment);
        setUploadFile(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAssignment(null);
        setUploadFile(null);
    };

    const handleFileChange = (e) => {
        setUploadFile(e.target.files[0]);
    };

    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        if (!uploadFile || !selectedAssignment) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('assignment_id', selectedAssignment.assignment_id);
        formData.append('student_id', STUDENT_ID);
        formData.append('student_name', STUDENT_NAME);
        formData.append('file', uploadFile);

        try {
            await axios.post('http://localhost:5000/api/student/assignments/submit', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert('Assignment submitted successfully!');
            // Remove the submitted assignment from the local list
            setAssignments(prev => prev.filter(a => a.assignment_id !== selectedAssignment.assignment_id));
            closeModal();
        } catch (err) {
            console.error('Error submitting assignment:', err);
            alert('Failed to submit assignment. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={styles.container}>
            <Sidebar />
            <main style={styles.main}>
                <div style={styles.content}>
                    <h1 style={styles.pageTitle}>Upcoming Assignments</h1>
                    <p style={styles.subtitle}>Manage deliverables for your active active courses.</p>

                    {loading ? (
                        <p style={styles.emptyState}>Loading assignments...</p>
                    ) : assignments.length === 0 ? (
                        <div style={styles.emptyBox}>
                            <p style={styles.emptyText}>You have no upcoming assignments for your enrolled courses.</p>
                        </div>
                    ) : (
                        <div style={styles.grid}>
                            {assignments.map(item => (
                                <div key={item.assignment_id} style={styles.card}>
                                    <div style={styles.cardHeader}>
                                        <span style={styles.courseBadge}>
                                            <FaBookOpen style={{ marginRight: '6px' }}/> 
                                            {item.course_title}
                                        </span>
                                    </div>
                                    <div style={styles.cardBody}>
                                        <h3 style={styles.assignmentTitle}>{item.title}</h3>
                                        {item.description && <p style={styles.assignmentDesc}>{item.description}</p>}
                                        <div style={styles.dueDateRow}>
                                            <FaCalendarAlt color="#DC2626" />
                                            <span style={styles.dueDateText}>Due: {formatDate(item.due_date)}</span>
                                        </div>
                                        <button style={styles.actionBtn} onClick={() => openModal(item)}>
                                            <FaUpload style={{ marginRight: '6px' }}/> Submit Work
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* --- Submission Modal --- */}
                {isModalOpen && selectedAssignment && (
                    <div style={styles.modalOverlay}>
                        <div style={styles.modalContent}>
                            <div style={styles.modalHeader}>
                                <h2>Submit Assignment</h2>
                                <button onClick={closeModal} style={styles.closeBtn}><FaTimes /></button>
                            </div>
                            
                            <div style={styles.modalBody}>
                                <div style={styles.modalInfoBox}>
                                    <strong>{selectedAssignment.title}</strong>
                                    <p style={{ margin: '5px 0 0 0', fontSize: '14px', color: '#6B7280' }}>Submit your finalized document here.</p>
                                </div>

                                <form onSubmit={handleUploadSubmit} style={styles.formContainer}>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Student ID</label>
                                        <input type="text" value={STUDENT_ID} readOnly style={styles.readOnlyInput} />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Student Name</label>
                                        <input type="text" value={STUDENT_NAME} readOnly style={styles.readOnlyInput} />
                                    </div>
                                    <div style={styles.inputGroup}>
                                        <label style={styles.label}>Upload File (.pdf, .zip, .doc, .docx)</label>
                                        <input 
                                            type="file" 
                                            accept=".pdf,.zip,.doc,.docx,application/pdf,application/zip,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                                            onChange={handleFileChange} 
                                            style={styles.fileInput} 
                                            required 
                                        />
                                    </div>
                                    <button type="submit" style={styles.submitModalBtn} disabled={uploading}>
                                        {uploading ? 'Uploading...' : 'Upload & Submit'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

const styles = {
    container: { display: 'flex', height: '100vh', backgroundColor: '#F9FAFB', fontFamily: "'Inter', sans-serif" },
    main: { marginLeft: '250px', flex: 1, display: 'flex', flexDirection: 'column' },
    content: { padding: '40px', overflowY: 'auto' },
    
    pageTitle: { fontSize: '28px', fontWeight: '800', margin: '0 0 10px 0', color: '#111827' },
    subtitle: { fontSize: '15px', color: '#6B7280', margin: '0 0 40px 0' },

    emptyState: { color: '#6B7280', fontSize: '16px', fontStyle: 'italic' },
    emptyBox: { 
        backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px',
        padding: '50px', textAlign: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    },
    emptyText: { margin: 0, color: '#4B5563', fontSize: '16px', fontWeight: '500' },

    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' },
    
    card: { 
        backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s', ':hover': { transform: 'translateY(-2px)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }
    },
    cardHeader: { 
        backgroundColor: '#F3F4F6', padding: '15px 20px', borderBottom: '1px solid #E5E7EB'
    },
    courseBadge: { 
        display: 'inline-flex', alignItems: 'center', backgroundColor: '#DBEAFE', color: '#1E40AF',
        padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.5px'
    },
    cardBody: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 },
    assignmentTitle: { margin: 0, fontSize: '18px', fontWeight: '700', color: '#1F2937' },
    assignmentDesc: { margin: 0, fontSize: '14px', color: '#6B7280', lineHeight: 1.5 },
    dueDateRow: { display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto' },
    dueDateText: { fontSize: '14px', fontWeight: '600', color: '#DC2626' },
    
    actionBtn: { 
        marginTop: '10px', width: '100%', padding: '12px', backgroundColor: '#2563EB', color: '#fff',
        border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s'
    },

    // Modal Styles
    modalOverlay: {
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 1000, backdropFilter: 'blur(3px)'
    },
    modalContent: {
        backgroundColor: '#fff', borderRadius: '16px', width: '90%', maxWidth: '500px',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden'
    },
    modalHeader: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 25px', borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB'
    },
    closeBtn: {
        background: 'none', border: 'none', fontSize: '18px', color: '#9CA3AF', cursor: 'pointer',
        padding: '5px', display: 'flex', alignItems: 'center', transition: 'color 0.2s'
    },
    modalBody: { padding: '25px' },
    modalInfoBox: {
        backgroundColor: '#EFF6FF', padding: '15px', borderRadius: '8px', marginBottom: '20px',
        border: '1px solid #BFDBFE', color: '#1E3A8A'
    },
    formContainer: { display: 'flex', flexDirection: 'column', gap: '15px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '13px', fontWeight: '600', color: '#4B5563' },
    readOnlyInput: {
        padding: '10px 12px', borderRadius: '8px', border: '1px solid #D1D5DB',
        backgroundColor: '#F3F4F6', color: '#6B7280', fontSize: '14px', outline: 'none'
    },
    fileInput: {
        padding: '8px', border: '1px dashed #9CA3AF', borderRadius: '8px', fontSize: '14px'
    },
    submitModalBtn: {
        marginTop: '10px', width: '100%', padding: '14px', backgroundColor: '#10B981', color: '#fff',
        border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer',
        transition: 'background-color 0.2s'
    }
};

export default StudentAssignments;