import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMoneyCheckAlt, FaCheck, FaTimes, FaExternalLinkAlt } from 'react-icons/fa';
import AdminSidebar from '../components/AdminSidebar';

const AdminPayments = () => {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPending = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/payments/pending');
            setPending(response.data);
        } catch (error) {
            console.error("Error fetching pending payments:", error);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handlePayment = async (payment_id, new_status) => {
        if (!window.confirm(`Are you sure you want to ${new_status} this payment?`)) return;
        
        setLoading(true);
        try {
            await axios.put('http://localhost:5000/api/admin/payments/handle', { payment_id, new_status });
            fetchPending(); // refresh list
        } catch (error) {
            console.error(`Error trying to ${new_status} payment:`, error);
            alert("Failed to update status.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.sidebarWrapper}>
                <AdminSidebar />
            </div>

            <main style={styles.main}>
                <div style={styles.content}>
                    <div style={styles.pageHeader}>
                        <h2 style={styles.pageTitle}><FaMoneyCheckAlt style={{marginRight: 10, color: '#2563EB'}}/> Payment Approvals</h2>
                        <p style={styles.subText}>Review and approve manual bank slip uploads from students.</p>
                    </div>

                    <div style={styles.card}>
                        {pending.length === 0 ? (
                            <p style={{padding: '20px', textAlign: 'center', color: '#6B7280'}}>No pending payments to review.</p>
                        ) : (
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Student</th>
                                        <th style={styles.th}>Course</th>
                                        <th style={styles.th}>Month</th>
                                        <th style={styles.th}>Amount</th>
                                        <th style={styles.th}>Date Submitted</th>
                                        <th style={styles.th}>Receipt</th>
                                        <th style={styles.th}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pending.map(p => (
                                        <tr key={p.payment_id} style={styles.tr}>
                                            <td style={styles.td}>
                                                <strong>{p.first_name} {p.last_name}</strong><br/>
                                                <span style={{fontSize: '12px', color: '#6B7280'}}>{p.student_id}</span>
                                            </td>
                                            <td style={styles.td}>{p.course_title}</td>
                                            <td style={styles.td}>{p.payment_month}</td>
                                            <td style={styles.td} style={{...styles.td, fontWeight: 'bold', color: '#111827'}}>Rs. {p.amount_paid}</td>
                                            <td style={styles.td}>{new Date(p.submitted_at).toLocaleDateString()}</td>
                                            <td style={styles.td}>
                                                <a 
                                                    href={`http://localhost:5000/${p.receipt_url}`} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    style={styles.link}
                                                >
                                                    View Receipt <FaExternalLinkAlt size={10} />
                                                </a>
                                            </td>
                                            <td style={styles.td}>
                                                <div style={styles.actionButtons}>
                                                    <button 
                                                        style={{...styles.btn, backgroundColor: '#10B981'}} 
                                                        onClick={() => handlePayment(p.payment_id, 'Approved')}
                                                        disabled={loading}
                                                    >
                                                        <FaCheck /> Approve
                                                    </button>
                                                    <button 
                                                        style={{...styles.btn, backgroundColor: '#EF4444'}} 
                                                        onClick={() => handlePayment(p.payment_id, 'Rejected')}
                                                        disabled={loading}
                                                    >
                                                        <FaTimes /> Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
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
    container: { display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#F9FAFB', fontFamily: 'sans-serif', overflow: 'hidden' },
    sidebarWrapper: { width: '250px', flexShrink: 0, height: '100%', overflowY: 'auto' },
    main: { flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' },
    content: { flex: 1, overflowY: 'auto', padding: '30px', boxSizing: 'border-box' },
    pageHeader: { marginBottom: '25px' },
    pageTitle: { margin: 0, fontSize: '24px', color: '#111827', display: 'flex', alignItems: 'center' },
    subText: { margin: '5px 0 0 0', color: '#6B7280', fontSize: '14px' },
    card: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th: { backgroundColor: '#F3F4F6', padding: '15px', fontSize: '13px', fontWeight: 'bold', color: '#4B5563', textTransform: 'uppercase', borderBottom: '2px solid #E5E7EB' },
    tr: { borderBottom: '1px solid #E5E7EB' },
    td: { padding: '15px', fontSize: '14px', color: '#374151', verticalAlign: 'middle' },
    link: { color: '#2563EB', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' },
    actionButtons: { display: 'flex', gap: '10px' },
    btn: { color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }
};

export default AdminPayments;
