import React, { useState } from 'react';
import { 
    FaSearch, FaPlus, FaBook, FaEdit, FaTrash, 
    FaCheckCircle, FaTimesCircle, FaChalkboardTeacher, FaUserGraduate 
} from 'react-icons/fa';
import AdminSidebar from '../components/AdminSidebar';
import Header from '../components/Header';

const AdminCourses = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [gradeFilter, setGradeFilter] = useState('All Grades');
    const [statusFilter, setStatusFilter] = useState('All Status');

    // Dummy Data matching your screenshot
    const courses = [
        { id: 1, title: 'Advanced Mathematics', grade: '12th Grade', teacher: 'Dr. Sarah Miller', students: 32, status: 'Active', duration: 'Jan 15, 2023 - Dec 15, 2023', color: '#2563EB' },
        { id: 2, title: 'Physics 101', grade: '11th Grade', teacher: 'Prof. Robert Davis', students: 28, status: 'Active', duration: 'Jan 15, 2023 - Dec 15, 2023', color: '#2563EB' },
        { id: 3, title: 'Computer Science', grade: '12th Grade', teacher: 'Dr. James Wilson', students: 24, status: 'Active', duration: 'Jan 15, 2023 - Dec 15, 2023', color: '#2563EB' },
        { id: 4, title: 'English Literature', grade: '10th Grade', teacher: 'Prof. Emma Thompson', students: 35, status: 'Active', duration: 'Jan 15, 2023 - Dec 15, 2023', color: '#2563EB' },
        { id: 5, title: 'Biology', grade: '11th Grade', teacher: 'Dr. Michael Brown', students: 30, status: 'Inactive', duration: 'Jan 15, 2022 - Dec 15, 2022', color: '#2563EB' },
        { id: 6, title: 'World History', grade: '9th Grade', teacher: 'Prof. Sophia Lee', students: 38, status: 'Active', duration: 'Jan 15, 2023 - Dec 15, 2023', color: '#2563EB' },
    ];

    // Filter Logic
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGrade = gradeFilter === 'All Grades' || course.grade === gradeFilter;
        const matchesStatus = statusFilter === 'All Status' || course.status === statusFilter;
        return matchesSearch && matchesGrade && matchesStatus;
    });

    return (
        <div style={styles.container}>
            <AdminSidebar />
            <main style={styles.main}>
                <Header title="Course Management" />
                
                <div style={styles.content}>
                    
                    {/* Stats Row */}
                    <div style={styles.statsGrid}>
                        <StatCard 
                            icon={<FaBook size={20} color="#2563EB"/>} 
                            label="Total Courses" 
                            value="6" 
                            bg="#DBEAFE"
                        />
                        <StatCard 
                            icon={<FaChalkboardTeacher size={20} color="#7E22CE"/>} 
                            label="Active Teachers" 
                            value="5" 
                            bg="#F3E8FF"
                        />
                        <StatCard 
                            icon={<FaUserGraduate size={20} color="#059669"/>} 
                            label="Enrolled Students" 
                            value="187" 
                            bg="#DCFCE7"
                        />
                    </div>

                    {/* Toolbar */}
                    <div style={styles.toolbar}>
                        <button style={styles.addBtn}>
                            <FaPlus style={{marginRight: 8}}/> Add New Course
                        </button>

                        <div style={styles.filters}>
                            <div style={styles.searchBox}>
                                <FaSearch color="#9CA3AF" />
                                <input 
                                    placeholder="Search courses..." 
                                    style={styles.searchInput}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            <select 
                                style={styles.select}
                                onChange={(e) => setGradeFilter(e.target.value)}
                            >
                                <option>All Grades</option>
                                <option>12th Grade</option>
                                <option>11th Grade</option>
                                <option>10th Grade</option>
                                <option>9th Grade</option>
                            </select>

                            <select 
                                style={styles.select}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option>All Status</option>
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    <div style={styles.tableCard}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.headerRow}>
                                    <th style={styles.th}>Course Name</th>
                                    <th style={styles.th}>Grade</th>
                                    <th style={styles.th}>Teacher</th>
                                    <th style={styles.th}>Students</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Duration</th>
                                    <th style={{...styles.th, textAlign: 'right'}}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCourses.map(course => (
                                    <tr key={course.id} style={styles.row}>
                                        <td style={styles.td}>
                                            <div style={styles.courseCell}>
                                                <div style={styles.iconBox}><FaBook size={12}/></div>
                                                <span style={styles.titleText}>{course.title}</span>
                                            </div>
                                        </td>
                                        <td style={styles.td}>{course.grade}</td>
                                        <td style={styles.td}>{course.teacher}</td>
                                        <td style={styles.td}>{course.students}</td>
                                        <td style={styles.td}>
                                            <div style={getStatusStyle(course.status)}>
                                                {course.status === 'Active' ? <FaCheckCircle size={10}/> : <FaTimesCircle size={10}/>}
                                                {course.status}
                                            </div>
                                        </td>
                                        <td style={{...styles.td, color: '#6B7280', fontSize: 13}}>{course.duration}</td>
                                        <td style={{...styles.td, textAlign: 'right'}}>
                                            <div style={styles.actions}>
                                                <button style={styles.editBtn}><FaEdit /></button>
                                                <button style={styles.deleteBtn}><FaTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </main>
        </div>
    );
};

