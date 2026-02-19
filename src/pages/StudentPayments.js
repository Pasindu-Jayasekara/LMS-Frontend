import React, { useState } from 'react';
import { FaCreditCard, FaUniversity, FaExclamationTriangle, FaRegImage } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const StudentPayments = () => {
    const [paymentMethod, setPaymentMethod] = useState('card');

    // Dummy Payment History Data
    const history = [
        { id: 1, date: 'May 15, 2023', receipt: 'PMT12345', amount: 'Rs. 15,000', status: 'Completed' },
        { id: 2, date: 'Feb 10, 2023', receipt: 'PMT12344', amount: 'Rs. 15,000', status: 'Completed' },
    ];

    return (
        <div style={styles.container}>
            <Sidebar />
            
            <main style={styles.main}>
                <Header />
                
                <div style={styles.content}>
                    <h1 style={styles.pageTitle}>Payments</h1>

                    <div style={styles.splitLayout}>
                        
                        {/* --- LEFT COLUMN: PAYMENT FORM --- */}
                        <div style={styles.paymentCard}>
                            <h2 style={styles.sectionTitle}>Current Payment Due</h2>
                            
                            {/* Warning Banner */}
                            <div style={styles.warningBanner}>
                                <FaExclamationTriangle style={styles.warningIcon} />
                                <div>
                                    <strong style={styles.warningTitle}>Payment Reminder</strong>
                                    <p style={styles.warningText}>Your monthly fee payment of Rs. 3,500 is due on Sep 20, 2023.</p>
                                </div>
                            </div>

                            {/* Payment Summary */}
                            <div style={styles.summaryGrid}>
                                <div>
                                    <label style={styles.label}>Amount Due</label>
                                    <div style={styles.bigAmount}>Rs. 3,500</div>
                                </div>
                                <div>
                                    <label style={styles.label}>Due Date</label>
                                    <div style={styles.bigDate}>Sep 20, 2023</div>
                                </div>
                                <div>
                                    <label style={styles.label}>Course</label>
                                    <div style={styles.infoText}>A/L Science</div>
                                </div>
                                <div>
                                    <label style={styles.label}>Term</label>
                                    <div style={styles.infoText}>Term 3</div>
                                </div>
                            </div>

                            {/* Payment Method Selector (Only 2 options now) */}
                            <label style={{...styles.label, marginTop: '30px', display: 'block'}}>Select Payment Method</label>
                            <div style={styles.methodGrid}>
                                <div 
                                    style={paymentMethod === 'card' ? styles.methodCardActive : styles.methodCard}
                                    onClick={() => setPaymentMethod('card')}
                                >
                                    <FaCreditCard size={24} />
                                    <span>Credit/Debit Card</span>
                                </div>
                                <div 
                                    style={paymentMethod === 'bank' ? styles.methodCardActive : styles.methodCard}
                                    onClick={() => setPaymentMethod('bank')}
                                >
                                    <FaUniversity size={24} />
                                    <span>Bank Transfer</span>
                                </div>
                            </div>

                            {/* --- CONDITIONAL CONTENT --- */}

                            {/* 1. CARD PAYMENT FORM */}
                            {paymentMethod === 'card' && (
                                <div style={styles.formSection}>
                                    <h3 style={styles.subTitle}>Card Details</h3>
                                    
                                    <div style={styles.inputGroup}>
                                        <label style={styles.inputLabel}>Card Number</label>
                                        <input placeholder="1234 5678 9012 3456" style={styles.input} />
                                    </div>

                                    <div style={styles.row}>
                                        <div style={styles.inputGroup}>
                                            <label style={styles.inputLabel}>Expiry Date</label>
                                            <input placeholder="MM/YY" style={styles.input} />
                                        </div>
                                        <div style={styles.inputGroup}>
                                            <label style={styles.inputLabel}>CVV</label>
                                            <input placeholder="123" style={styles.input} />
                                        </div>
                                    </div>

                                    <div style={styles.inputGroup}>
                                        <label style={styles.inputLabel}>Cardholder Name</label>
                                        <input placeholder="John Doe" style={styles.input} />
                                    </div>
                                </div>
                            )}

                            {/* 2. BANK TRANSFER DETAILS (New Design) */}
                            {paymentMethod === 'bank' && (
                                <div style={styles.formSection}>
                                    <h3 style={styles.subTitle}>Bank Transfer Details</h3>
                                    <p style={styles.helperText}>Please transfer the amount to the following account and upload the receipt:</p>
                                    
                                    <div style={styles.bankDetailsBox}>
                                        <p style={styles.bankText}><strong>Bank:</strong> Commercial Bank</p>
                                        <p style={styles.bankText}><strong>Account Name:</strong> GCBT Institute</p>
                                        <p style={styles.bankText}><strong>Account Number:</strong> 1234-5678-9012-3456</p>
                                        <p style={styles.bankText}><strong>Branch:</strong> Badulla</p>
                                    </div>

                                    <label style={{...styles.inputLabel, marginTop: '20px', display: 'block'}}>Upload Receipt</label>
                                    <div style={styles.uploadBox}>
                                        <FaRegImage size={30} color="#9CA3AF" />
                                        <span style={styles.uploadLink}>Upload receipt</span>
                                        <span style={styles.uploadHint}>or drag and drop</span>
                                        <span style={styles.uploadSubHint}>PNG, JPG, PDF up to 10MB</span>
                                    </div>
                                </div>
                            )}

                            <button style={styles.payBtn}>Pay Rs. 3,500</button>
                        </div>

                        {/* --- RIGHT COLUMN: HISTORY --- */}
                        <div style={styles.historyCard}>
                            <h3 style={styles.sectionTitle}>Payment History</h3>
                            <div style={styles.historyList}>
                                {history.map(item => (
                                    <div key={item.id} style={styles.historyItem}>
                                        <div style={styles.historyHeader}>
                                            <strong>{item.date}</strong>
                                            <span style={styles.historyAmount}>{item.amount}</span>
                                        </div>
                                        <div style={styles.historySub}>
                                            <span>Receipt: {item.receipt}</span>
                                            <span style={styles.viewLink}>View Receipt</span>
                                        </div>
                                        <span style={styles.statusBadge}>{item.status}</span>
                                    </div>
                                ))}
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
    
    splitLayout: { display: 'flex', gap: '30px' },

    // Left Column
    paymentCard: { flex: 2, backgroundColor: '#fff', borderRadius: '12px', padding: '30px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    sectionTitle: { fontSize: '18px', fontWeight: '600', marginBottom: '20px', marginTop: 0 },
    
    warningBanner: { backgroundColor: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '8px', padding: '15px', display: 'flex', gap: '15px', marginBottom: '30px' },
    warningIcon: { color: '#D97706', fontSize: '20px', marginTop: '3px' },
    warningTitle: { color: '#B45309', display: 'block', marginBottom: '5px' },
    warningText: { margin: 0, fontSize: '14px', color: '#B45309' },

    summaryGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', paddingBottom: '20px', borderBottom: '1px solid #F3F4F6' },
    label: { fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', fontWeight: '600', marginBottom: '5px', display: 'block' },
    bigAmount: { fontSize: '24px', fontWeight: 'bold', color: '#111827' },
    bigDate: { fontSize: '18px', fontWeight: '600', color: '#111827' },
    infoText: { fontSize: '16px', color: '#374151' },

    methodGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '10px', marginBottom: '30px' },
    methodCard: { border: '1px solid #E5E7EB', borderRadius: '8px', padding: '25px', textAlign: 'center', cursor: 'pointer', color: '#374151', fontSize: '14px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' },
    methodCardActive: { border: '2px solid #2563EB', backgroundColor: '#fff', borderRadius: '8px', padding: '25px', textAlign: 'center', cursor: 'pointer', color: '#2563EB', fontSize: '14px', fontWeight: '600', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' },

    formSection: { marginBottom: '30px' },
    subTitle: { fontSize: '16px', marginBottom: '10px', color: '#374151', fontWeight: '600' },
    helperText: { fontSize: '14px', color: '#6B7280', marginBottom: '15px' },
    
    // Bank Transfer Styles
    bankDetailsBox: { backgroundColor: '#F9FAFB', padding: '20px', borderRadius: '8px', border: '1px solid #E5E7EB' },
    bankText: { margin: '5px 0', fontSize: '14px', color: '#374151' },
    
    uploadBox: { border: '2px dashed #D1D5DB', borderRadius: '8px', padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: '#fff' },
    uploadLink: { color: '#2563EB', fontWeight: '600', marginTop: '10px', fontSize: '14px' },
    uploadHint: { color: '#6B7280', fontSize: '14px', marginLeft: '5px' },
    uploadSubHint: { color: '#9CA3AF', fontSize: '12px', marginTop: '5px' },

    // Form Styles
    inputGroup: { marginBottom: '15px', flex: 1 },
    inputLabel: { fontSize: '13px', color: '#374151', marginBottom: '5px', display: 'block' },
    input: { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
    row: { display: 'flex', gap: '20px' },

    payBtn: { width: '100%', backgroundColor: '#1D4ED8', color: '#fff', padding: '15px', borderRadius: '8px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },

    // Right Column (History)
    historyCard: { flex: 1, backgroundColor: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', height: 'fit-content' },
    historyList: { display: 'flex', flexDirection: 'column', gap: '20px' },
    historyItem: { borderBottom: '1px solid #F3F4F6', paddingBottom: '15px' },
    historyHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '14px' },
    historyAmount: { fontWeight: 'bold' },
    historySub: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6B7280', marginBottom: '8px' },
    viewLink: { color: '#2563EB', cursor: 'pointer' },
    statusBadge: { backgroundColor: '#D1FAE5', color: '#065F46', fontSize: '11px', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }
};

export default StudentPayments;