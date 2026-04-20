import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserGraduate, FaChalkboardTeacher, FaUserShield, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const navigate = useNavigate();
    
    // State for form data
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Student');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    // State for password visibility
    const [showPassword, setShowPassword] = useState(false);

    // Handle Login Logic
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email, 
                password, 
                role
            });
            
            // Save the exact user properties to local storage
            sessionStorage.setItem('userId', response.data.userId);
            sessionStorage.setItem('role', response.data.role);

            // Role-based redirection
            if (role === 'Student') navigate('/student-dashboard');
            else if (role === 'Teacher') navigate('/teacher-courses');
            else if (role === 'Admin') navigate('/admin-dashboard');

        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Welcome Back</h2>
                    <p style={styles.subtitle}>Log in to access your {role} portal</p>
                </div>

                <div style={styles.tabContainer}>
                    <button 
                        style={role === 'Student' ? styles.activeTab : styles.tab} 
                        onClick={() => setRole('Student')}
                    >
                        <FaUserGraduate style={{marginRight: '8px'}}/> Student
                    </button>
                    <button 
                        style={role === 'Teacher' ? styles.activeTab : styles.tab} 
                        onClick={() => setRole('Teacher')}
                    >
                        <FaChalkboardTeacher style={{marginRight: '8px'}}/> Teacher
                    </button>
                    <button 
                        style={role === 'Admin' ? styles.activeTab : styles.tab} 
                        onClick={() => setRole('Admin')}
                    >
                        <FaUserShield style={{marginRight: '8px'}}/> Admin
                    </button>
                </div>

                <form onSubmit={handleLogin} style={styles.form}>
                    {error && <div style={styles.error}>{error}</div>}

                    <div style={styles.inputGroup}>
                        <FaEnvelope style={styles.icon} />
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <FaLock style={styles.icon} />
                        {/* 3. Logic to switch between text and password type */}
                        <input 
                            type={showPassword ? 'text' : 'password'} 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input} // Note: Padding is adjusted in styles below
                            required
                        />
                        {/* 4. Clickable Eye Icon */}
                        <div 
                            style={styles.eyeIcon} 
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>
                    </div>

                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div style={styles.footer}>
                    <p>Forgot Password? <span style={styles.link}>Contact Admin</span></p>
                </div>
            </div>
        </div>
    );
};

// --- CSS STYLES ---
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    card: {
        background: '#fff',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center',
    },
    header: { marginBottom: '20px' },
    title: { margin: '0', color: '#333', fontSize: '24px' },
    subtitle: { margin: '5px 0 0', color: '#666', fontSize: '14px' },
    tabContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '25px',
        background: '#f0f2f5',
        borderRadius: '10px',
        padding: '5px',
    },
    tab: {
        flex: 1,
        border: 'none',
        background: 'transparent',
        padding: '10px',
        cursor: 'pointer',
        color: '#666',
        fontWeight: '600',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
    },
    activeTab: {
        flex: 1,
        border: 'none',
        background: '#fff',
        padding: '10px',
        cursor: 'pointer',
        color: '#764ba2',
        fontWeight: 'bold',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    inputGroup: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
    },
    icon: {
        position: 'absolute',
        left: '15px',
        color: '#aaa',
        zIndex: 1, // Ensures icon stays on top
    },
    // 5. Added style for the new Eye Icon
    eyeIcon: {
        position: 'absolute',
        right: '15px',
        color: '#aaa',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        zIndex: 1,
    },
    input: {
        width: '100%',
        // Updated padding-right to 40px so text doesn't hit the eye icon
        padding: '12px 40px 12px 40px', 
        borderRadius: '8px',
        border: '1px solid #ddd',
        fontSize: '15px',
        outline: 'none',
        transition: 'border-color 0.3s',
        boxSizing: 'border-box',
    },
    button: {
        padding: '12px',
        background: '#764ba2',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background 0.3s',
        marginTop: '10px',
    },
    error: {
        color: '#d9534f',
        background: '#f9d6d5',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '14px',
    },
    footer: { marginTop: '20px', fontSize: '13px', color: '#888' },
    link: { color: '#764ba2', cursor: 'pointer', fontWeight: '600' }
};

export default Login;