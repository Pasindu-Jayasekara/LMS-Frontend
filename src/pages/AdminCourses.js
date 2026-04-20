import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBook, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import AdminSidebar from '../components/AdminSidebar';

const ManageCourses = () => {
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    // State for the new course form
    const [formData, setFormData] = useState({
        course_id: '',
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        enrollment_key: '', // Updated to track the password key
        teacher_id: '',
        monthly_fee: ''
    });

    const handleDelete = async (course_id) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            try {
                await axios.delete(`http://localhost:5000/api/courses/delete/${course_id}`);
                alert("Course deleted successfully!");
                fetchCourses();
            } catch (error) {
                console.error("Error deleting course:", error);
                alert("Failed to delete course.");
            }
        }
    };

    const handleEditClick = (course) => {
        setFormData({
            course_id: course.id,
            title: course.title || '',
            description: course.description || '',
            start_date: course.start || '',
            end_date: course.end || '',
            enrollment_key: course.enrollment_key || '',
            teacher_id: course.teacher_id || '',
            monthly_fee: course.monthly_fee || ''
        });
        setIsEditing(true);
    };

    // --- NEW: Fetch Courses from MySQL ---
    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/courses');
            setCourses(response.data);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    // --- NEW: Fetch Teachers List ---
    const fetchTeachers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/teachers/list');
            setTeachers(response.data);
        } catch (error) {
            console.error("Error fetching teachers:", error);
        }
    };

    // Load courses and teachers when page loads
    useEffect(() => {
        fetchCourses();
        fetchTeachers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const courseData = {
            course_id: formData.course_id,
            title: formData.title,
            description: formData.description,
            start_date: formData.start_date, 
            end_date: formData.end_date,
            enrollment_key: formData.enrollment_key,
            teacher_id: formData.teacher_id || null,
            monthly_fee: formData.monthly_fee || 3500.00
        };

        try {
            if (isEditing) {
                await axios.put(`http://localhost:5000/api/courses/edit/${formData.course_id}`, courseData);
                alert('Course updated successfully!');
            } else {
                await axios.post('http://localhost:5000/api/courses/add', courseData);
                alert('Course created successfully in MySQL!');
            }
            fetchCourses();
            setFormData({
                course_id: '', title: '', description: '', 
                start_date: '', end_date: '', enrollment_key: '', teacher_id: '', monthly_fee: ''
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving course:', error);
            alert('Failed to save course. Check console for details.');
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
                        <h2 style={styles.pageTitle}><FaBook style={{marginRight: 10, color: '#2563EB'}}/> Course Management</h2>
                        <p style={styles.subText}>Create new courses and assign teachers.</p>
                    </div>

                    <div style={styles.grid}>
                        {/* LEFT SIDE: CREATE COURSE FORM */}
                        <div style={styles.card}>
                            <h3 style={styles.cardTitle}>Add New Course</h3>
                            <form onSubmit={handleSubmit} style={styles.form}>
                                
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Course ID</label>
                                    <input type="text" name="course_id" value={formData.course_id} onChange={handleChange} placeholder="e.g. C003" style={{...styles.input, backgroundColor: isEditing ? '#f3f4f6' : '#fff'}} readOnly={isEditing} required />
                                </div>

                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Course Title</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Chemistry" style={styles.input} required />
                                </div>

                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Short details about the course..." style={{...styles.input, height: '80px', resize: 'none'}} />
                                </div>

                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Monthly Fee (Rs.)</label>
                                    <input type="number" step="0.01" name="monthly_fee" value={formData.monthly_fee} onChange={handleChange} placeholder="e.g. 3500.00" style={styles.input} required />
                                </div>

                                <div style={{display: 'flex', gap: '15px'}}>
                                    <div style={{...styles.inputGroup, flex: 1}}>
                                        <label style={styles.label}>Start Date</label>
                                        <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} style={styles.input} required />
                                    </div>
                                    <div style={{...styles.inputGroup, flex: 1}}>
                                        <label style={styles.label}>End Date</label>
                                        <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} style={styles.input} required />
                                    </div>
                                </div>

                                {/* NEW: Assign Teacher Dropdown */}
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Assign Teacher</label>
                                    <select 
                                        name="teacher_id" 
                                        value={formData.teacher_id} 
                                        onChange={handleChange} 
                                        style={styles.input}
                                    >
                                        <option value="">Select a Teacher (Optional)</option>
                                        {teachers.map(t => (
                                            <option key={t.teacher_id} value={t.teacher_id}>
                                                {t.first_name} {t.last_name} ({t.teacher_id})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* CHANGED: Enrollment Key instead of Teacher Dropdown */}
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Course Enrollment Password</label>
                                    <input 
                                        type="text" 
                                        name="enrollment_key" 
                                        value={formData.enrollment_key} 
                                        onChange={handleChange} 
                                        placeholder="e.g., bio2026" 
                                        style={styles.input} 
                                        required 
                                    />
                                    <p style={{fontSize: 12, color: '#6B7280', margin: '5px 0 0 0'}}>
                                        Share this password with the relevant teacher so they can enroll.
                                    </p>
                                </div>

                                <button type="submit" style={{...styles.submitBtn, backgroundColor: isEditing ? '#10B981' : '#2563EB'}}>
                                    {isEditing ? <FaEdit style={{marginRight: '8px'}} /> : <FaPlus style={{marginRight: '8px'}} />} {isEditing ? "Update Course" : "Create Course"}
                                </button>
                                {isEditing && (
                                    <button type="button" onClick={() => { setIsEditing(false); setFormData({course_id: '', title: '', description: '', start_date: '', end_date: '', enrollment_key: '', teacher_id: ''}); }} style={{...styles.submitBtn, backgroundColor: '#EF4444', marginTop: '10px'}}>
                                        Cancel Edit
                                    </button>
                                )}
                            </form>
                        </div>

                        {/* RIGHT SIDE: EXISTING COURSES LIST */}
                        <div style={styles.card}>
                            <h3 style={styles.cardTitle}>Existing Courses</h3>
                            <div style={styles.listContainer}>
                                {courses.map((course, index) => (
                                    <div key={index} style={styles.courseItem}>
                                        <div style={{flex: 1}}>
                                            <h4 style={styles.courseName}>{course.title} <span style={styles.courseIdBadge}>{course.id}</span></h4>
                                            <p style={styles.courseDetail}>Instructor: {course.teacher || 'Unassigned'}</p>
                                            <p style={styles.courseDetail}>Duration: {course.start} to {course.end}</p>
                                            <p style={styles.courseDetail}>Enrollment Key: {course.enrollment_key || 'None'}</p>
                                        </div>
                                        <div style={styles.actionButtons}>
                                            <button style={styles.editBtn} title="Edit" onClick={() => handleEditClick(course)}><FaEdit /></button>
                                            <button style={styles.deleteBtn} title="Delete" onClick={() => handleDelete(course.id)}><FaTrash /></button>
                                        </div>
                                    </div>
                                ))}
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
    container: { display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#F9FAFB', fontFamily: 'sans-serif', overflow: 'hidden' },
    sidebarWrapper: { width: '250px', flexShrink: 0, height: '100%', overflowY: 'auto' },
    main: { flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' },
    content: { flex: 1, overflowY: 'auto', padding: '30px', boxSizing: 'border-box' },
    pageHeader: { marginBottom: '25px' },
    pageTitle: { margin: 0, fontSize: '24px', color: '#111827', display: 'flex', alignItems: 'center' },
    subText: { margin: '5px 0 0 0', color: '#6B7280', fontSize: '14px' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' },
    card: { backgroundColor: '#fff', borderRadius: '12px', padding: '25px', border: '1px solid #E5E7EB', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' },
    cardTitle: { margin: '0 0 20px 0', fontSize: '18px', color: '#374151', borderBottom: '2px solid #F3F4F6', paddingBottom: '10px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
    label: { fontSize: '13px', fontWeight: '600', color: '#4B5563' },
    input: { padding: '10px 12px', borderRadius: '6px', border: '1px solid #D1D5DB', outline: 'none', fontSize: '14px', fontFamily: 'inherit' },
    submitBtn: { marginTop: '10px', backgroundColor: '#2563EB', color: '#fff', border: 'none', padding: '12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' },
    listContainer: { display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto' },
    courseItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB' },
    courseName: { margin: '0 0 5px 0', fontSize: '16px', color: '#111827', display: 'flex', alignItems: 'center', gap: '10px' },
    courseIdBadge: { backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' },
    courseDetail: { margin: '2px 0', fontSize: '13px', color: '#6B7280' },
    actionButtons: { display: 'flex', gap: '10px' },
    editBtn: { backgroundColor: '#fff', border: '1px solid #D1D5DB', color: '#4B5563', padding: '8px', borderRadius: '6px', cursor: 'pointer' },
    deleteBtn: { backgroundColor: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '8px', borderRadius: '6px', cursor: 'pointer' }
};

export default ManageCourses;