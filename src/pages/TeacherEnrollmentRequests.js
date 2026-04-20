import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaUserGraduate, FaSpinner } from 'react-icons/fa';
import TeacherSidebar from '../components/TeacherSidebar';

// Hardcoded teacher ID — replace with sessionStorage/auth once login is integrated
const TEACHER_ID = sessionStorage.getItem('userId') || 'T2701';

const TeacherEnrollmentRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    // ─── Fetch all pending enrollment requests ────────────────────────────────
    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `http://localhost:5000/api/teacher-courses/pending-requests/${TEACHER_ID}`
            );
            setRequests(res.data);
        } catch (err) {
            console.error('Error fetching enrollment requests:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    // ─── Approve or Reject a request ─────────────────────────────────────────
    const handleAction = async (enrollmentId, newStatus) => {
        setProcessingId(enrollmentId);
        try {
            await axios.put('http://localhost:5000/api/teacher-courses/handle-request', {
                enrollment_id: enrollmentId,
                new_status: newStatus,
            });
            const label = newStatus === 'Active' ? 'approved' : 'rejected';
            alert(`Enrollment request ${label} successfully!`);
            // Remove the handled row from the list (no need to refetch)
            setRequests(prev => prev.filter(r => r.enrollment_id !== enrollmentId));
        } catch (err) {
            console.error(`Error ${newStatus === 'Active' ? 'approving' : 'rejecting'} request:`, err);
            alert(err.response?.data?.message || 'Failed to process request');
        } finally {
            setProcessingId(null);
        }
    };

    const formatDate = (isoStr) => {
        if (!isoStr) return '';
        return new Date(isoStr).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };

    return (
        <div style={styles.container}>
            <TeacherSidebar />

            <main style={styles.main}>
                <div style={styles.content}>

                    {/* Page Header */}
                    <div style={styles.pageHeader}>
                        <div>
                            <h2 style={styles.pageTitle}>
                                <FaUserGraduate style={{ marginRight: 10, color: '#2563EB' }} />
                                Enrollment Requests
                            </h2>
                            <p style={styles.subText}>
                                Review and approve or reject students requesting to join your courses.
                            </p>
                        </div>
                        <div style={styles.countBadge}>
                            {requests.length} Pending
                        </div>
                    </div>

                    {/* Requests Table Card */}
                    <div style={styles.card}>
                        {loading ? (
                            <div style={styles.emptyState}>
                                <FaSpinner style={{ animation: 'spin 1s linear infinite', marginRight: 8 }} />
                                Loading requests...
                            </div>
                        ) : requests.length === 0 ? (
                            <div style={styles.emptyState}>
                                <FaUserGraduate size={32} color="#D1D5DB" />
                                <p style={{ color: '#9CA3AF', marginTop: 12 }}>No pending enrollment requests.</p>
                            </div>
                        ) : (
                            <table style={styles.table}>
                                <thead>
                                    <tr style={styles.headerRow}>
                                        <th style={styles.th}>Student</th>
                                        <th style={styles.th}>Student ID</th>
                                        <th style={styles.th}>Course</th>
                                        <th style={styles.th}>Date Requested</th>
                                        <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map(req => {
                                        const isProcessing = processingId === req.enrollment_id;
                                        return (
                                            <tr key={req.enrollment_id} style={styles.row}>
                                                {/* Student Name with avatar initial */}
                                                <td style={styles.tdName}>
                                                    <div style={styles.nameRow}>
                                                        <div style={styles.avatarCircle}>
                                                            {req.student_name.charAt(0).toUpperCase()}
                                                        </div>
                                                        {req.student_name}
                                                    </div>
                                                </td>
                                                <td style={styles.td}>
                                                    <span style={styles.idPill}>{req.student_id}</span>
                                                </td>
                                                <td style={styles.td}>{req.course_title}</td>
                                                <td style={styles.td}>{formatDate(req.requested_at)}</td>

                                                {/* Approve / Reject buttons */}
                                                <td style={{ ...styles.td, textAlign: 'right' }}>
                                                    <div style={styles.actionGroup}>
                                                        <button
                                                            style={styles.approveBtn}
                                                            disabled={isProcessing}
                                                            onClick={() => handleAction(req.enrollment_id, 'Active')}
                                                            title="Approve"
                                                        >
                                                            {isProcessing
                                                                ? <FaSpinner />
                                                                : <><FaCheck style={{ marginRight: 5 }} /> Approve</>
                                                            }
                                                        </button>
                                                        <button
                                                            style={styles.rejectBtn}
                                                            disabled={isProcessing}
                                                            onClick={() => handleAction(req.enrollment_id, 'Rejected')}
                                                            title="Reject"
                                                        >
                                                            <FaTimes style={{ marginRight: 5 }} /> Reject
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
};

const styles = {
    container: { display: 'flex', height: '100vh', backgroundColor: '#F9FAFB', fontFamily: 'sans-serif' },
    main: { marginLeft: '250px', flex: 1, display: 'flex', flexDirection: 'column' },
    content: { padding: '30px', overflowY: 'auto' },

    pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' },
    pageTitle: { margin: 0, fontSize: '22px', color: '#111827', display: 'flex', alignItems: 'center' },
    subText: { margin: '5px 0 0 0', color: '#6B7280', fontSize: '14px' },
    countBadge: { backgroundColor: '#FEF3C7', color: '#D97706', fontWeight: 'bold', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', alignSelf: 'center' },

    // Table Card
    card: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },

    table: { width: '100%', borderCollapse: 'collapse' },
    headerRow: { backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' },
    th: { textAlign: 'left', padding: '14px 20px', fontSize: '12px', color: '#6B7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' },
    row: { borderBottom: '1px solid #F3F4F6', transition: 'background 0.15s' },
    td: { padding: '16px 20px', fontSize: '14px', color: '#374151', verticalAlign: 'middle' },
    tdName: { padding: '16px 20px', fontSize: '14px', fontWeight: '600', color: '#111827', verticalAlign: 'middle' },

    // Student name with avatar
    nameRow: { display: 'flex', alignItems: 'center', gap: '10px' },
    avatarCircle: { width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#DBEAFE', color: '#1E40AF', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 },
    idPill: { backgroundColor: '#F3F4F6', color: '#4B5563', padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600' },

    // Action buttons
    actionGroup: { display: 'flex', gap: '8px', justifyContent: 'flex-end' },
    approveBtn: { display: 'flex', alignItems: 'center', backgroundColor: '#059669', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '7px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },
    rejectBtn: { display: 'flex', alignItems: 'center', backgroundColor: '#DC2626', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '7px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' },

    emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', color: '#9CA3AF', fontSize: '14px' },
};

export default TeacherEnrollmentRequests;
