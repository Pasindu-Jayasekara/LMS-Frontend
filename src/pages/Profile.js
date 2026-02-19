import React, { useState, useEffect } from 'react';
import { 
    FaUser, FaEnvelope, FaPhone, 
    FaMapMarkerAlt, FaCalendarAlt, FaCamera 
} from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Profile = () => {
    // 1. Initialize State with Dummy Data (Replace with API data later)
    const [user, setUser] = useState({
        firstName: 'Pasindu',
        lastName: 'Silva',
        email: 'pasindu@example.com',
        phone: '+94 71 234 5678',
        address: '123 Main Street, Badulla',
        dob: '2000-05-15',
        role: 'Student',
        id: 'ST001'
    });

    // Load user from local storage if available
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            // Merge stored data with state (simplified for demo)
            setUser(prev => ({ ...prev, ...parsed }));
        }
    }, []);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        alert("Profile updated successfully!");
        // Here you would add: axios.put('/api/user/update', user)
    };

    return (
        <div style={styles.container}>
            {/* Sidebar Wrapper */}
            <div style={styles.sidebarWrapper}>
                <Sidebar />
            </div>

            <main style={styles.main}>
                {/* Header Wrapper */}
                <div style={styles.headerWrapper}>
                    <Header title="My Profile" />
                </div>
                
                {/* Scrollable Content */}
                <div style={styles.content}>
                    
                    {/* Profile Card Container */}
                    <div style={styles.card}>
                        
                        {/* 1. Header Section with Avatar */}
                        <div style={styles.profileHeader}>
                            <div style={styles.avatarContainer}>
                                <div style={styles.avatar}>
                                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                </div>
                                <div style={styles.cameraIcon}>
                                    <FaCamera size={12} color="#fff"/>
                                </div>
                            </div>
                            <div>
                                <h2 style={styles.nameTitle}>{user.firstName} {user.lastName}</h2>
                                <p style={styles.idText}>{user.role} ID: {user.id}</p>
                            </div>
                        </div>

                        <hr style={styles.divider} />

                        {/* 2. Form Section */}
                        <div style={styles.formGrid}>
                            
                            {/* Left Column: Personal Info */}
                            <div style={styles.column}>
                                <h3 style={styles.sectionTitle}>Personal Information</h3>
                                
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>First Name</label>
                                    <div style={styles.inputWrapper}>
                                        <FaUser style={styles.icon} />
                                        <input 
                                            name="firstName" 
                                            value={user.firstName} 
                                            onChange={handleChange} 
                                            style={styles.input} 
                                        />
                                    </div>
                                </div>

                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Last Name</label>
                                    <div style={styles.inputWrapper}>
                                        <FaUser style={styles.icon} />
                                        <input 
                                            name="lastName" 
                                            value={user.lastName} 
                                            onChange={handleChange} 
                                            style={styles.input} 
                                        />
                                    </div>
                                </div>

                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Email Address</label>
                                    <div style={styles.inputWrapper}>
                                        <FaEnvelope style={styles.icon} />
                                        <input 
                                            name="email" 
                                            value={user.email} 
                                            onChange={handleChange} 
                                            style={styles.input} 
                                            disabled // Usually email shouldn't be changed easily
                                        />
                                    </div>
                                </div>

                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Phone Number</label>
                                    <div style={styles.inputWrapper}>
                                        <FaPhone style={styles.icon} />
                                        <input 
                                            name="phone" 
                                            value={user.phone} 
                                            onChange={handleChange} 
                                            style={styles.input} 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Additional Info */}
                            <div style={styles.column}>
                                <h3 style={styles.sectionTitle}>Additional Information</h3>
                                
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Address</label>
                                    <div style={styles.inputWrapper}>
                                        <FaMapMarkerAlt style={styles.icon} />
                                        <input 
                                            name="address" 
                                            value={user.address} 
                                            onChange={handleChange} 
                                            style={styles.input} 
                                        />
                                    </div>
                                </div>

                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Date of Birth</label>
                                    <div style={styles.inputWrapper}>
                                        <FaCalendarAlt style={styles.icon} />
                                        <input 
                                            type="date"
                                            name="dob" 
                                            value={user.dob} 
                                            onChange={handleChange} 
                                            style={styles.input} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Action Buttons */}
                        <div style={styles.buttonRow}>
                            <button style={styles.saveBtn} onClick={handleSave}>Save Changes</button>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

// --- STYLES ---
const styles = {
    // Layout Logic (Matches the StudentDashboard fix)
    container: { display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#F9FAFB', fontFamily: 'sans-serif', overflow: 'hidden' },
    sidebarWrapper: { width: '250px', flexShrink: 0, height: '100%', overflowY: 'auto' },
    main: { flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' },
    headerWrapper: { flexShrink: 0 },
    content: { flex: 1, overflowY: 'auto', padding: '30px', boxSizing: 'border-box' },

    // Card Styles
    card: { backgroundColor: '#fff', borderRadius: '12px', padding: '40px', border: '1px solid #E5E7EB', maxWidth: '1000px', margin: '0 auto' },
    
    // Header Section
    profileHeader: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' },
    avatarContainer: { position: 'relative' },
    avatar: { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#E0E7FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold' },
    cameraIcon: { position: 'absolute', bottom: '0', right: '0', backgroundColor: '#2563EB', padding: '6px', borderRadius: '50%', border: '2px solid #fff', cursor: 'pointer' },
    nameTitle: { margin: '0 0 5px 0', fontSize: '22px', color: '#111827' },
    idText: { margin: 0, color: '#6B7280', fontSize: '14px' },
    
    divider: { border: 'none', borderTop: '1px solid #F3F4F6', margin: '0 0 30px 0' },

    // Form Layout
    formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', marginBottom: '30px' },
    column: { display: 'flex', flexDirection: 'column', gap: '20px' },
    sectionTitle: { fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '15px' },
    
    // Inputs
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '13px', fontWeight: '500', color: '#4B5563' },
    inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
    icon: { position: 'absolute', left: '12px', color: '#9CA3AF' },
    input: { width: '100%', padding: '10px 10px 10px 35px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px', color: '#111827', outline: 'none', boxSizing: 'border-box' },
    
    // Buttons
    buttonRow: { marginTop: '10px' },
    saveBtn: { backgroundColor: '#2563EB', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }
};

export default Profile;