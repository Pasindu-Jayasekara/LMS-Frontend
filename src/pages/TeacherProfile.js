import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FaUserTie, FaEnvelope, FaPhone, FaLock, FaSave,
    FaFlask, FaEye, FaEyeSlash
} from 'react-icons/fa';
import TeacherSidebar from '../components/TeacherSidebar';

const TeacherProfile = () => {
    // Read teacher ID from sessionStorage (set during login)
    const teacherId = sessionStorage.getItem('userId') || 'T2701';

    const [profileData, setProfileData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        contact: '',
        specialization: '',
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Toggle password visibility across all password fields
    const [showPasswords, setShowPasswords] = useState(false);

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    // ─── Fetch profile data on mount ──────────────────────────────────────────
    useEffect(() => {
        const fetchProfile = async () => {
            if (!teacherId) return;
            try {
                const res = await axios.get(`http://localhost:5000/api/teacher/profile/${teacherId}`);
                setProfileData({
                    first_name: res.data.first_name || '',
                    last_name: res.data.last_name || '',
                    email: res.data.email || '',
                    contact: res.data.contact || '',
                    specialization: res.data.specialization || '',
                });
            } catch (err) {
                console.error("Error fetching teacher profile:", err);
            }
        };
        fetchProfile();
    }, [teacherId]);

    // ─── Save personal information ────────────────────────────────────────────
    const handleSaveProfile = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/api/teacher/profile/update-info/${teacherId}`, profileData);
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Error saving profile:", err);
            alert("Failed to update profile.");
        }
    };

    // ─── Update password with validation ─────────────────────────────────────
    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("New passwords do not match!");
            return;
        }
        try {
            await axios.put(`http://localhost:5000/api/teacher/profile/update-password/${teacherId}`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
            });
            alert("Password updated successfully!");
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            console.error("Error updating password:", err);
            alert(err.response?.data?.message || "Failed to update password.");
        }
    };

    // Generate avatar initials from name
    const initials = `${profileData.first_name.charAt(0)}${profileData.last_name.charAt(0)}`.toUpperCase() || 'T';
    const fullName = `${profileData.first_name} ${profileData.last_name}`.trim() || 'Teacher';

    return (
        <div style={styles.container}>
            <div style={styles.sidebarWrapper}>
                <TeacherSidebar />
            </div>

            <main style={styles.main}>
                <div style={styles.content}>
                    {/* Page Header */}
                    <div style={styles.pageHeader}>
                        <h2 style={styles.pageTitle}>
                            <FaUserTie style={{ marginRight: 10, color: '#2563EB' }} /> Teacher Profile
                        </h2>
                        <p style={styles.subText}>Manage your personal information and account security.</p>
                    </div>

                    <div style={styles.grid}>

                        {/* ── LEFT CARD: PERSONAL INFORMATION ─────────────── */}
                        <div style={styles.card}>
                            <h3 style={styles.cardTitle}>Personal Information</h3>

                            {/* Avatar Section */}
                            <div style={styles.avatarSection}>
                                <div style={styles.avatarPlaceholder}>
                                    <span style={{ fontSize: '28px', color: '#fff', fontWeight: 'bold' }}>
                                        {initials}
                                    </span>
                                </div>
                                <div>
                                    <h3 style={{ margin: '0 0 5px 0' }}>{fullName}</h3>
                                    <span style={styles.roleBadge}>{profileData.specialization || 'Teacher'}</span>
                                </div>
                            </div>

                            <form onSubmit={handleSaveProfile} style={styles.form}>
                                {/* First Name */}
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>First Name</label>
                                    <div style={styles.inputWrapper}>
                                        <FaUserTie style={styles.inputIcon} />
                                        <input
                                            type="text"
                                            name="first_name"
                                            value={profileData.first_name}
                                            onChange={handleProfileChange}
                                            style={styles.inputWithIcon}
                                            placeholder="First name"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Last Name */}
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Last Name</label>
                                    <div style={styles.inputWrapper}>
                                        <FaUserTie style={styles.inputIcon} />
                                        <input
                                            type="text"
                                            name="last_name"
                                            value={profileData.last_name}
                                            onChange={handleProfileChange}
                                            style={styles.inputWithIcon}
                                            placeholder="Last name"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Email Address</label>
                                    <div style={styles.inputWrapper}>
                                        <FaEnvelope style={styles.inputIcon} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleProfileChange}
                                            style={styles.inputWithIcon}
                                            placeholder="Email address"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Contact */}
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Contact Number</label>
                                    <div style={styles.inputWrapper}>
                                        <FaPhone style={styles.inputIcon} />
                                        <input
                                            type="text"
                                            name="contact"
                                            value={profileData.contact}
                                            onChange={handleProfileChange}
                                            style={styles.inputWithIcon}
                                            placeholder="Contact number"
                                        />
                                    </div>
                                </div>

                                {/* Specialization */}
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Specialization</label>
                                    <div style={styles.inputWrapper}>
                                        <FaFlask style={styles.inputIcon} />
                                        <input
                                            type="text"
                                            name="specialization"
                                            value={profileData.specialization}
                                            onChange={handleProfileChange}
                                            style={styles.inputWithIcon}
                                            placeholder="e.g. Mathematics, Physics"
                                        />
                                    </div>
                                </div>

                                <button type="submit" style={styles.primaryBtn}>
                                    <FaSave style={{ marginRight: 8 }} /> Save Changes
                                </button>
                            </form>
                        </div>

                        {/* ── RIGHT CARD: SECURITY SETTINGS ───────────────── */}
                        <div style={styles.card}>
                            <h3 style={styles.cardTitle}>Security Settings</h3>
                            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '20px' }}>
                                Ensure your account is using a strong, unique password to stay secure.
                            </p>

                            <form onSubmit={handleUpdatePassword} style={styles.form}>
                                {/* Current Password */}
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Current Password</label>
                                    <div style={styles.inputWrapper}>
                                        <FaLock style={styles.inputIcon} />
                                        <input
                                            type={showPasswords ? 'text' : 'password'}
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Enter current password"
                                            style={styles.inputWithIcon}
                                            required
                                        />
                                        <button type="button" onClick={() => setShowPasswords(!showPasswords)} style={styles.eyeBtn}>
                                            {showPasswords ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                <div style={{ height: '1px', backgroundColor: '#E5E7EB', margin: '5px 0' }} />

                                {/* New Password */}
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>New Password</label>
                                    <div style={styles.inputWrapper}>
                                        <FaLock style={{ ...styles.inputIcon, color: '#10B981' }} />
                                        <input
                                            type={showPasswords ? 'text' : 'password'}
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Enter new password"
                                            style={styles.inputWithIcon}
                                            required
                                        />
                                        <button type="button" onClick={() => setShowPasswords(!showPasswords)} style={styles.eyeBtn}>
                                            {showPasswords ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm New Password */}
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Confirm New Password</label>
                                    <div style={styles.inputWrapper}>
                                        <FaLock style={{ ...styles.inputIcon, color: '#10B981' }} />
                                        <input
                                            type={showPasswords ? 'text' : 'password'}
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Confirm new password"
                                            style={styles.inputWithIcon}
                                            required
                                        />
                                        <button type="button" onClick={() => setShowPasswords(!showPasswords)} style={styles.eyeBtn}>
                                            {showPasswords ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" style={styles.dangerBtn}>
                                    Update Password
                                </button>
                            </form>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

// --- STYLES (matching AdminProfile.js exactly) ---
const styles = {
    // Layout
    container: { display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#F9FAFB', fontFamily: 'sans-serif', overflow: 'hidden' },
    sidebarWrapper: { width: '250px', flexShrink: 0, height: '100%', overflowY: 'auto' },
    main: { flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' },
    content: { flex: 1, overflowY: 'auto', padding: '30px', boxSizing: 'border-box' },

    pageHeader: { marginBottom: '25px' },
    pageTitle: { margin: 0, fontSize: '24px', color: '#111827', display: 'flex', alignItems: 'center' },
    subText: { margin: '5px 0 0 0', color: '#6B7280', fontSize: '14px' },

    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },

    // Card Styles
    card: { backgroundColor: '#fff', borderRadius: '12px', padding: '25px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' },
    cardTitle: { margin: '0 0 20px 0', fontSize: '18px', color: '#374151', borderBottom: '2px solid #F3F4F6', paddingBottom: '10px' },

    // Avatar Section
    avatarSection: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px', padding: '15px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' },
    avatarPlaceholder: { width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#2563EB', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
    roleBadge: { backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' },

    // Form Styles
    form: { display: 'flex', flexDirection: 'column', gap: '18px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '13px', fontWeight: '600', color: '#4B5563' },

    // Input with Icons
    inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
    inputIcon: { position: 'absolute', left: '12px', color: '#9CA3AF' },
    inputWithIcon: { width: '100%', padding: '12px 40px 12px 35px', borderRadius: '8px', border: '1px solid #D1D5DB', outline: 'none', fontSize: '14px', fontFamily: 'inherit', backgroundColor: '#F9FAFB', boxSizing: 'border-box' },
    eyeBtn: { position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex', alignItems: 'center', padding: 0 },

    // Buttons
    primaryBtn: { marginTop: '10px', backgroundColor: '#2563EB', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
    dangerBtn: { marginTop: '10px', backgroundColor: '#111827', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' },
};

export default TeacherProfile;