// Helper Components
const StatCard = ({ icon, label, value, bg }) => (
    <div style={styles.statCard}>
        <div style={{...styles.statIconBox, backgroundColor: bg}}>{icon}</div>
        <div>
            <div style={{fontSize: 13, color: '#6B7280'}}>{label}</div>
            <div style={{fontSize: 24, fontWeight: 'bold', color: '#111827'}}>{value}</div>
        </div>
    </div>
);

// Helper Styles
const getStatusStyle = (status) => {
    const base = { display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', width: 'fit-content' };
    if (status === 'Active') return { ...base, backgroundColor: '#DCFCE7', color: '#059669' }; 
    return { ...base, backgroundColor: '#FEE2E2', color: '#DC2626' }; 
};

const styles = {
    container: { display: 'flex', height: '100vh', background: '#F9FAFB', fontFamily: 'sans-serif' },
    main: { marginLeft: '250px', flex: 1, display: 'flex', flexDirection: 'column' },
    content: { padding: '30px', overflowY: 'auto' },

    // Stats
    statsGrid: { display: 'flex', gap: '20px', marginBottom: '30px' },
    statCard: { flex: 1, background: '#fff', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #E5E7EB', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
    statIconBox: { width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },

    // Toolbar
    toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
    addBtn: { backgroundColor: '#2563EB', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: '600' },
    
    filters: { display: 'flex', gap: '15px' },
    searchBox: { display: 'flex', alignItems: 'center', backgroundColor: '#fff', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', width: '250px' },
    searchInput: { border: 'none', outline: 'none', marginLeft: '10px', width: '100%', fontSize: '14px' },
    select: { padding: '8px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none', cursor: 'pointer', backgroundColor: '#fff' },

    // Table
    tableCard: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
    table: { width: '100%', borderCollapse: 'collapse' },
    headerRow: { textAlign: 'left', borderBottom: '1px solid #E5E7EB' },
    th: { padding: '15px 20px', fontSize: '12px', color: '#6B7280', fontWeight: '600' },
    
    row: { borderBottom: '1px solid #F9FAFB' },
    td: { padding: '15px 20px', fontSize: '14px', color: '#374151', verticalAlign: 'middle' },
    
    courseCell: { display: 'flex', alignItems: 'center', gap: '12px' },
    iconBox: { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' },
    titleText: { fontWeight: '500', color: '#111827' },

    actions: { display: 'flex', justifyContent: 'flex-end', gap: '10px' },
    editBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: '5px' },
    deleteBtn: { backgroundColor: '#EF4444', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#fff', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
};

export default AdminCourses;