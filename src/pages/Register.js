import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
    FaUser, FaEnvelope, FaLock, FaPhone, FaBook, 
    FaEye, FaEyeSlash, FaUserGraduate, FaChalkboardTeacher, FaIdBadge
} from 'react-icons/fa';

const Register = () => {
    const navigate = useNavigate();
    
    // Toggle State for Role
    const [currentRole, setCurrentRole] = useState('Student'); 

    // Unified State for both Student and Teacher
    const [formData, setFormData] = useState({
        firstName: '', 
        lastName: '',
        email: '', 
        password: '', 
        confirmPassword: '',
        contact: '', 
        grade: '',          // For Student
        specialization: ''  // For Teacher
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Basic Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) return setError("Invalid email address.");
        
        const phoneRegex = /^\d+$/;
        if (!phoneRegex.test(formData.contact) || formData.contact.length > 10) {
            return setError("Invalid phone number (Max 10 digits).");
        }

        if (formData.password.length < 8) return setError("Password must be 8+ chars.");
        if (formData.password !== formData.confirmPassword) return setError("Passwords do not match!");

        try {
            if (currentRole === 'Student') {
                // STUDENT REGISTRATION API
                const response = await axios.post('http://localhost:5000/api/auth/register', {
                    ...formData,
                    role: 'Student'
                });
                setSuccess(`Welcome, ${formData.firstName}! Student ID: ${response.data.userId}`);
            } else {
                // TEACHER REGISTRATION API
                const teacherPayload = {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    email: formData.email,
                    contact: formData.contact,
                    password: formData.password,
                    specialization: formData.specialization
                };
                await axios.post('http://localhost:5000/api/teachers/register', teacherPayload);
                setSuccess(`Welcome, Teacher ${formData.firstName}! Registration successful.`);
            }
            
            setTimeout(() => navigate('/login'), 2500);

        } catch (err) {
            setError(err.response?.data?.message || 'Registration Failed. Check your details.');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>

                <h2 style={styles.title}>{currentRole} Registration</h2>
                <p style={styles.subtitle}>Create your {currentRole.toLowerCase()} account</p>
                
                {/* ROLE TOGGLE SWITCH */}
                <div style={styles.toggleContainer}>
                    <button 
                        type="button"
                        onClick={() => setCurrentRole('Student')} 
                        style={currentRole === 'Student' ? styles.toggleBtnActive : styles.toggleBtnInactive}
                    >
                        <FaUserGraduate style={{marginRight: 8, fontSize: '16px'}} /> Student
                    </button>
                    <button 
                        type="button"
                        onClick={() => setCurrentRole('Teacher')} 
                        style={currentRole === 'Teacher' ? styles.toggleBtnActive : styles.toggleBtnInactive}
                    >
                        <FaChalkboardTeacher style={{marginRight: 8, fontSize: '16px'}} /> Teacher
                    </button>
                </div>

                

                <form onSubmit={handleRegister} style={styles.form}>
                    {error && <div style={styles.error}>{error}</div>}
                    {success && <div style={styles.success}>{success}</div>}



                    <div style={styles.row}>
                        <div style={styles.inputGroup}>
                            <FaUser style={styles.icon} />
                            <input name="firstName" placeholder="First Name" onChange={handleChange} style={styles.input} required />
                        </div>
                        <div style={styles.inputGroup}>
                            <FaUser style={styles.icon} />
                            <input name="lastName" placeholder="Last Name" onChange={handleChange} style={styles.input} required />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <FaEnvelope style={styles.icon} />
                        <input name="email" type="email" placeholder="Email Address" onChange={handleChange} style={styles.input} required />
                    </div>

                    <div style={styles.inputGroup}>
                        <FaPhone style={styles.icon} />
                        <input name="contact" type="tel" placeholder="Phone Number" maxLength={10} onChange={handleChange} style={styles.input} required />
                    </div>

                    {/* DYNAMIC FIELD: Grade (Student) vs Specialization (Teacher) */}
                    {currentRole === 'Student' ? (
                        <div style={styles.inputGroup}>
                            <FaBook style={styles.icon} />
                            <select name="grade" onChange={handleChange} style={styles.input} required>
                                <option value="">Select Grade</option>
                                <option value="Grade 12">Grade 12</option>
                                <option value="Grade 13">Grade 13</option>
                                <option value="Revision">Revision</option>
                            </select>
                        </div>
                    ) : (
                        <div style={styles.inputGroup}>
                            <FaBook style={styles.icon} />
                            <select name="specialization" onChange={handleChange} style={styles.input} required>
                                <option value="">Select Specialization</option>
                                <option value="Mathematics">Combined Maths</option>
                                <option value="Physics">Physics</option>
                                <option value="Chemistry">Chemistry</option>
                                <option value="IT">Information Technology</option>
                            </select>
                        </div>
                    )}

                    <div style={styles.row}>
                        <div style={styles.inputGroup}>
                            <FaLock style={styles.icon} />
                            <input name="password" type={showPassword ? "text" : "password"} placeholder="Password" onChange={handleChange} style={styles.input} required />
                            <span onClick={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                        </div>
                        <div style={styles.inputGroup}>
                            <FaLock style={styles.icon} />
                            <input name="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm" onChange={handleChange} style={styles.input} required />
                            <span onClick={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</span>
                        </div>
                    </div>

                    <button type="submit" style={styles.button}>Register as {currentRole}</button>
                </form>

                <p style={styles.footerText}>Already have an account? <span style={styles.link} onClick={() => navigate('/login')}>Login here</span></p>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', fontFamily: "'Segoe UI', sans-serif", padding: '20px' },
    card: { background: '#fff', padding: '40px', borderRadius: '15px', width: '100%', maxWidth: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', textAlign: 'center' },
    
    // Toggle Styles
    toggleContainer: { display: 'flex', backgroundColor: '#F3F4F6', borderRadius: '10px', padding: '5px', marginBottom: '25px' },
    toggleBtnActive: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', color: '#764ba2', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', transition: '0.3s' },
    toggleBtnInactive: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent', color: '#6B7280', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', transition: '0.3s' },

    title: { margin: '0 0 10px 0', color: '#333' },
    subtitle: { margin: '0 0 20px 0', color: '#666' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    row: { display: 'flex', gap: '10px' },
    inputGroup: { position: 'relative', flex: 1 },
    icon: { position: 'absolute', left: '12px', top: '14px', color: '#aaa' },
    eyeIcon: { position: 'absolute', right: '12px', top: '14px', color: '#aaa', cursor: 'pointer', zIndex: 10 },
    input: { width: '100%', padding: '12px 35px 12px 40px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
    button: { padding: '12px', background: '#764ba2', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
    error: { color: '#d9534f', background: '#f9d6d5', padding: '10px', borderRadius: '5px' },
    success: { color: '#28a745', background: '#d4edda', padding: '10px', borderRadius: '5px' },
    footerText: { marginTop: '20px', fontSize: '14px', color: '#666' },
    link: { color: '#764ba2', cursor: 'pointer', fontWeight: 'bold' }
};

export default Register;