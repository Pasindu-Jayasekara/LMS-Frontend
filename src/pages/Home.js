import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaChalkboardTeacher, FaBookOpen, FaPhoneAlt } from 'react-icons/fa';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div style={styles.container}>
            {/* --- NAVIGATION BAR --- */}
            <nav style={styles.navbar}>
                <div style={styles.logo}>
                    <FaGraduationCap style={{ marginRight: '10px' }} />
                    GCBT Institute
                </div>
                <div style={styles.navLinks}>
                    <a href="#features" style={styles.link}>Features</a>
                    <a href="#about" style={styles.link}>About</a>
                    <a href="#contact" style={styles.link}>Contact</a>
                </div>
                <div style={styles.authButtons}>
                    <button style={styles.loginBtn} onClick={() => navigate('/login')}>
                        Login
                    </button>
                    <button style={styles.registerBtn} onClick={() => navigate('/register')}>
                        Register
                    </button>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <header style={styles.hero}>
                <div style={styles.heroContent}>
                    <h1 style={styles.heroTitle}>Empowering Your Future<br/>Through Education</h1>
                    <p style={styles.heroSubtitle}>
                        Welcome to the official Learning Management System of GCBT.
                        Access your courses, track attendance, and stay updated.
                    </p>
                    <div style={styles.heroButtons}>
                        <button style={styles.primaryBtn} onClick={() => navigate('/login')}>
                            Go to Classroom
                        </button>
                        <button style={styles.secondaryBtn}>
                            View Courses
                        </button>
                    </div>
                </div>
            </header>

            {/* --- FEATURES SECTION --- */}
            <section id="features" style={styles.section}>
                <h2 style={styles.sectionTitle}>Why Choose GCBT?</h2>
                <div style={styles.grid}>
                    <div style={styles.card}>
                        <FaChalkboardTeacher size={40} color="#667eea" />
                        <h3>Expert Teachers</h3>
                        <p>Learn from the best educators with years of experience.</p>
                    </div>
                    <div style={styles.card}>
                        <FaBookOpen size={40} color="#667eea" />
                        <h3>Digital Library</h3>
                        <p>Access study materials, past papers, and recordings 24/7.</p>
                    </div>
                    <div style={styles.card}>
                        <FaPhoneAlt size={40} color="#667eea" />
                        <h3>Online Support</h3>
                        <p>Get help whenever you need it via our dedicated support channels.</p>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer style={styles.footer}>
                <p>&copy; 2025 GCBT Tuition Institute. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

// --- CSS STYLES ---
const styles = {
    container: {
        fontFamily: "'Segoe UI', sans-serif",
        color: '#333',
    },
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 50px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
    },
    logo: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#667eea',
        display: 'flex',
        alignItems: 'center',
    },
    navLinks: {
        display: 'flex',
        gap: '30px',
    },
    link: {
        textDecoration: 'none',
        color: '#555',
        fontWeight: '500',
        fontSize: '16px',
    },
    authButtons: {
        display: 'flex',
        gap: '15px',
    },
    loginBtn: {
        padding: '10px 20px',
        border: '2px solid #667eea',
        background: 'transparent',
        color: '#667eea',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: '0.3s',
    },
    registerBtn: {
        padding: '10px 20px',
        background: '#667eea',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    hero: {
        height: '80vh',
        background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("https://source.unsplash.com/1600x900/?university,library")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        color: '#fff',
    },
    heroContent: {
        maxWidth: '800px',
        padding: '20px',
    },
    heroTitle: {
        fontSize: '48px',
        marginBottom: '20px',
    },
    heroSubtitle: {
        fontSize: '20px',
        marginBottom: '40px',
        opacity: 0.9,
    },
    heroButtons: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
    },
    primaryBtn: {
        padding: '15px 30px',
        fontSize: '18px',
        background: '#667eea',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    secondaryBtn: {
        padding: '15px 30px',
        fontSize: '18px',
        background: 'transparent',
        border: '2px solid #fff',
        color: '#fff',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    section: {
        padding: '80px 50px',
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
    },
    sectionTitle: {
        fontSize: '36px',
        marginBottom: '50px',
        color: '#2c3e50',
    },
    grid: {
        display: 'flex',
        justifyContent: 'center',
        gap: '40px',
        flexWrap: 'wrap',
    },
    card: {
        background: '#fff',
        padding: '40px',
        borderRadius: '10px',
        width: '300px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
        textAlign: 'center',
    },
    footer: {
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#2c3e50',
        color: '#fff',
    }
};

export default Home;