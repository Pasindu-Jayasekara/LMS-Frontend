import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FaSearch, FaBookOpen, FaPlus, FaTimes, FaFileDownload, FaTrash, FaHashtag, FaUpload
} from 'react-icons/fa';
import TeacherSidebar from '../components/TeacherSidebar';

// Fetch the logged-in teacher ID
const loggedInTeacherId = sessionStorage.getItem('userId') || 'T2701';

const injectedStyles = `
    .material-card { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid #E5E7EB; background: white; }
    .material-card:hover { transform: translateY(-4px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05); border-color: #93C5FD; }
    
    .primary-btn { transition: all 0.2s; background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%); }
    .primary-btn:hover { box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4); transform: translateY(-1px); filter: brightness(1.1); }
    
    .modal-overlay { animation: fadeIn 0.3s ease-out; }
    .modal-content { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    
    .close-btn:hover { color: #EF4444 !important; transform: rotate(90deg); transition: 0.3s ease-in-out; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
`;

const TeacherMaterials = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [materials, setMaterials] = useState([]);
    const [myCourses, setMyCourses] = useState([]);

    // Upload Modal State
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadForm, setUploadForm] = useState({
        title: '', course_id: '', file: null
    });
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');

    const fetchData = async () => {
        try {
            const [materialsRes, coursesRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/materials/teacher/${loggedInTeacherId}`),
                axios.get(`http://localhost:5000/api/teacher-courses/my-courses/${loggedInTeacherId}`)
            ]);
            setMaterials(materialsRes.data);
            setMyCourses(coursesRes.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = injectedStyles;
        document.head.appendChild(styleSheet);

        fetchData();

        return () => { document.head.removeChild(styleSheet); };
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        
        if (!uploadForm.title || !uploadForm.course_id || !uploadForm.file) {
            setUploadError("Please fill out all fields and select a file.");
            return;
        }

        setIsUploading(true);
        setUploadError('');

        const formData = new FormData();
        formData.append('title', uploadForm.title);
        formData.append('course_id', uploadForm.course_id);
        formData.append('teacher_id', loggedInTeacherId);
        formData.append('file', uploadForm.file);

        try {
            await axios.post('http://localhost:5000/api/materials/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("Material uploaded successfully!");
            setIsUploadModalOpen(false);
            setUploadForm({ title: '', course_id: '', file: null });
            fetchData(); // Refresh list
        } catch (error) {
            setUploadError(error.response?.data?.message || "Upload failed.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (materialId) => {
        if (!window.confirm("Are you sure you want to delete this material?")) return;
        
        try {
            await axios.delete(`http://localhost:5000/api/materials/${materialId}`);
            fetchData();
        } catch (error) {
            alert("Failed to delete material.");
        }
    };

    const displayedMaterials = materials.filter(m => 
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        m.course_title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.container}>
            <TeacherSidebar />

            <main style={styles.main}>
                <div style={styles.content}>
                    {/* Welcome Bar */}
                    <div style={styles.welcomeBar}>
                        <div>
                            <h2 style={styles.welcomeText}>Course Materials Library</h2>
                            <p style={styles.subText}>Upload and manage resources for your assigned courses.</p>
                        </div>
                        <div style={styles.teacherIdBadge}>
                            <FaHashtag color="#3B82F6" /> ID: {loggedInTeacherId}
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div style={styles.actionBar}>
                        <div style={styles.searchBox}>
                            <FaSearch color="#6B7280" />
                            <input
                                type="text"
                                placeholder="Search by title or course..."
                                style={styles.searchInput}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button 
                            className="primary-btn" 
                            style={styles.primaryBtnAction}
                            onClick={() => setIsUploadModalOpen(true)}
                        >
                            <FaUpload style={{ marginRight: 8 }} /> Upload Material
                        </button>
                    </div>

                    {/* Dynamic Grid Rendering */}
                    <div style={styles.grid}>
                        {displayedMaterials.length === 0 ? (
                            <p style={styles.emptyState}>No materials uploaded yet.</p>
                        ) : displayedMaterials.map(mat => (
                            <div key={mat.material_id} className="material-card" style={styles.card}>
                                <div style={styles.cardHeader}>
                                    <div style={styles.iconBox}>
                                        <FaBookOpen color="#fff" size={18} />
                                    </div>
                                    <span style={styles.dateBadge}>{mat.upload_date}</span>
                                </div>

                                <div style={styles.cardBody}>
                                    <h3 style={styles.materialTitle}>{mat.title}</h3>
                                    <p style={styles.courseName}>Course: {mat.course_title || mat.course_id}</p>

                                    <div style={{ flex: 1 }}></div>

                                    <div style={styles.actionRow}>
                                        <a 
                                            href={`http://localhost:5000${mat.file_link}`} 
                                            target="_blank" 
                                            rel="noreferrer" 
                                            style={styles.downloadBtn}
                                        >
                                            <FaFileDownload style={{ marginRight: 6 }} /> Download
                                        </a>
                                        <button 
                                            style={styles.deleteBtn}
                                            onClick={() => handleDelete(mat.material_id)}
                                            title="Delete Material"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div className="modal-overlay" style={styles.modalOverlay}>
                    <div className="modal-content" style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>Upload New Material</h3>
                            <FaTimes
                                className="close-btn"
                                style={styles.closeBtn}
                                onClick={() => setIsUploadModalOpen(false)}
                            />
                        </div>

                        <div style={styles.modalBody}>
                            <form onSubmit={handleUpload}>
                                <div style={styles.inputGroup}>
                                    <label style={styles.inputLabel}>Material Title</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="E.g., Chapter 1 Notes"
                                        style={styles.modalInput}
                                        value={uploadForm.title}
                                        onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                                    />
                                </div>

                                <div style={styles.inputGroup}>
                                    <label style={styles.inputLabel}>Select Course</label>
                                    <select 
                                        required
                                        style={styles.modalInput} 
                                        value={uploadForm.course_id} 
                                        onChange={(e) => setUploadForm({ ...uploadForm, course_id: e.target.value })}
                                    >
                                        <option value="">-- Choose Assigned Course --</option>
                                        {myCourses.map(c => (
                                            <option key={c.course_id} value={c.course_id}>
                                                {c.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div style={styles.inputGroup}>
                                    <label style={styles.inputLabel}>Upload File</label>
                                    <input
                                        type="file"
                                        required
                                        accept=".pdf,.doc,.docx,.ppt,.pptx"
                                        style={styles.modalInput}
                                        onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files[0] })}
                                    />
                                    {uploadError && <p style={styles.errorText}>{uploadError}</p>}
                                </div>
                                
                                <div style={styles.modalFooter}>
                                    <button type="button" style={styles.cancelBtn} onClick={() => setIsUploadModalOpen(false)}>Cancel</button>
                                    <button
                                        type="submit"
                                        className="primary-btn"
                                        style={isUploading ? styles.submitBtnDisabled : styles.submitBtnConfirm}
                                        disabled={isUploading}
                                    >
                                        {isUploading ? 'Uploading...' : 'Upload File'}
                                    </button>
                                </div>
                            </form>
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

    actionBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },

    searchBox: { display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '12px 20px', borderRadius: '12px', border: '1px solid #E5E7EB', width: '350px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
    searchInput: { border: 'none', outline: 'none', marginLeft: '12px', width: '100%', fontSize: '15px' },
    primaryBtnAction: { display: 'flex', alignItems: 'center', backgroundColor: '#2563EB', padding: '12px 24px', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 6px rgba(37,99,235,0.3)' },

    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' },
    emptyState: { gridColumn: '1 / -1', textAlign: 'center', padding: '50px', color: '#9CA3AF', fontSize: '16px', backgroundColor: '#fff', borderRadius: '16px', border: '1px dashed #D1D5DB' },

    card: { borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    cardHeader: { padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F3F4F6', backgroundColor: '#EFF6FF' },
    iconBox: { width: '40px', height: '40px', backgroundColor: '#2563EB', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 6px rgba(37,99,235,0.2)' },
    dateBadge: { fontSize: '12px', padding: '4px 10px', backgroundColor: '#DBEAFE', borderRadius: '8px', color: '#1E3A8A', fontWeight: '700' },

    cardBody: { padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' },
    materialTitle: { margin: '0 0 8px 0', fontSize: '18px', color: '#111827', fontWeight: '700' },
    courseName: { margin: '0 0 20px 0', fontSize: '14px', color: '#4B5563', fontWeight: '500' },

    actionRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', gap: '10px' },
    downloadBtn: { flex: 1, backgroundColor: '#10B981', color: '#fff', padding: '10px', borderRadius: '8px', textAlign: 'center', textDecoration: 'none', fontWeight: '600', fontSize: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: '0.2s', boxShadow: '0 2px 4px rgba(16,185,129,0.3)' },
    deleteBtn: { backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', transition: '0.2s' },

    // Modal Styles
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(17, 24, 39, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: '#fff', width: '90%', maxWidth: '450px', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' },

    modalHeader: { padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F3F4F6' },
    modalTitle: { margin: 0, fontSize: '18px', fontWeight: '800', color: '#111827' },
    closeBtn: { cursor: 'pointer', color: '#9CA3AF', fontSize: '20px' },

    modalBody: { padding: '24px' },
    inputGroup: { marginBottom: '20px' },
    inputLabel: { display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' },
    modalInput: { width: '100%', boxSizing: 'border-box', padding: '12px 16px', border: '1px solid #D1D5DB', borderRadius: '10px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', backgroundColor: '#F9FAFB' },
    errorText: { color: '#EF4444', fontSize: '13px', margin: '8px 0 0 0', fontWeight: '500' },

    modalFooter: { display: 'flex', gap: '15px', marginTop: '20px' },
    cancelBtn: { flex: 1, padding: '12px', backgroundColor: '#fff', border: '1px solid #D1D5DB', borderRadius: '10px', fontWeight: '600', color: '#4B5563', cursor: 'pointer', transition: 'background-color 0.2s' },
    submitBtnConfirm: { flex: 2, padding: '12px', backgroundColor: '#2563EB', border: 'none', borderRadius: '10px', fontWeight: '700', color: '#fff', cursor: 'pointer' },
    submitBtnDisabled: { flex: 2, padding: '12px', backgroundColor: '#93C5FD', border: 'none', borderRadius: '10px', fontWeight: '700', color: '#fff', cursor: 'not-allowed' }
};

export default TeacherMaterials;
