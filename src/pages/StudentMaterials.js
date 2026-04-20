import React, { useState } from 'react';
//import { FaSearch, FaFilePdf, FaFileWord, FaVideo, FaDownload, FaFilter } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';

const StudentMaterials = () => {
    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('All Subjects');
    const [selectedType, setSelectedType] = useState('All Types');

    // Dummy Data matching your screenshot
    const materials = [
        { id: 1, title: 'Calculus Fundamentals', subject: 'Mathematics', type: 'PDF', size: '3.2 MB', date: 'Sep 10, 2023' },
        { id: 2, title: 'Integration Techniques', subject: 'Mathematics', type: 'PDF', size: '2.5 MB', date: 'Sep 12, 2023' },
        { id: 3, title: 'Physics Mechanics Notes', subject: 'Physics', type: 'PDF', size: '4.1 MB', date: 'Sep 8, 2023' },
        { id: 4, title: 'Chemistry Lab Instructions', subject: 'Chemistry', type: 'DOCX', size: '1.8 MB', date: 'Sep 5, 2023' },
        { id: 5, title: 'Organic Chemistry Lecture', subject: 'Chemistry', type: 'VIDEO', size: '250 MB', date: 'Sep 7, 2023' },
        { id: 6, title: 'Wave Motion Simulation', subject: 'Physics', type: 'VIDEO', size: '180 MB', date: 'Sep 9, 2023' },
    ];

    // Filter Logic
    const filteredMaterials = materials.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = selectedSubject === 'All Subjects' || item.subject === selectedSubject;
        const matchesType = selectedType === 'All Types' || item.type === selectedType;
        return matchesSearch && matchesSubject && matchesType;
    });

    return (
        <div style={styles.container}>
            <Sidebar />
            
            <main style={styles.main}>
                
                <div style={styles.content}>
                    <h1 style={styles.pageTitle}>Learning Materials</h1>

                    {/* Filter Section */}
                    <div style={styles.filterCard}>
                        <div style={styles.filterGroup}>
                            <label style={styles.label}>Search</label>
                            <div style={styles.searchBox}>
                                <input 
                                    type="text" 
                                    placeholder="Search materials..." 
                                    style={styles.searchInput}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        <div style={styles.filterGroup}>
                            <label style={styles.label}>Subject</label>
                            <select 
                                style={styles.selectInput}
                                onChange={(e) => setSelectedSubject(e.target.value)}
                            >
                                <option>All Subjects</option>
                                <option>Mathematics</option>
                                <option>Physics</option>
                                <option>Chemistry</option>
                            </select>
                        </div>

                        <div style={styles.filterGroup}>
                            <label style={styles.label}>Type</label>
                            <select 
                                style={styles.selectInput}
                                onChange={(e) => setSelectedType(e.target.value)}
                            >
                                <option>All Types</option>
                                <option>PDF</option>
                                <option>DOCX</option>
                                <option>VIDEO</option>
                            </select>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div style={styles.tableCard}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.headerRow}>
                                    <th style={styles.th}>Title</th>
                                    <th style={styles.th}>Subject</th>
                                    <th style={styles.th}>Type</th>
                                    <th style={styles.th}>Size</th>
                                    <th style={styles.th}>Date Added</th>
                                    <th style={{...styles.th, textAlign: 'right'}}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMaterials.map(item => (
                                    <tr key={item.id} style={styles.row}>
                                        <td style={styles.tdTitle}>{item.title}</td>
                                        <td style={styles.td}>{item.subject}</td>
                                        <td style={styles.td}>
                                            <span style={getTypeStyle(item.type)}>{item.type}</span>
                                        </td>
                                        <td style={styles.td}>{item.size}</td>
                                        <td style={styles.td}>{item.date}</td>
                                        <td style={{...styles.td, textAlign: 'right'}}>
                                            <button style={styles.downloadBtn}>Download</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredMaterials.length === 0 && (
                            <div style={styles.emptyState}>No materials found.</div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
};

// Helper for Badge Colors (Blue PDF, Green DOCX, Purple VIDEO)
const getTypeStyle = (type) => {
    const base = { padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', display: 'inline-block' };
    if (type === 'PDF') return { ...base, backgroundColor: '#DBEAFE', color: '#1E40AF' }; // Blue
    if (type === 'DOCX') return { ...base, backgroundColor: '#D1FAE5', color: '#065F46' }; // Green
    if (type === 'VIDEO') return { ...base, backgroundColor: '#F3E8FF', color: '#7E22CE' }; // Purple
    return base;
};

const styles = {
    container: { display: 'flex', height: '100vh', backgroundColor: '#F9FAFB', fontFamily: "'Inter', sans-serif" },
    main: { marginLeft: '250px', flex: 1, display: 'flex', flexDirection: 'column' },
    content: { padding: '30px', overflowY: 'auto' },
    pageTitle: { fontSize: '24px', fontWeight: 'bold', marginBottom: '25px', color: '#111827' },

    // Filter Bar
    filterCard: { backgroundColor: '#fff', borderRadius: '12px', padding: '20px', marginBottom: '25px', display: 'flex', gap: '30px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
    filterGroup: { flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '13px', color: '#374151', fontWeight: '500' },
    searchBox: { borderBottom: '1px solid #E5E7EB', paddingBottom: '5px' },
    searchInput: { border: 'none', outline: 'none', width: '100%', fontSize: '14px', color: '#111827' },
    selectInput: { border: 'none', borderBottom: '1px solid #E5E7EB', width: '100%', padding: '5px 0', fontSize: '14px', color: '#111827', outline: 'none', backgroundColor: 'transparent' },

    // Table
    tableCard: { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden', padding: '20px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    headerRow: { borderBottom: '1px solid #F3F4F6' },
    th: { textAlign: 'left', padding: '15px 10px', fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', fontWeight: '600' },
    row: { borderBottom: '1px solid #F9FAFB' },
    td: { padding: '15px 10px', fontSize: '14px', color: '#374151' },
    tdTitle: { padding: '15px 10px', fontSize: '14px', fontWeight: '500', color: '#111827' },
    
    downloadBtn: { background: 'none', border: 'none', color: '#2563EB', fontWeight: '600', cursor: 'pointer', fontSize: '14px' },
    emptyState: { padding: '40px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }
};

export default StudentMaterials;