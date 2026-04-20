import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    FaArrowLeft, FaBook, FaUserTie, FaClock, FaCalendarAlt,
    FaVideo, FaMapMarkerAlt, FaClipboardList, FaCheckCircle,
    FaHourglass, FaStar, FaEnvelope
} from 'react-icons/fa';
import Sidebar from '../components/Sidebar';

// Helper: format ISO date nicely
const fmtDate = (iso) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
};

// Helper: format HH:MM:SS → 10:00 AM
const fmtTime = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hr = parseInt(h);
    return `${hr % 12 || 12}:${m} ${hr < 12 ? 'AM' : 'PM'}`;
};

const statusMeta = {
    Pending:   { color: '#D97706', bg: '#FEF3C7', icon: <FaHourglass size={11}/> },
    Submitted: { color: '#1E40AF', bg: '#DBEAFE', icon: <FaCheckCircle size={11}/> },
    Graded:    { color: '#065F46', bg: '#D1FAE5', icon: <FaStar size={11}/> },
};

const StudentClassroom = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const STUDENT_ID = sessionStorage.getItem('userId');

    const [data, setData] = useState(null);      // { course, studentGrade, sessions, assignments }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('schedule'); // 'schedule' | 'assignments'

    // ─── Fetch all classroom data on mount ───────────────────────────────────
    useEffect(() => {
        const fetchClassroom = async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/student/classroom/${STUDENT_ID}/${courseId}`
                );
                setData(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load classroom data.');
            } finally {
                setLoading(false);
            }
        };
        if (STUDENT_ID && courseId) fetchClassroom();
    }, [STUDENT_ID, courseId]);

    // ─── Split sessions into upcoming and past ────────────────────────────────
    const today = new Date(new Date().toDateString());
    const upcomingSessions = data?.sessions.filter(s => new Date(s.session_date) >= today) || [];
    const pastSessions     = data?.sessions.filter(s => new Date(s.session_date) <  today) || [];

    return (
        <div style={styles.container}>
            <Sidebar />

            <main style={styles.main}>
                {/* ── LOADING ─────────────────────────────────────────── */}
                {loading && (
                    <div style={styles.centeredMsg}>Loading your classroom...</div>
                )}

                {/* ── ERROR ───────────────────────────────────────────── */}
                {!loading && error && (
                    <div style={styles.centeredMsg}>
                        <p style={{ color: '#DC2626', fontWeight: 600 }}>{error}</p>
                        <button style={styles.backBtn} onClick={() => navigate('/student-courses')}>
                            ← Back to Courses
                        </button>
                    </div>
                )}

                {/* ── CONTENT ─────────────────────────────────────────── */}
                {!loading && data && (
                    <div style={styles.content}>

                        {/* Back navigation */}
                        <button style={styles.backBtn} onClick={() => navigate('/student-courses')}>
                            <FaArrowLeft style={{ marginRight: 6 }} /> Back to Courses
                        </button>

                        {/* ── COURSE HEADER CARD ───────────────────────── */}
                        <div style={styles.headerCard}>
                            <div style={styles.headerLeft}>
                                <div style={styles.courseIcon}><FaBook size={28} color="#fff" /></div>
                                <div>
                                    <h1 style={styles.courseTitle}>{data.course?.title}</h1>
                                    {data.course?.description && (
                                        <p style={styles.courseDesc}>{data.course.description}</p>
                                    )}
                                    <span style={styles.gradeBadge}>{data.studentGrade}</span>
                                </div>
                            </div>

                            {/* Teacher info */}
                            <div style={styles.teacherBox}>
                                <div style={styles.teacherAvatar}>
                                    {(data.course?.teacher_name || 'T').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p style={styles.teacherName}>
                                        <FaUserTie size={12} style={{ marginRight: 5 }} />
                                        {data.course?.teacher_name || 'Unassigned'}
                                    </p>
                                    {/*data.course?.specialization && (
                                        <p style={styles.teacherSpec}>{data.course.specialization}</p>
                                    )*/}
                                    {data.course?.teacher_email && (
                                        <p style={styles.teacherSpec}>
                                            <FaEnvelope size={11} style={{ marginRight: 4 }} />
                                            {data.course.teacher_email}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ── STAT CHIPS ───────────────────────────────── */}
                        <div style={styles.statsRow}>
                            <StatChip
                                icon={<FaCalendarAlt color="#2563EB" />}
                                label="Total Sessions"
                                value={data.sessions.length}
                            />
                            <StatChip
                                icon={<FaClock color="#D97706" />}
                                label="Upcoming"
                                value={upcomingSessions.length}
                            />
                            <StatChip
                                icon={<FaClipboardList color="#7C3AED" />}
                                label="Assignments"
                                value={data.assignments.length}
                            />
                            <StatChip
                                icon={<FaCheckCircle color="#059669" />}
                                label="Submitted"
                                value={data.assignments.filter(a => a.status !== 'Pending').length}
                            />
                        </div>

                        {/* ── TABS ─────────────────────────────────────── */}
                        <div style={styles.tabBar}>
                            <button
                                style={activeTab === 'schedule' ? styles.tabActive : styles.tab}
                                onClick={() => setActiveTab('schedule')}
                            >
                                <FaCalendarAlt style={{ marginRight: 6 }} /> Class Schedule
                            </button>
                            <button
                                style={activeTab === 'assignments' ? styles.tabActive : styles.tab}
                                onClick={() => setActiveTab('assignments')}
                            >
                                <FaClipboardList style={{ marginRight: 6 }} /> Assignments
                                {data.assignments.filter(a => a.status === 'Pending').length > 0 && (
                                    <span style={styles.pendingDot}>
                                        {data.assignments.filter(a => a.status === 'Pending').length}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* ── TAB: CLASS SCHEDULE ──────────────────────── */}
                        {activeTab === 'schedule' && (
                            <div>
                                {/* Upcoming sessions */}
                                <h3 style={styles.subHeading}>Upcoming Sessions</h3>
                                {upcomingSessions.length === 0 ? (
                                    <EmptyState text="No upcoming sessions for this course." />
                                ) : (
                                    <div style={styles.sessionGrid}>
                                        {upcomingSessions.map(s => (
                                            <SessionCard key={s.session_id} session={s} upcoming />
                                        ))}
                                    </div>
                                )}

                                {/* Past sessions */}
                                {pastSessions.length > 0 && (
                                    <>
                                        <h3 style={{ ...styles.subHeading, marginTop: 30, color: '#9CA3AF' }}>
                                            Past Sessions
                                        </h3>
                                        <div style={styles.sessionGrid}>
                                            {pastSessions.map(s => (
                                                <SessionCard key={s.session_id} session={s} upcoming={false} />
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* ── TAB: ASSIGNMENTS ─────────────────────────── */}
                        {activeTab === 'assignments' && (
                            <div>
                                {data.assignments.length === 0 ? (
                                    <EmptyState text="No assignments for this course yet." />
                                ) : (
                                    <div style={styles.assignmentContainer}>
                                        <div style={styles.portalBox}>
                                            <p style={{ margin: '0 0 10px 0', color: '#4B5563', fontSize: '14px' }}>
                                                Manage your assignment submissions from the secure portal.
                                            </p>
                                            <button 
                                                style={styles.portalBtn}
                                                onClick={() => navigate('/student-assignments')}
                                            >
                                                Go to Submissions Portal
                                            </button>
                                        </div>
                                        <div style={styles.assignmentList}>
                                            {data.assignments.map(a => {
                                            const meta = statusMeta[a.status] || statusMeta.Pending;
                                            return (
                                                <div key={a.assignment_id} style={styles.assignmentCard}>
                                                    <div style={styles.assignmentLeft}>
                                                        <h4 style={styles.assignmentTitle}>{a.title}</h4>
                                                        {a.description && (
                                                            <p style={styles.assignmentDesc}>{a.description}</p>
                                                        )}
                                                        <div style={styles.assignmentMeta}>
                                                            <FaCalendarAlt size={11} color="#6B7280" />
                                                            <span>Due: {fmtDate(a.due_date)}</span>
                                                            {a.grade_value && a.grade_value !== 'Pending' && (
                                                                <span style={styles.gradeChip}>
                                                                    <FaStar size={10} /> {a.grade_value}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {a.feedback && a.feedback !== '-' && (
                                                            <p style={styles.feedbackText}>
                                                                💬 <em>{a.feedback}</em>
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
                                                        <span style={{ ...styles.statusBadge, color: meta.color, backgroundColor: meta.bg }}>
                                                            {meta.icon} <span style={{ marginLeft: 4 }}>{a.status}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                )}
            </main>
        </div>
    );
};

// ── Sub-components ──────────────────────────────────────────────────────────

const SessionCard = ({ session, upcoming }) => {
    const isOnline = session.class_type === 'Online';
    return (
        <div style={{ ...styles.sessionCard, opacity: upcoming ? 1 : 0.6 }}>
            <div style={{ ...styles.sessionDateBar, backgroundColor: upcoming ? '#2563EB' : '#9CA3AF' }}>
                <span style={styles.sessionDay}>{new Date(session.session_date).toLocaleDateString('en-GB', { day: 'numeric' })}</span>
                <span style={styles.sessionMonth}>{new Date(session.session_date).toLocaleDateString('en-GB', { month: 'short' })}</span>
            </div>
            <div style={styles.sessionBody}>
                <h4 style={styles.sessionTopic}>{session.topic || '—'}</h4>
                <div style={styles.sessionMeta}>
                    <FaClock size={11} color="#9CA3AF" />
                    <span>{fmtTime(session.session_time)}</span>
                </div>
                <div style={styles.sessionMeta}>
                    {isOnline ? (
                        <>
                            <FaVideo size={11} color="#2563EB" />
                            <span style={{ color: '#2563EB' }}>Online</span>
                        </>
                    ) : (
                        <>
                            <FaMapMarkerAlt size={11} color="#059669" />
                            <span style={{ color: '#059669' }}>{session.venue || 'Physical'}</span>
                        </>
                    )}
                </div>
            </div>
            <div style={styles.sessionAction}>
                {upcoming && isOnline && session.meeting_link ? (
                    <a
                        href={session.meeting_link.startsWith('http') ? session.meeting_link : `https://${session.meeting_link}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ textDecoration: 'none' }}
                    >
                        <button style={styles.joinBtn}><FaVideo size={10} style={{ marginRight: 5 }} /> Join</button>
                    </a>
                ) : upcoming ? (
                    <span style={styles.upcomingTag}>Upcoming</span>
                ) : (
                    <span style={styles.pastTag}>Completed</span>
                )}
            </div>
        </div>
    );
};

