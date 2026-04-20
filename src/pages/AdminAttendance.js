import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaQrcode, FaCheckCircle, FaUsers, FaPlay } from 'react-icons/fa';
import { QRCodeSVG } from 'qrcode.react';
import AdminSidebar from '../components/AdminSidebar';


const ManageAttendance = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('');
    
    // Session State
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [sessionId, setSessionId] = useState('');
    const [scans, setScans] = useState([]);

    // Fetch courses on mount
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/attendance/courses');
                setCourses(response.data);
                if (response.data.length > 0) {
                    setSelectedCourse(response.data[0].id);
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
            }
        };
        fetchCourses();
    }, []);

    // Polling effect for live feed
    useEffect(() => {
        let interval;
        if (isSessionActive && sessionId) {
            interval = setInterval(async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/attendance/live-feed/${sessionId}`);
                    setScans(response.data);
                } catch (error) {
                    console.error("Error polling live feed:", error);
                }
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [isSessionActive, sessionId]);

    // Construct the hidden URL
    const qrLink = `http://localhost:3000/mark-attendance?session=${sessionId}`;

    const handleStartAttendance = async () => {
        if (!selectedCourse || !selectedGrade) {
            alert("Please select both a Course and a Grade to start a session.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/attendance/start-session', {
                course_id: selectedCourse,
                grade: selectedGrade
            });
            
            setSessionId(response.data.session_id);
            setIsSessionActive(true);
            setScans([]); // clear previous scans
            alert("Attendance Session Started! QR Code is now live.");
        } catch (error) {
            console.error("Error starting session:", error);
            alert("Failed to start session. Check console.");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.sidebarWrapper}>
                <AdminSidebar />
            </div>

            <main style={styles.main}>
                <div style={styles.content}>
                    <div style={styles.pageHeader}>
                        <h2 style={styles.pageTitle}><FaQrcode style={{marginRight: 10, color: '#8B5CF6'}}/> QR Attendance Scanner</h2>
                        <p style={styles.subText}>Generate a unique QR code for live classes. Students scan to mark presence.</p>
                    </div>

                    <div style={styles.grid}>
                        
                        {/* LEFT SIDE: QR CODE GENERATOR */}
                        <div style={styles.card}>
                            <h3 style={styles.cardTitle}>Generate Live QR</h3>
                            
                            <div style={{display: 'flex', gap: '15px'}}>
                                <div style={{...styles.inputGroup, flex: 1}}>
                                    <label style={styles.label}>Select Course</label>
                                    <select 
                                        style={styles.input} 
                                        value={selectedCourse} 
                                        onChange={(e) => setSelectedCourse(e.target.value)}
                                        disabled={isSessionActive}
                                    >
                                        <option value="">-- Choose Course --</option>
                                        {courses.map(course => (
                                            <option key={course.id} value={course.id}>{course.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{...styles.inputGroup, flex: 1}}>
                                    <label style={styles.label}>Select Grade</label>
                                    <select 
                                        style={styles.input} 
                                        value={selectedGrade} 
                                        onChange={(e) => setSelectedGrade(e.target.value)}
                                        disabled={isSessionActive}
                                    >
                                        <option value="">-- Choose Grade --</option>
                                        <option value="Grade 12">Grade 12</option>
                                        <option value="Grade 13">Grade 13</option>
                                        <option value="Revision">Revision</option>
                                    </select>
                                </div>
                            </div>

                            {!isSessionActive ? (
                                <button onClick={handleStartAttendance} style={styles.startBtn}>
                                    <FaPlay style={{marginRight: '8px'}} /> Start Attendance Session
                                </button>
                            ) : (
                                <div style={styles.qrDisplayArea}>
                                    <p style={{fontSize: 14, color: '#6B7280', marginBottom: 15}}>Ask students to scan this code</p>
                                    
                                    <div style={styles.qrBorder}>
                                        <QRCodeSVG value={qrLink} size={200} />
                                    </div>
                                    
                                    <p style={styles.qrLinkText}>{qrLink}</p>
                                    
                                    <button onClick={() => setIsSessionActive(false)} style={styles.stopBtn}>
                                        End Session
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* RIGHT SIDE: LIVE SCAN FEED */}
                        <div style={styles.card}>
                            <h3 style={styles.cardTitle}><FaUsers color="#2563EB" style={{marginRight: 8}}/> Live Scan Feed</h3>
                            
                            {isSessionActive ? (
                                <div style={styles.liveIndicator}>
                                    <div style={styles.pulsingDot}></div> Waiting for scans...
                                </div>
                            ) : (
                                <p style={{fontSize: 13, color: '#9CA3AF', marginBottom: 15}}>Start a session to see live scans.</p>
                            )}

                            <div style={styles.listContainer}>
                                {scans.length > 0 ? scans.map((scan, index) => (
                                    <div key={index} style={styles.scanItem}>
                                        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                                            <FaCheckCircle color="#10B981" size={20} />
                                            <div>
                                                <div style={styles.studentName}>{scan.name} <span style={{fontSize: 11, color: '#6B7280'}}>({scan.id})</span></div>
                                                <div style={styles.scanTime}>Scanned at {scan.time}</div>
                                            </div>
                                        </div>
                                        <div style={styles.presentBadge}>Present</div>
                                    </div>
                                )) : (
                                    isSessionActive && <p style={{fontSize: 13, color: '#6B7280', margin: 0}}>No scans yet for session {sessionId}.</p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

// --- STYLES ---
const styles = {
    // Standard Layout Logic
    container: { display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#F9FAFB', fontFamily: 'sans-serif', overflow: 'hidden' },
    sidebarWrapper: { width: '250px', flexShrink: 0, height: '100%', overflowY: 'auto' },
    main: { flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' },
    content: { flex: 1, overflowY: 'auto', padding: '30px', boxSizing: 'border-box' },

    pageHeader: { marginBottom: '25px' },
    pageTitle: { margin: 0, fontSize: '24px', color: '#111827', display: 'flex', alignItems: 'center' },
    subText: { margin: '5px 0 0 0', color: '#6B7280', fontSize: '14px' },

    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },

    // Card & Input Styles
    card: { backgroundColor: '#fff', borderRadius: '12px', padding: '25px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' },
    cardTitle: { margin: '0 0 20px 0', fontSize: '18px', color: '#374151', borderBottom: '2px solid #F3F4F6', paddingBottom: '10px', display: 'flex', alignItems: 'center' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' },
    label: { fontSize: '14px', fontWeight: '600', color: '#374151' },
    input: { padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', outline: 'none', fontSize: '14px', fontFamily: 'inherit', backgroundColor: '#F9FAFB' },
    
    // Buttons
    startBtn: { backgroundColor: '#8B5CF6', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' },
    stopBtn: { marginTop: '20px', backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%' },

    // QR Display
    qrDisplayArea: { display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#F9FAFB', padding: '20px', borderRadius: '12px', border: '1px dashed #D1D5DB' },
    qrBorder: { padding: '15px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
    qrLinkText: { marginTop: '15px', fontSize: '11px', color: '#9CA3AF', wordBreak: 'break-all', textAlign: 'center' },

    // Live Feed list
    liveIndicator: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#10B981', fontWeight: 'bold', marginBottom: '15px' },
    pulsingDot: { width: '8px', height: '8px', backgroundColor: '#10B981', borderRadius: '50%', animation: 'pulse 1.5s infinite' },
    listContainer: { display: 'flex', flexDirection: 'column', gap: '12px' },
    scanItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' },
    studentName: { fontSize: '14px', fontWeight: 'bold', color: '#111827' },
    scanTime: { fontSize: '12px', color: '#6B7280' },
    presentBadge: { backgroundColor: '#D1FAE5', color: '#065F46', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }
};

export default ManageAttendance;