import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    FaArrowLeft, FaVideo, FaClipboardList, FaPlus, FaTimes, FaCalendarAlt, FaClock, FaFileDownload, FaMapMarkerAlt
} from 'react-icons/fa';
import TeacherSidebar from '../components/TeacherSidebar';

// Injected CSS for Modals and Cards
const injectedStyles = `
    .nav-btn { transition: all 0.3s ease; }
    .nav-btn:hover { background-color: #E5E7EB; }
    .card-hover:hover { transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05); }
    .modal-overlay { animation: fadeIn 0.3s ease-out; }
    .modal-content { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
`;

const TeacherClassroom = () => {
    const { courseId, grade } = useParams();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('live_classes'); // 'live_classes' or 'assignments'
    const [courseDetails, setCourseDetails] = useState({});
    const [classes, setClasses] = useState([]);
    const [assignments, setAssignments] = useState([]);

    // Modal States
    const [showClassModal, setShowClassModal] = useState(false);
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);

    // Form States - Classes
    const [classForm, setClassForm] = useState({
        topic: '', session_date: '', session_time: '', class_type: 'Online', link_or_venue: ''
    });

    // Form States - Assignments
    const [assignmentForm, setAssignmentForm] = useState({
        title: '', description: '', due_date: '', file: null
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch initial data
    const fetchClassroomData = async () => {
        try {
            const [detailsRes, classesRes, assignmentsRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/classroom/${courseId}/${grade}/details`),
                axios.get(`http://localhost:5000/api/classroom/${courseId}/${grade}/classes`),
                axios.get(`http://localhost:5000/api/classroom/${courseId}/${grade}/assignments`)
            ]);
            setCourseDetails(detailsRes.data);
            setClasses(classesRes.data);
            setAssignments(assignmentsRes.data);
        } catch (error) {
            console.error("Error fetching classroom data", error);
            alert("Could not load classroom details.");
        }
    };

    useEffect(() => {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = injectedStyles;
        document.head.appendChild(styleSheet);

        fetchClassroomData();

        return () => { document.head.removeChild(styleSheet); };
    }, [courseId, grade]);

    // Handlers for Live Class
    const handleAddClass = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await axios.post('http://localhost:5000/api/classroom/classes/add', {
                course_id: courseId,
                grade: grade,
                topic: classForm.topic,
                session_date: classForm.session_date,
                session_time: classForm.session_time,
                link_or_venue: classForm.link_or_venue
            });
            alert("Class session scheduled successfully!");
            setShowClassModal(false);
            setClassForm({ topic: '', session_date: '', session_time: '', class_type: 'Online', link_or_venue: '' });
            fetchClassroomData();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to schedule class.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handlers for Assignments
    const handleAddAssignment = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('course_id', courseId);
            formData.append('grade', grade);
            formData.append('title', assignmentForm.title);
            formData.append('description', assignmentForm.description);
            formData.append('due_date', assignmentForm.due_date);
            if (assignmentForm.file) {
                formData.append('file', assignmentForm.file);
            }

            await axios.post('http://localhost:5000/api/classroom/assignments/add', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Assignment created successfully!");
            setShowAssignmentModal(false);
            setAssignmentForm({ title: '', description: '', due_date: '', file: null });
            fetchClassroomData();
        } catch (error) {
            alert(error.response?.data?.message || "Failed to create assignment.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={styles.container}>
            <TeacherSidebar />

            <main style={styles.main}>

                <div style={styles.content}>
                    {/* Header Layout */}
                    <div style={styles.headerBar}>
                        <button className="nav-btn" style={styles.backBtn} onClick={() => navigate('/teacher-courses')}>
                            <FaArrowLeft /> Back to Courses
                        </button>
                        <div style={styles.headerTitleArea}>
                            <h2 style={styles.courseTitle}>{courseDetails.title || 'Loading Course...'}</h2>
                            <div style={styles.badgeRow}>
                                <span style={styles.idBadge}>{courseId}</span>
                                <span style={styles.gradeBadge}>{grade}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs & Add Action */}
                    <div style={styles.actionBar}>
                        <div style={styles.tabsContainer}>
                            <button
                                style={activeTab === 'live_classes' ? styles.activeTab : styles.inactiveTab}
                                onClick={() => setActiveTab('live_classes')}
                            >
                                <FaVideo style={{ marginRight: 8 }} /> Live Classes
                            </button>
                            <button
                                style={activeTab === 'assignments' ? styles.activeTab : styles.inactiveTab}
                                onClick={() => setActiveTab('assignments')}
                            >
                                <FaClipboardList style={{ marginRight: 8 }} /> Assignments
                            </button>
                        </div>

                        {activeTab === 'live_classes' ? (
                            <button style={styles.primaryBtn} onClick={() => setShowClassModal(true)}>
                                <FaPlus style={{ marginRight: 8 }} /> Schedule New Class
                            </button>
                        ) : (
                            <button style={styles.primaryBtn} onClick={() => setShowAssignmentModal(true)}>
                                <FaPlus style={{ marginRight: 8 }} /> Create Assignment
                            </button>
                        )}
                    </div>

                    {/* Main Content Area */}
                    <div style={styles.listArea}>
                        {activeTab === 'live_classes' && (
                            <div style={styles.grid}>
                                {classes.length === 0 ? (
                                    <p style={styles.emptyState}>No class sessions scheduled yet.</p>
                                ) : classes.map(cls => (
                                    <div key={cls.session_id} className="card-hover" style={styles.card}>
                                        <div style={styles.cardHeaderClass}>
                                            <FaVideo size={20} color="#2563EB" />
                                            <span style={styles.dateBadge}>
                                                {new Date(cls.session_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div style={styles.cardBody}>
                                            <h4 style={styles.cardTitle}>{cls.topic}</h4>
                                            <div style={styles.iconRow}>
                                                <FaClock color="#6B7280" />
                                                <span>{cls.session_time}</span>
                                            </div>
                                            {(cls.link_or_venue && (cls.link_or_venue.includes('http') || cls.link_or_venue.includes('www'))) ? (
                                                <div style={styles.linkBox}>
                                                    <a href={cls.link_or_venue.startsWith('http') ? cls.link_or_venue : `https://${cls.link_or_venue}`} target="_blank" rel="noreferrer" style={styles.linkText}>
                                                        Join Venue/Link
                                                    </a>
                                                </div>
                                            ) : (
                                                <div style={styles.venueBadge}>
                                                    <FaMapMarkerAlt style={{ marginRight: 6 }} /> Location: {cls.link_or_venue}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'assignments' && (
                            <div style={styles.grid}>
                                {assignments.length === 0 ? (
                                    <p style={styles.emptyState}>No assignments created yet.</p>
                                ) : assignments.map(asn => (
                                    <div key={asn.assignment_id} className="card-hover" style={styles.card}>
                                        <div style={styles.cardHeaderAssignment}>
                                            <FaClipboardList size={20} color="#10B981" />
                                            <span style={styles.dueDateBadge}>
                                                Due: {new Date(asn.due_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div style={styles.cardBody}>
                                            <h4 style={styles.cardTitle}>{asn.title}</h4>
                                            <p style={styles.cardDesc}>{asn.description}</p>
                                            {asn.file_path && (
                                                <div style={{ marginTop: '15px' }}>
                                                    <a href={`http://localhost:5000${asn.file_path}`} target="_blank" rel="noreferrer" style={styles.downloadLink}>
                                                        <FaFileDownload style={{ marginRight: 6 }} /> Download Attachment
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* --- MODALS --- */}
            {/* 1. Schedule Class Modal */}
            {showClassModal && (
                <div className="modal-overlay" style={styles.modalOverlay}>
                    <div className="modal-content" style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>Schedule Class Session</h3>
                            <FaTimes style={styles.closeBtn} onClick={() => setShowClassModal(false)} />
                        </div>
                        <form onSubmit={handleAddClass}>
                            <div style={styles.modalBody}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.inputLabel}>Topic</label>
                                    <input type="text" required style={styles.modalInput} value={classForm.topic} onChange={e => setClassForm({ ...classForm, topic: e.target.value })} placeholder="E.g., Quantum Mechanics Ch. 1" />
                                </div>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <div style={{ ...styles.inputGroup, flex: 1 }}>
                                        <label style={styles.inputLabel}>Date</label>
                                        <input type="date" required style={styles.modalInput} value={classForm.session_date} onChange={e => setClassForm({ ...classForm, session_date: e.target.value })} />
                                    </div>
                                    <div style={{ ...styles.inputGroup, flex: 1 }}>
                                        <label style={styles.inputLabel}>Time</label>
                                        <input type="time" required style={styles.modalInput} value={classForm.session_time} onChange={e => setClassForm({ ...classForm, session_time: e.target.value })} />
                                    </div>
                                </div>
                                <div style={styles.segmentControl}>
                                    <button type="button" style={classForm.class_type === 'Online' ? styles.segmentBtnActive : styles.segmentBtnInactive} onClick={() => setClassForm({...classForm, class_type: 'Online'})}><FaVideo /> Online Class</button>
                                    <button type="button" style={classForm.class_type === 'Physical' ? styles.segmentBtnActive : styles.segmentBtnInactive} onClick={() => setClassForm({...classForm, class_type: 'Physical'})}><FaMapMarkerAlt /> Physical Class</button>
                                </div>
                                {classForm.class_type === 'Online' ? (
                                    <div style={styles.inputGroup}>
                                        <label style={styles.inputLabel}><FaVideo style={{marginRight: 6}} /> Meeting Link</label>
                                        <input type="text" required style={styles.modalInput} value={classForm.link_or_venue} onChange={e => setClassForm({...classForm, link_or_venue: e.target.value})} placeholder="Zoom or Google Meet Link" />
                                    </div>
                                ) : (
                                    <div style={styles.inputGroup}>
                                        <label style={styles.inputLabel}><FaMapMarkerAlt style={{marginRight: 6}} /> Physical Room Name</label>
                                        <input type="text" required style={styles.modalInput} value={classForm.link_or_venue} onChange={e => setClassForm({...classForm, link_or_venue: e.target.value})} placeholder="E.g., Room 102, Main Hall" />
                                    </div>
                                )}
                            </div>
                            <div style={styles.modalFooter}>
                                <button type="button" style={styles.cancelBtn} onClick={() => setShowClassModal(false)}>Cancel</button>
                                <button type="submit" disabled={isSubmitting} style={styles.primaryBtn}>{isSubmitting ? 'Saving...' : 'Schedule Class'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* 2. Create Assignment Modal */}
            {showAssignmentModal && (
                <div className="modal-overlay" style={styles.modalOverlay}>
                    <div className="modal-content" style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>Create New Assignment</h3>
                            <FaTimes style={styles.closeBtn} onClick={() => setShowAssignmentModal(false)} />
                        </div>
                        <form onSubmit={handleAddAssignment}>
                            <div style={styles.modalBody}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.inputLabel}>Assignment Title</label>
                                    <input type="text" required style={styles.modalInput} value={assignmentForm.title} onChange={e => setAssignmentForm({ ...assignmentForm, title: e.target.value })} placeholder="E.g., Midterm Essay" />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.inputLabel}>Description</label>
                                    <textarea required rows="4" style={styles.modalInput} value={assignmentForm.description} onChange={e => setAssignmentForm({ ...assignmentForm, description: e.target.value })} placeholder="Detailed instructions..."></textarea>
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.inputLabel}>Due Date</label>
                                    <input type="date" required style={styles.modalInput} value={assignmentForm.due_date} onChange={e => setAssignmentForm({ ...assignmentForm, due_date: e.target.value })} />
                                </div>
                                <div style={styles.inputGroup}>
                                    <label style={styles.inputLabel}>Attachment File (Optional)</label>
                                    <input type="file" style={styles.modalInput} onChange={e => setAssignmentForm({ ...assignmentForm, file: e.target.files[0] })} />
                                </div>
                            </div>
                            <div style={styles.modalFooter}>
                                <button type="button" style={styles.cancelBtn} onClick={() => setShowAssignmentModal(false)}>Cancel</button>
                                <button type="submit" disabled={isSubmitting} style={styles.primaryBtn}>{isSubmitting ? 'Saving...' : 'Publish Assignment'}</button>
                            </div>
                        </form>
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

    headerBar: { display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '30px', gap: '20px' },
    backBtn: { display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 15px', border: '1px solid #D1D5DB', borderRadius: '8px', backgroundColor: '#fff', color: '#4B5563', cursor: 'pointer', fontWeight: '600' },
    headerTitleArea: { flex: 1 },
    courseTitle: { margin: '0 0 8px 0', fontSize: '24px', fontWeight: '800', color: '#111827' },
    badgeRow: { display: 'flex', gap: '10px' },
    idBadge: { padding: '4px 10px', backgroundColor: '#F3F4F6', color: '#4B5563', borderRadius: '6px', fontSize: '12px', fontWeight: '700' },
    gradeBadge: { padding: '4px 10px', backgroundColor: '#EFF6FF', color: '#1E3A8A', borderRadius: '6px', fontSize: '12px', fontWeight: '700', border: '1px solid #BFDBFE' },

    actionBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    tabsContainer: { display: 'flex', backgroundColor: '#fff', padding: '5px', borderRadius: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #E5E7EB' },
    activeTab: { padding: '10px 20px', backgroundColor: '#2563EB', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: '0 2px 4px rgba(37,99,235,0.3)' },
    inactiveTab: { padding: '10px 20px', backgroundColor: 'transparent', color: '#6B7280', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center' },
    primaryBtn: { display: 'flex', alignItems: 'center', backgroundColor: '#2563EB', padding: '12px 24px', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 6px rgba(37,99,235,0.3)' },

    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' },
    emptyState: { gridColumn: '1 / -1', textAlign: 'center', padding: '50px', color: '#9CA3AF', fontSize: '16px', backgroundColor: '#fff', borderRadius: '16px', border: '1px dashed #D1D5DB' },

    card: { backgroundColor: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', overflow: 'hidden', transition: 'all 0.3s' },
    cardHeaderClass: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', backgroundColor: '#EFF6FF', borderBottom: '1px solid #E5E7EB' },
    cardHeaderAssignment: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', backgroundColor: '#ECFDF5', borderBottom: '1px solid #E5E7EB' },
    dateBadge: { fontWeight: '700', color: '#1E3A8A', fontSize: '13px' },
    dueDateBadge: { fontWeight: '700', color: '#DC2626', fontSize: '13px' }, // Red for due dates

    cardBody: { padding: '20px' },
    cardTitle: { margin: '0 0 10px 0', fontSize: '18px', color: '#111827', fontWeight: '700' },
    cardDesc: { margin: '0', color: '#6B7280', fontSize: '14px', lineHeight: '1.5', WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' },
    iconRow: { display: 'flex', alignItems: 'center', gap: '8px', color: '#6B7280', fontSize: '14px', marginBottom: '15px' },
    linkBox: { backgroundColor: '#F9FAFB', padding: '10px', borderRadius: '8px', textAlign: 'center', border: '1px solid #F3F4F6' },
    linkText: { color: '#2563EB', fontWeight: '600', textDecoration: 'none', fontSize: '14px' },
    downloadLink: { display: 'inline-flex', alignItems: 'center', color: '#10B981', fontWeight: '600', textDecoration: 'none', fontSize: '13px', backgroundColor: '#ECFDF5', padding: '8px 12px', borderRadius: '6px', border: '1px solid #A7F3D0', transition: 'all 0.2s' },

    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: '#fff', width: '90%', maxWidth: '500px', borderRadius: '20px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' },
    modalHeader: { padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F3F4F6' },
    modalTitle: { margin: 0, fontSize: '18px', fontWeight: '800', color: '#111827' },
    closeBtn: { cursor: 'pointer', color: '#9CA3AF', fontSize: '20px' },
    modalBody: { padding: '24px' },
    
    segmentControl: { display: 'flex', backgroundColor: '#F3F4F6', borderRadius: '8px', padding: '4px', marginBottom: '20px' },
    segmentBtnActive: { flex: 1, padding: '8px', border: 'none', backgroundColor: '#fff', borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', fontWeight: '600', color: '#111827', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' },
    segmentBtnInactive: { flex: 1, padding: '8px', border: 'none', backgroundColor: 'transparent', fontWeight: '600', color: '#6B7280', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' },

    inputGroup: { marginBottom: '20px', display: 'flex', flexDirection: 'column' },
    inputLabel: { display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' },
    modalInput: { width: '100%', boxSizing: 'border-box', padding: '12px 16px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '15px', outline: 'none', fontFamily: 'inherit' },
    modalFooter: { padding: '20px 24px', backgroundColor: '#F9FAFB', borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'flex-end', gap: '15px' },
    cancelBtn: { padding: '12px 20px', backgroundColor: 'transparent', border: '1px solid #D1D5DB', borderRadius: '8px', fontWeight: '600', color: '#4B5563', cursor: 'pointer' },
};

export default TeacherClassroom;