const StatChip = ({ icon, label, value }) => (
    <div style={styles.statChip}>
        <div style={styles.statIcon}>{icon}</div>
        <div>
            <div style={styles.statValue}>{value}</div>
            <div style={styles.statLabel}>{label}</div>
        </div>
    </div>
);

const EmptyState = ({ text }) => (
    <div style={styles.emptyState}>{text}</div>
);

// ── Styles ──────────────────────────────────────────────────────────────────
const styles = {
    container: { display: 'flex', height: '100vh', backgroundColor: '#F3F4F6', fontFamily: "'Inter', sans-serif" },
    main: { marginLeft: '250px', flex: 1, overflowY: 'auto' },
    content: { padding: '30px', maxWidth: '1100px' },
    centeredMsg: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', color: '#6B7280', fontSize: 16 },

    // Back button
    backBtn: { display: 'inline-flex', alignItems: 'center', background: 'none', border: 'none', color: '#2563EB', fontWeight: '600', cursor: 'pointer', fontSize: 14, marginBottom: 20, padding: 0 },

    // Header card
    headerCard: { backgroundColor: '#fff', borderRadius: 14, padding: '24px 28px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #E5E7EB', gap: 20 },
    headerLeft: { display: 'flex', alignItems: 'flex-start', gap: 18, flex: 1 },
    courseIcon: { width: 56, height: 56, borderRadius: 12, backgroundColor: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    courseTitle: { margin: '0 0 6px 0', fontSize: 20, fontWeight: 'bold', color: '#111827' },
    courseDesc: { margin: '0 0 10px 0', fontSize: 13, color: '#6B7280', lineHeight: 1.5 },
    gradeBadge: { backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '3px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700 },

    teacherBox: { display: 'flex', alignItems: 'center', gap: 14, backgroundColor: '#F9FAFB', padding: '14px 18px', borderRadius: 10, border: '1px solid #E5E7EB', flexShrink: 0 },
    teacherAvatar: { width: 44, height: 44, borderRadius: '50%', backgroundColor: '#2563EB', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 18 },
    teacherName: { margin: '0 0 3px 0', fontWeight: 600, fontSize: 14, color: '#374151', display: 'flex', alignItems: 'center' },
    teacherSpec: { margin: '2px 0 0 0', fontSize: 12, color: '#9CA3AF', display: 'flex', alignItems: 'center' },

    // Stats
    statsRow: { display: 'flex', gap: 14, marginBottom: 20 },
    statChip: { display: 'flex', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 10, padding: '14px 18px', flex: 1, border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
    statIcon: { width: 36, height: 36, borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    statValue: { fontSize: 20, fontWeight: 'bold', color: '#111827', lineHeight: 1 },
    statLabel: { fontSize: 11, color: '#9CA3AF', marginTop: 2 },

    // Tabs
    tabBar: { display: 'flex', gap: 8, marginBottom: 20, borderBottom: '2px solid #E5E7EB' },
    tab: { display: 'inline-flex', alignItems: 'center', padding: '10px 18px', background: 'none', border: 'none', borderBottom: '2px solid transparent', color: '#6B7280', fontWeight: 600, cursor: 'pointer', fontSize: 14, marginBottom: '-2px' },
    tabActive: { display: 'inline-flex', alignItems: 'center', padding: '10px 18px', background: 'none', border: 'none', borderBottom: '2px solid #2563EB', color: '#2563EB', fontWeight: 700, cursor: 'pointer', fontSize: 14, marginBottom: '-2px' },
    pendingDot: { marginLeft: 8, backgroundColor: '#FEF3C7', color: '#D97706', borderRadius: 999, fontSize: 11, padding: '2px 7px', fontWeight: 'bold' },

    subHeading: { fontSize: 15, fontWeight: 'bold', color: '#374151', margin: '0 0 14px 0' },

    // Session grid
    sessionGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 },
    sessionCard: { backgroundColor: '#fff', borderRadius: 12, border: '1px solid #E5E7EB', display: 'flex', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    sessionDateBar: { width: 54, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, flexShrink: 0 },
    sessionDay: { fontSize: 20, fontWeight: 'bold', color: '#fff', lineHeight: 1 },
    sessionMonth: { fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 600, textTransform: 'uppercase' },
    sessionBody: { flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 5 },
    sessionTopic: { margin: 0, fontSize: 14, fontWeight: 'bold', color: '#111827' },
    sessionMeta: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#6B7280' },
    sessionAction: { display: 'flex', alignItems: 'center', padding: '0 14px' },
    joinBtn: { backgroundColor: '#2563EB', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: 7, cursor: 'pointer', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' },
    upcomingTag: { fontSize: 11, color: '#059669', backgroundColor: '#D1FAE5', padding: '4px 10px', borderRadius: 999, fontWeight: 600 },
    pastTag: { fontSize: 11, color: '#9CA3AF', backgroundColor: '#F3F4F6', padding: '4px 10px', borderRadius: 999, fontWeight: 600 },

    // Assignment list
    assignmentList: { display: 'flex', flexDirection: 'column', gap: 12 },
    assignmentCard: { backgroundColor: '#fff', borderRadius: 12, padding: '18px 22px', border: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', gap: 16 },
    assignmentLeft: { flex: 1 },
    assignmentTitle: { margin: '0 0 4px 0', fontSize: 15, fontWeight: 'bold', color: '#111827' },
    assignmentDesc: { margin: '0 0 8px 0', fontSize: 13, color: '#6B7280', lineHeight: 1.4 },
    assignmentMeta: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6B7280' },
    gradeChip: { backgroundColor: '#D1FAE5', color: '#065F46', padding: '2px 8px', borderRadius: 999, fontWeight: 700, fontSize: 12, display: 'flex', alignItems: 'center', gap: 3 },
    feedbackText: { margin: '8px 0 0 0', fontSize: 12, color: '#6B7280', fontStyle: 'italic' },
    statusBadge: { display: 'inline-flex', alignItems: 'center', padding: '5px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700 },

    assignmentContainer: { display: 'flex', flexDirection: 'column', gap: '20px' },
    portalBox: { backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', padding: '20px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' },
    portalBtn: { backgroundColor: '#2563EB', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.2s' },


    emptyState: { textAlign: 'center', padding: '40px 20px', color: '#9CA3AF', fontSize: 14, backgroundColor: '#fff', borderRadius: 12, border: '1px solid #E5E7EB' },
};

export default StudentClassroom;
