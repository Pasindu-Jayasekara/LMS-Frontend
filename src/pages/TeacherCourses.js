import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FaSearch, FaHashtag, FaUserGraduate, FaBookOpen,
    FaClipboardList, FaChartBar, FaVideo, FaLock, FaTimes, FaCalendarAlt, FaEye, FaEyeSlash
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import TeacherSidebar from '../components/TeacherSidebar';

// Fetch the logged-in teacher ID from sessionStorage
const loggedInTeacherId = sessionStorage.getItem('userId') || 'T2701';

const injectedStyles = `
    .course-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid #E5E7EB; background: white; }
    .course-card:hover { transform: translateY(-6px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); border-color: #93C5FD; }
    
    .primary-btn { transition: all 0.2s; background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%); }
    .primary-btn:hover { box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4); transform: translateY(-1px); filter: brightness(1.1); }
    
    .modal-overlay { animation: fadeIn 0.3s ease-out; }
    .modal-content { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    
    .close-btn:hover { color: #EF4444 !important; transform: rotate(90deg); transition: 0.3s ease-in-out; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
`;

const TeacherCourses = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [myCourses, setMyCourses] = useState([]);

    // Unlock Modal State (merged password & grade selection)
    const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
    const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [enrollmentKey, setEnrollmentKey] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('Grade 12'); // Default selection
    const [unlockError, setUnlockError] = useState('');
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const fetchCourses = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/teacher-courses/assigned/${loggedInTeacherId}`);
            const formatted = response.data.map(c => ({
                ...c,
                color: '#2563EB'
            }));
            setMyCourses(formatted);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    useEffect(() => {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = injectedStyles;
        document.head.appendChild(styleSheet);

        fetchCourses();

        return () => { document.head.removeChild(styleSheet); };
    }, []);

    const handleOpenUnlockModal = (course) => {
        const unlockedCourses = JSON.parse(sessionStorage.getItem(`unlocked_courses_${loggedInTeacherId}`) || '[]');
        if (unlockedCourses.includes(course.course_id)) {
            setSelectedCourse(course);
            setSelectedGrade('Grade 12');
            setIsGradeModalOpen(true);
        } else {
            setSelectedCourse(course);
            setEnrollmentKey('');
            setSelectedGrade('Grade 12');
            setUnlockError('');
            setIsUnlockModalOpen(true);
        }
    };

    const handleUnlock = async () => {
        if (!enrollmentKey.trim()) {
            setUnlockError("Password is required.");
            return;
        }

        setIsUnlocking(true);
        setUnlockError('');

        try {
            // POST to verify key
            const payload = {
                course_id: selectedCourse.course_id,
                password: enrollmentKey
            };
            await axios.post('http://localhost:5000/api/teacher-courses/verify-key', payload);

            // Mark as unlocked
            const unlockedCourses = JSON.parse(sessionStorage.getItem(`unlocked_courses_${loggedInTeacherId}`) || '[]');
            if (!unlockedCourses.includes(selectedCourse.course_id)) {
                unlockedCourses.push(selectedCourse.course_id);
                sessionStorage.setItem(`unlocked_courses_${loggedInTeacherId}`, JSON.stringify(unlockedCourses));
            }

            // On Success, close modal and route.
            setIsUnlockModalOpen(false);
            navigate(`/teacher/classroom/${selectedCourse.course_id}/${selectedGrade}`);

        } catch (error) {
            const errorMsg = error.response?.data?.message || "Failed to verify password.";
            setUnlockError(errorMsg);
            alert("Incorrect Course Password"); // Show alert as requested by requirements
        } finally {
            setIsUnlocking(false);
        }
    };

    const handleProceedToCourse = () => {
        setIsGradeModalOpen(false);
        navigate(`/teacher/classroom/${selectedCourse.course_id}/${selectedGrade}`);
    };

    const displayedMyCourses = myCourses.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div style={styles.container}>
            <TeacherSidebar />

            <main style={styles.main}>

                <div style={styles.content}>

                    {/* Welcome & Teacher ID Bar */}
                    <div style={styles.welcomeBar}>
                        <div>
                            <h2 style={styles.welcomeText}>My Assigned Courses</h2>
                            <p style={styles.subText}>Manage your active classes and unlock your classrooms.</p>
                        </div>
                        <div style={styles.teacherIdBadge}>
                            <FaHashtag color="#3B82F6" /> ID: {loggedInTeacherId}
                        </div>
                    </div>

                    {/* Action Bar (Search only) */}
                    <div style={styles.actionBar}>
                        <div style={styles.searchBox}>
                            <FaSearch color="#6B7280" />
                            <input
                                type="text"
                                placeholder="Search courses by title..."
                                style={styles.searchInput}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Dynamic Grid Rendering */}
                    <div style={styles.grid}>
                        {displayedMyCourses.length === 0 ? (
                            <p style={styles.emptyState}>No assigned courses found.</p>
                        ) : displayedMyCourses.map(course => (
                            <div key={course.course_id} className="course-card" style={styles.card}>
                                <div style={styles.cardHeader}>
                                    <div style={{ ...styles.iconBox, backgroundColor: course.color }}>
                                        <FaBookOpen color="#fff" size={18} />
                                    </div>
                                    <span style={styles.idBadge}>{course.course_id}</span>
                                </div>

                                <div style={styles.cardBody}>
                                    <h3 style={styles.courseTitle}>{course.title}</h3>
                                    <p style={styles.courseDesc}>{course.description || 'No description available'}</p>

                                    <div style={{ flex: 1 }}></div>

                                    <button 
                                        className="primary-btn" 
                                        style={styles.primaryBtn}
                                        onClick={() => handleOpenUnlockModal(course)}
                                    >
                                        <FaBookOpen style={{ marginRight: 8 }} /> Enter Course
                                    </button>
                                </div>

                                <div style={styles.cardFooter}>
                                    <div style={styles.footerLink}><FaBookOpen /> Materials</div>
                                    <div style={styles.footerLink}><FaClipboardList /> Tasks</div>
                                    <div style={styles.footerLink}><FaChartBar /> Grades</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Unlock Modal (Password & Grade Merge) */}
            {isUnlockModalOpen && (
                <div className="modal-overlay" style={styles.modalOverlay}>
                    <div className="modal-content" style={styles.modalContent}>

                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>Unlock Classroom</h3>
                            <FaTimes
                                className="close-btn"
                                style={styles.closeBtn}
                                onClick={() => setIsUnlockModalOpen(false)}
                            />
                        </div>

                        <div style={styles.modalBody}>
                            <div style={styles.modalIconArea}>
                                <div style={styles.largeIconBox}>
                                    <FaLock color="#2563EB" size={28} />
                                </div>
                            </div>

                            <h4 style={styles.modalCourseName}>{selectedCourse?.title}</h4>
                            <p style={styles.modalSubText}>Secure classroom checkpoint</p>

                            <div style={styles.inputGroup}>
                                <label style={styles.inputLabel}>Course Enrollment Password</label>
                                <div style={{ position: 'relative', width: '100%', marginBottom: '20px' }}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter secure key..."
                                        style={styles.modalInput}
                                        value={enrollmentKey}
                                        onChange={(e) => setEnrollmentKey(e.target.value)}
                                    />
                                    <div 
                                        style={{ position: 'absolute', right: '15px', top: '15px', cursor: 'pointer', color: '#6B7280' }}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                    </div>
                                    {unlockError && <p style={styles.errorText}>{unlockError}</p>}
                                </div>

                                <label style={styles.inputLabel}>Select Teaching Grade</label>
                                <select 
                                    style={styles.modalInput} 
                                    value={selectedGrade} 
                                    onChange={(e) => setSelectedGrade(e.target.value)}
                                >
                                    <option value="Grade 12">Grade 12</option>
                                    <option value="Grade 13">Grade 13</option>
                                    <option value="Revision">Revision</option>
                                </select>
                            </div>
                        </div>

                        <div style={styles.modalFooter}>
                            <button style={styles.cancelBtn} onClick={() => setIsUnlockModalOpen(false)}>Cancel</button>
                            <button
                                className="primary-btn"
                                style={isUnlocking ? styles.enrollBtnDisabled : styles.enrollBtnConfirm}
                                onClick={handleUnlock}
                                disabled={isUnlocking}
                            >
                                {isUnlocking ? 'Verifying...' : 'Unlock & Enter'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Grade Selection Modal (No Password) */}
            {isGradeModalOpen && (
                <div className="modal-overlay" style={styles.modalOverlay}>
                    <div className="modal-content" style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>Enter Classroom</h3>
                            <FaTimes style={styles.closeBtn} onClick={() => setIsGradeModalOpen(false)} />
                        </div>
                        <div style={styles.modalBody}>
                            <div style={styles.modalIconArea}>
                                <div style={styles.largeIconBox}>
                                    <FaBookOpen color="#2563EB" size={28} />
                                </div>
                            </div>
                            <h4 style={styles.modalCourseName}>{selectedCourse?.title}</h4>
                            <p style={styles.modalSubText}>Select the grade for this session.</p>

                            <div style={styles.inputGroup}>
                                <label style={styles.inputLabel}>Select Teaching Grade</label>
                                <select 
                                    style={styles.modalInput} 
                                    value={selectedGrade} 
                                    onChange={(e) => setSelectedGrade(e.target.value)}
                                >
                                    <option value="Grade 12">Grade 12</option>
                                    <option value="Grade 13">Grade 13</option>
                                    <option value="Revision">Revision</option>
                                </select>
                            </div>
                        </div>
                        <div style={styles.modalFooter}>
                            <button style={styles.cancelBtn} onClick={() => setIsGradeModalOpen(false)}>Cancel</button>
                            <button className="primary-btn" style={styles.enrollBtnConfirm} onClick={handleProceedToCourse}>Enter Classroom</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { display: 'flex', height: '100vh', backgroundColor: '#F3F4F6', fontFamily: "'Inter', sans-serif" },
    main: { marginLeft: '250px', flex: 1, display: 'flex', flexDirection: 'column' },
    content: { padding: '40px', overflowY: 'auto' },

    welcomeBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', backgroundColor: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' },
    welcomeText: { margin: 0, fontSize: '24px', fontWeight: '800', color: '#111827' },
    subText: { margin: '5px 0 0 0', color: '#4B5563', fontSize: '15px' },
    teacherIdBadge: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#EFF6FF', padding: '8px 16px', borderRadius: '30px', fontWeight: '700', color: '#1E3A8A', border: '1px solid #BFDBFE' },

    actionBar: { display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '30px' },

    searchBox: { display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '12px 20px', borderRadius: '12px', border: '1px solid #E5E7EB', width: '350px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
    searchInput: { border: 'none', outline: 'none', marginLeft: '12px', width: '100%', fontSize: '15px' },

    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '30px' },
    emptyState: { gridColumn: '1 / -1', textAlign: 'center', padding: '50px', color: '#9CA3AF', fontSize: '16px', backgroundColor: '#fff', borderRadius: '16px', border: '1px dashed #D1D5DB' },

    // Card Styles
    card: { borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    cardHeader: { padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F3F4F6' },
    iconBox: { width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
    idBadge: { fontSize: '12px', padding: '6px 12px', backgroundColor: '#F3F4F6', borderRadius: '8px', color: '#4B5563', fontWeight: '700', letterSpacing: '0.5px' },

    cardBody: { padding: '24px 20px', flex: 1, display: 'flex', flexDirection: 'column' },
    courseTitle: { margin: '0 0 8px 0', fontSize: '20px', color: '#111827', fontWeight: '800' },
    courseDesc: { margin: '0 0 20px 0', fontSize: '14px', color: '#6B7280', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' },

    primaryBtn: { width: '100%', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', marginTop: 'auto' },

    cardFooter: { borderTop: '1px solid #F3F4F6', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', backgroundColor: '#F9FAFB' },
    footerLink: { fontSize: '13px', color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', transition: 'color 0.2s' },

    // Modal Styles
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: '#fff', width: '90%', maxWidth: '450px', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' },

    modalHeader: { padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F3F4F6' },
    modalTitle: { margin: 0, fontSize: '18px', fontWeight: '800', color: '#111827' },
    closeBtn: { cursor: 'pointer', color: '#9CA3AF', fontSize: '20px' },

    modalBody: { padding: '30px 24px', textAlign: 'center' },
    modalIconArea: { display: 'flex', justifyContent: 'center', marginBottom: '20px' },
    largeIconBox: { width: '64px', height: '64px', backgroundColor: '#EFF6FF', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    modalCourseName: { margin: '0 0 5px 0', fontSize: '22px', fontWeight: '800', color: '#111827' },
    modalSubText: { margin: '0 0 25px 0', color: '#6B7280', fontSize: '14px', fontWeight: '500' },

    inputGroup: { textAlign: 'left' },
    inputLabel: { display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' },
    modalInput: { width: '100%', boxSizing: 'border-box', padding: '14px 16px', border: '1px solid #D1D5DB', borderRadius: '10px', fontSize: '15px', outline: 'none', transition: 'border-color 0.2s', backgroundColor: '#F9FAFB' },
    errorText: { color: '#EF4444', fontSize: '13px', margin: '8px 0 0 0', fontWeight: '500', display: 'flex', alignItems: 'center' },

    modalFooter: { padding: '20px 24px', backgroundColor: '#F9FAFB', borderTop: '1px solid #F3F4F6', display: 'flex', gap: '15px' },
    cancelBtn: { flex: 1, padding: '14px', backgroundColor: '#fff', border: '1px solid #D1D5DB', borderRadius: '10px', fontWeight: '600', color: '#4B5563', cursor: 'pointer', transition: 'background-color 0.2s' },
    enrollBtnConfirm: { flex: 2, padding: '14px', backgroundColor: '#2563EB', border: 'none', borderRadius: '10px', fontWeight: '700', color: '#fff', cursor: 'pointer' },
    enrollBtnDisabled: { flex: 2, padding: '14px', backgroundColor: '#93C5FD', border: 'none', borderRadius: '10px', fontWeight: '700', color: '#fff', cursor: 'not-allowed' }
};

export default TeacherCourses;