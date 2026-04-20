import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaBook, FaUserTie, FaArrowRight, FaSearch, FaSpinner, FaDoorOpen } from 'react-icons/fa';
import Sidebar from '../components/Sidebar'; // Import the reusable Sidebar

// Palette for course card headers
const CARD_COLORS = ['#BDDDFC', '#88BDF2', '#6A89A7', '#DBEAFE', '#A5F3FC', '#BBF7D0'];

const StudentCourses = () => {
    const navigate = useNavigate();

    // Read userId and role on every render — avoids stale module-level snapshots
    const STUDENT_ID = sessionStorage.getItem('userId');
    const userRole   = sessionStorage.getItem('role');

    const [activeTab, setActiveTab] = useState('available');
    const [searchTerm, setSearchTerm] = useState('');
    const [availableCourses, setAvailableCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const [loadingRequest, setLoadingRequest] = useState(null); // tracks which card is loading

    // ─── Fetch all data on mount ──────────────────────────────────────────────
    const fetchAvailable = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/student/courses/available/${STUDENT_ID}`);
            setAvailableCourses(res.data);
        } catch (err) {
            console.error('Error fetching available courses:', err);
        }
    };

    const fetchMyCourses = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/student/courses/my-courses/${STUDENT_ID}`);
            setMyCourses(res.data);
        } catch (err) {
            console.error('Error fetching my courses:', err);
        }
    };

    useEffect(() => {
        fetchAvailable();
        fetchMyCourses();
    }, []);

    // ─── Handle Request to Join ───────────────────────────────────────────────
    const handleRequestJoin = async (courseId, courseTitle) => {
        const currentRole = sessionStorage.getItem('role');
        if (currentRole && currentRole !== 'Student') {
            alert("Action Denied: Only registered students can request to join courses. Please log in as a Student.");
            return;
        }

        // Confirmation dialog before sending the request
        const confirmed = window.confirm(
            `Are you sure you want to request to join "${courseTitle}"?\n\nYour request will be sent to the teacher for approval.`
        );
        if (!confirmed) return;

        setLoadingRequest(courseId);
        try {
            await axios.post('http://localhost:5000/api/student/courses/request-join', {
                student_id: STUDENT_ID,
                course_id: courseId,
            });
            
            // Instantly update UI without a full reload or refetch
            setAvailableCourses(prevCourses => 
                prevCourses.map(c => 
                    c.course_id === courseId ? { ...c, status: 'Pending' } : c
                )
            );
            alert(`Your request to join "${courseTitle}" has been successfully sent!`);
            
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to send request');
        } finally {
            setLoadingRequest(null);
        }
    };

    // ─── Tab filtering ────────────────────────────────────────────────────────
    const filteredAvailable = availableCourses.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const filteredMyCourses = myCourses.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.container}>
            {/* 1. Reusable Sidebar */}
            <Sidebar />

            {/* Role guard: show warning if not logged in as a Student */}
            {userRole !== 'Student' ? (
                <main style={styles.main}>
                    <div style={{ padding: 40, textAlign: 'center', color: '#DC2626', marginTop: 80 }}>
                        <h2>Access Denied</h2>
                        <p>This page is only accessible to students. Please log in with a student account.</p>
                    </div>
                </main>
            ) : (

            <main style={styles.main}>
                {/* 2. Main Content Wrapper */}

                {/* 3. Page Specific Content */}
                <div style={styles.content}>

                    {/* Page Title & Search */}
                    <div style={styles.pageHeader}>
                        <h1 style={styles.title}>Courses</h1>
                        <div style={styles.filterBox}>
                            <FaSearch color="#6A89A7" />
                            <input
                                type="text"
                                placeholder="Search courses..."
                                style={styles.filterInput}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Tabs */}
                    <div style={styles.tabBar}>
                        <button
                            style={activeTab === 'available' ? styles.tabActive : styles.tab}
                            onClick={() => setActiveTab('available')}
                        >
                            Available Subjects
                        </button>
                        <button
                            style={activeTab === 'my' ? styles.tabActive : styles.tab}
                            onClick={() => setActiveTab('my')}
                        >
                            My Classroom
                            {myCourses.length > 0 && (
                                <span style={styles.badge}>{myCourses.length}</span>
                            )}
                        </button>
                    </div>

                    {/* ── TAB 1: AVAILABLE SUBJECTS ─────────────────────── */}
                    {activeTab === 'available' && (
                        <div style={styles.grid}>
                            {filteredAvailable.length === 0 ? (
                                <p style={{ color: '#9CA3AF', gridColumn: '1/-1', textAlign: 'center', marginTop: 40 }}>
                                    No courses available yet.
                                </p>
                            ) : filteredAvailable.map((course, idx) => {
                                const status = course.status;
                                const isLoading = loadingRequest === course.course_id;
                                const color = CARD_COLORS[idx % CARD_COLORS.length];

                                return (
                                    <div key={course.course_id} style={styles.card}>
                                        {/* Course Color Banner */}
                                        <div style={{ ...styles.cardHeader, backgroundColor: color }}>
                                            <FaBook size={36} color="#384959" opacity={0.7} />
                                        </div>

                                        <div style={styles.cardBody}>
                                            <div style={styles.cardTitleRow}>
                                                <h3 style={styles.courseTitle}>{course.title}</h3>
                                                {/* Grade badge — displayed next to the title */}
                                                {course.grade && (
                                                    <span style={styles.gradeBadge}>{course.grade}</span>
                                                )}
                                            </div>
                                            {course.description && (
                                                <p style={styles.courseDesc}>{course.description}</p>
                                            )}
                                            <div style={styles.teacherRow}>
                                                <div style={styles.avatar}><FaUserTie /></div>
                                                <span style={styles.teacherName}>
                                                    {course.teacher_name || 'Unassigned'}
                                                </span>
                                            </div>

                                            {/* Action button based on enrollment status */}
                                            {!status ? (
                                                // Not requested yet — show primary blue button; triggers confirmation dialog
                                                <button
                                                    style={styles.requestBtn}
                                                    onClick={() => handleRequestJoin(course.course_id, course.title)}
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? <FaSpinner style={styles.spin} /> : 'Request to Join'}
                                                </button>
                                            ) : status === 'Pending' ? (
                                                // Already requested — show disabled gray badge
                                                <div style={styles.pendingBadge}>⏳ Pending Approval</div>
                                            ) : status === 'Active' ? (
                                                // Already active — show enter classroom button
                                                <button
                                                    style={styles.enterBtn}
                                                    onClick={() => navigate(`/student/classroom/${course.course_id}`)}
                                                >
                                                    <FaDoorOpen style={{ marginRight: 6 }} /> Enter Classroom
                                                </button>
                                            ) : (
                                                // Rejected
                                                <div style={styles.rejectedBadge}>✗ Request Rejected</div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* ── TAB 2: MY CLASSROOM ───────────────────────────── */}
                    {activeTab === 'my' && (
                        <div style={styles.grid}>
                            {filteredMyCourses.length === 0 ? (
                                <p style={{ color: '#9CA3AF', gridColumn: '1/-1', textAlign: 'center', marginTop: 40 }}>
                                    You haven't been enrolled in any courses yet.
                                </p>
                            ) : filteredMyCourses.map((course, idx) => {
                                const color = CARD_COLORS[idx % CARD_COLORS.length];
                                return (
                                    <div key={course.course_id} style={styles.card}>
                                        <div style={{ ...styles.cardHeader, backgroundColor: color }}>
                                            <FaBook size={36} color="#384959" opacity={0.7} />
                                        </div>

                                        <div style={styles.cardBody}>
                                            <h3 style={styles.courseTitle}>{course.title}</h3>
                                            {course.description && (
                                                <p style={styles.courseDesc}>{course.description}</p>
                                            )}
                                            <div style={styles.teacherRow}>
                                                <div style={styles.avatar}><FaUserTie /></div>
                                                <span style={styles.teacherName}>
                                                    {course.teacher_name || 'Unassigned'}
                                                </span>
                                            </div>

                                            {/* Enter Classroom button */}
                                            <button
                                                style={styles.enterBtn}
                                                onClick={() => navigate(`/student/classroom/${course.course_id}`)}
                                            >
                                                Enter Classroom <FaArrowRight style={{ marginLeft: 6 }} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                </div>
            </main>
            )}
        </div>
    );
};

const styles = {
    // Layout
    container: { display: 'flex', height: '100vh', backgroundColor: '#f3f4f6', fontFamily: "'Inter', sans-serif" },
    main: { marginLeft: '250px', flex: 1, display: 'flex', flexDirection: 'column' },
    content: { padding: '30px', overflowY: 'auto' },

    // Page header
    pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    title: { fontSize: '24px', color: '#1f2937', margin: 0, fontWeight: 'bold' },

    // Local Filter Bar
    filterBox: { display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '10px 15px', borderRadius: '8px', border: '1px solid #e5e7eb' },
    filterInput: { border: 'none', outline: 'none', marginLeft: '10px', fontSize: '14px', width: '200px' },

    // Tabs
    tabBar: { display: 'flex', gap: '10px', marginBottom: '25px', borderBottom: '2px solid #E5E7EB', paddingBottom: '0' },
    tab: { padding: '10px 20px', backgroundColor: 'transparent', border: 'none', borderBottom: '2px solid transparent', color: '#6B7280', fontWeight: '600', cursor: 'pointer', fontSize: '14px', marginBottom: '-2px' },
    tabActive: { padding: '10px 20px', backgroundColor: 'transparent', border: 'none', borderBottom: '2px solid #2563EB', color: '#2563EB', fontWeight: '600', cursor: 'pointer', fontSize: '14px', marginBottom: '-2px', display: 'flex', alignItems: 'center', gap: '8px' },
    badge: { backgroundColor: '#2563EB', color: '#fff', borderRadius: '999px', fontSize: '11px', padding: '2px 7px', fontWeight: 'bold' },

    // Grid System
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' },

    // Course Card
    card: { backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.06)', border: '1px solid #e5e7eb', transition: '0.2s', display: 'flex', flexDirection: 'column' },
    cardHeader: { height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    cardBody: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 },

    courseTitle: { margin: 0, color: '#1f2937', fontSize: '15px', fontWeight: 'bold' },
    courseDesc: { margin: 0, fontSize: '12px', color: '#9CA3AF', lineHeight: '1.4' },

    teacherRow: { display: 'flex', alignItems: 'center', gap: '10px' },
    avatar: { width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: '11px' },
    teacherName: { fontSize: '13px', color: '#6b7280' },

    // Card title row — flex layout for title + grade badge
    cardTitleRow: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' },
    // Grade badge displayed alongside the course title
    gradeBadge: { fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '999px', backgroundColor: '#EEF2FF', color: '#4338CA', whiteSpace: 'nowrap' },

    // Action buttons / badges
    requestBtn: { marginTop: 'auto', width: '100%', padding: '10px', backgroundColor: '#2563EB', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    enterBtn: { marginTop: 'auto', width: '100%', padding: '10px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    pendingBadge: { marginTop: 'auto', textAlign: 'center', padding: '10px', backgroundColor: '#FFF7ED', color: '#C2410C', borderRadius: '8px', fontWeight: '600', fontSize: '13px', border: '1px solid #FED7AA' },
    rejectedBadge: { marginTop: 'auto', textAlign: 'center', padding: '10px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '8px', fontWeight: '600', fontSize: '13px' },

    // Spinner keyframe workaround (inline spin via style)
    spin: { animation: 'spin 1s linear infinite' },
};

export default StudentCourses;