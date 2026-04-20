import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGraduationCap, FaChalkboardTeacher, FaBookOpen, FaPhoneAlt, FaArrowRight } from 'react-icons/fa';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="home-container">
            {/* --- NAVIGATION BAR --- */}
            <nav className="navbar">
                <div className="logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
                    <FaGraduationCap size={28} />
                    <span>GCBT Institute</span>
                </div>
                <div className="nav-links">
                    <a href="#features" className="nav-link">Features</a>
                    <a href="#about" className="nav-link">About</a>
                    <a href="#contact" className="nav-link">Contact</a>
                </div>
                <div className="auth-buttons">
                    <button className="btn-login" onClick={() => navigate('/login')}>
                        Log In
                    </button>
                    <button className="btn-register" onClick={() => navigate('/register')}>
                        Get Started
                    </button>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <header className="hero">
                <div className="hero-bg-shape1"></div>
                <div className="hero-bg-shape2"></div>
                <div className="hero-content">
                    <div className="badge">Welcome to GCBT</div>
                    
                    {/* The requested sentence */}
                    <h1 className="hero-title">
                        Empowering Your Future<br />
                        <span>Through Education</span>
                    </h1>
                    
                    <p className="hero-subtitle">
                        Experience the ultimate Learning Management System. 
                        Access world-class courses, track your real-time attendance, and connect with expert educators anytime, anywhere.
                    </p>
                    <div className="hero-buttons">
                        <button className="btn-primary" onClick={() => navigate('/login')}>
                            Go to Classroom <FaArrowRight style={{marginLeft: '8px'}}/>
                        </button>
                        <button className="btn-secondary" onClick={() => {
                            document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
                        }}>
                            Explore Features
                        </button>
                    </div>
                </div>
            </header>

            {/* --- FEATURES SECTION --- */}
            <section id="features" className="features-section">
                <h2 className="section-title">Why Choose GCBT?</h2>
                <p className="section-subtitle">Discover the advantage of our digital campus.</p>
                
                <div className="grid">
                    <div className="card">
                        <div className="card-icon-wrapper">
                            <FaChalkboardTeacher size={28} />
                        </div>
                        <h3>Expert Teachers</h3>
                        <p>Learn from the industry's best educators with years of practical experience and dedication to your success.</p>
                    </div>
                    
                    <div className="card">
                        <div className="card-icon-wrapper">
                            <FaBookOpen size={28} />
                        </div>
                        <h3>Digital Library</h3>
                        <p>Access our comprehensive digital library anywhere, 24/7. Study materials, past papers, and recorded sessions.</p>
                    </div>
                    
                    <div className="card">
                        <div className="card-icon-wrapper">
                            <FaPhoneAlt size={28} />
                        </div>
                        <h3>Dedicated Support</h3>
                        <p>Our responsive support team is always ready to assist you. Never get stuck with our dedicated channels.</p>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="footer">
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '20px'}}>
                    <FaGraduationCap size={24} color="#4F46E5" />
                    <span style={{fontSize: '1.25rem', fontWeight: 'bold', color: 'white'}}>GCBT</span>
                </div>
                <p>&copy; {new Date().getFullYear()} GCBT Tuition Institute. All Rights Reserved.</p>
                <p style={{marginTop: '10px', fontSize: '0.85rem'}}>Empowering Your Future Through Education</p>
            </footer>
        </div>
    );
};

export default Home;