import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUpload, FaHistory, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';

const StudentPayments = () => {
    const studentId = sessionStorage.getItem('userId') || 'S001';
    
    // Form and UI State
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [receiptFile, setReceiptFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState('');
    
    // History State
    const [history, setHistory] = useState([]);

    const months = [
        "January 2026", "February 2026", "March 2026", "April 2026",
        "May 2026", "June 2026", "July 2026", "August 2026", 
        "September 2026", "October 2026", "November 2026", "December 2026"
    ];

    const fetchCourses = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/payments/dues/${studentId}`);
            setCourses(response.data);
            if (response.data.length > 0) {
                setSelectedCourse(response.data[0].course_id);
            }
        } catch (err) {
            console.error('Failed to fetch courses', err);
        }
    };

    const fetchHistory = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/payments/history/${studentId}`);
            setHistory(response.data);
        } catch (err) {
            console.error('Failed to fetch history', err);
        }
    };

    useEffect(() => {
        fetchCourses();
        fetchHistory();
    }, [studentId]);

    const activeCourseObj = courses.find(c => c.course_id === selectedCourse);

    const handleFileChange = (e) => {
        setReceiptFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMsg('');

        if (!selectedCourse || !selectedMonth || !receiptFile) {
            setError('Please complete all form fields.');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('student_id', studentId);
        formData.append('course_id', selectedCourse);
        formData.append('payment_month', selectedMonth);
        formData.append('amount_paid', activeCourseObj.monthly_fee);
        formData.append('receipt', receiptFile);

        try {
            await axios.post('http://localhost:5000/api/payments/submit', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setSuccessMsg('Receipt uploaded successfully! It is now pending admin approval.');
            setReceiptFile(null);
            setSelectedMonth('');
            fetchHistory(); // Refresh history
        } catch (err) {
            console.error('Upload Error', err);
            setError('Failed to upload receipt. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const StatusBadge = ({ status }) => {
        if (status === 'Approved') return <span style={{...styles.badge, backgroundColor: '#D1FAE5', color: '#065F46'}}><FaCheckCircle /> Approved</span>;
        if (status === 'Rejected') return <span style={{...styles.badge, backgroundColor: '#FEE2E2', color: '#B91C1C'}}><FaTimesCircle /> Rejected</span>;
        return <span style={{...styles.badge, backgroundColor: '#FEF3C7', color: '#92400E'}}><FaClock /> Pending</span>;
    };

    return (
        <div style={styles.container}>
            <Sidebar />
            <main style={styles.main}>
                <div style={styles.content}>
                    <h1 style={styles.pageTitle}>Manual Payments</h1>
                    <div style={styles.splitLayout}>
                        
                        {/* LEFT COLUMN: SUBMIT PAYMENT */}
                        <div style={styles.card}>
                            <h2 style={styles.sectionTitle}><FaUpload style={{marginRight: '8px'}}/> Upload Bank Slip</h2>
                            <p style={styles.helperText}>Please select your course and month to upload your deposit slip.</p>
                            
                            {error && <div style={styles.errorBox}>{error}</div>}
                            {successMsg && <div style={styles.successBox}>{successMsg}</div>}

                            <form onSubmit={handleSubmit} style={styles.formContainer}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Select Course</label>
                                    <select 
                                        style={styles.selectInput}
                                        value={selectedCourse}
                                        onChange={(e) => setSelectedCourse(e.target.value)}
                                        required
                                    >
                                        {courses.length === 0 && <option value="">No Active Courses</option>}
                                        {courses.map(c => (
                                            <option key={c.course_id} value={c.course_id}>{c.title} ({c.course_id})</option>
                                        ))}
                                    </select>
                                </div>

                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Select Month</label>
                                    <select 
                                        style={styles.selectInput}
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        required
                                    >
                                        <option value="">-- Choose Month --</option>
                                        {months.map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                                </div>

                                <div style={styles.feeDisplay}>
                                    <span style={styles.feeLabel}>Amount to Deposit:</span>
                                    <span style={styles.feeAmount}>
                                        Rs. {activeCourseObj ? parseFloat(activeCourseObj.monthly_fee).toFixed(2) : '0.00'}
                                    </span>
                                </div>

                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Upload Slip (Image or PDF)</label>
                                    <input 
                                        type="file" 
                                        accept="image/png, image/jpeg, application/pdf"
                                        onChange={handleFileChange}
                                        style={styles.fileInput}
                                        required
                                    />
                                </div>

                                <button type="submit" style={styles.submitBtn} disabled={loading}>
                                    {loading ? 'Uploading...' : 'Submit Receipt'}
                                </button>
                            </form>
                        </div>

                        {/* RIGHT COLUMN: HISTORY */}
                        <div style={styles.card}>
                            <h2 style={styles.sectionTitle}><FaHistory style={{marginRight: '8px'}}/> Payment History</h2>
                            
                            <div style={styles.historyList}>
                                {history.length === 0 ? (
                                    <p style={{color: '#6B7280', fontSize: '14px', textAlign: 'center'}}>No payment history found.</p>
                                ) : (
                                    history.map(item => (
                                        <div key={item.payment_id} style={styles.historyItem}>
                                            <div style={styles.historyHeader}>
                                                <strong>{item.course_title}</strong>
                                                <span style={styles.historyAmount}>Rs. {item.amount_paid}</span>
                                            </div>
                                            <div style={styles.historySub}>
                                                <span>Month: {item.payment_month}</span>
                                                <span>Date: {new Date(item.submitted_at).toLocaleDateString()}</span>
                                            </div>
                                            <div style={{marginTop: '10px'}}>
                                                <StatusBadge status={item.status} />
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

const styles = {
    container: { display: 'flex', height: '100vh', backgroundColor: '#F9FAFB', fontFamily: "'Inter', sans-serif" },
    main: { marginLeft: '250px', flex: 1, display: 'flex', flexDirection: 'column' },
    content: { padding: '30px', overflowY: 'auto' },
    pageTitle: { fontSize: '24px', fontWeight: 'bold', marginBottom: '25px', color: '#111827' },
    splitLayout: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },
    card: { backgroundColor: '#fff', borderRadius: '12px', padding: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', height: 'fit-content' },
    sectionTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '10px', marginTop: 0, display: 'flex', alignItems: 'center', color: '#374151' },
    helperText: { fontSize: '14px', color: '#6B7280', marginBottom: '20px' },
    
    errorBox: { backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px' },
    successBox: { backgroundColor: '#D1FAE5', color: '#065F46', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px' },
    
    formContainer: { display: 'flex', flexDirection: 'column', gap: '20px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '13px', fontWeight: '600', color: '#4B5563', textTransform: 'uppercase' },
    selectInput: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '15px', outline: 'none' },
    fileInput: { width: '100%', padding: '10px', border: '1px dashed #D1D5DB', borderRadius: '8px' },
    
    feeDisplay: { backgroundColor: '#EFF6FF', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    feeLabel: { fontSize: '14px', color: '#1E3A8A', fontWeight: '600' },
    feeAmount: { fontSize: '20px', color: '#1E40AF', fontWeight: 'bold' },

    submitBtn: { width: '100%', backgroundColor: '#2563EB', color: '#fff', padding: '15px', borderRadius: '8px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.2s' },

    historyList: { display: 'flex', flexDirection: 'column', gap: '15px' },
    historyItem: { border: '1px solid #E5E7EB', borderRadius: '8px', padding: '15px', backgroundColor: '#F9FAFB' },
    historyHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '16px', color: '#111827' },
    historyAmount: { fontWeight: 'bold', color: '#059669' },
    historySub: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6B7280' },
    badge: { display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', padding: '4px 10px', borderRadius: '12px', fontWeight: '600' }
};

export default StudentPayments;