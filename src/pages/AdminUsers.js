import React, { useState } from 'react';
import { 
    FaSearch, FaPlus, FaUser, FaEdit, FaTrash, 
    FaCheckCircle, FaTimesCircle 
} from 'react-icons/fa';
import AdminSidebar from '../components/AdminSidebar';
import Header from '../components/Header';

const AdminUsers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All Roles');
    const [statusFilter, setStatusFilter] = useState('All Status');

    // Dummy User Data matching your screenshot
    const users = [
        { id: 1, name: 'Dr. Sachini Perera', email: 'sachini.perera@gcbt.edu', role: 'Teacher', status: 'Active', date: 'Sep 15, 2022' },
        { id: 2, name: 'Nimesh Fernando', email: 'nimesh.fernanado@gcbt.edu', role: 'Student', status: 'Active', date: 'Oct 3, 2022' },
        { id: 3, name: 'Kasun Silva', email: 'kasun.silva@gcbt.edu', role: 'Admin', status: 'Active', date: 'Jul 10, 2021' },
        { id: 4, name: 'Tharushi Jayawardena', email: 'tharushi.jayawardena@gcbt.edu', role: 'Student', status: 'Active', date: 'Feb 22, 2023' },
        { id: 5, name: 'Dilan Perera', email: 'dilan.perera@gcbt.edu', role: 'Student', status: 'Inactive', date: 'Nov 8, 2022' },
        { id: 6, name: 'Prof. Ruwan Wijesinghe', email: 'ruwan.wijesinghe@gcbt.edu', role: 'Teacher', status: 'Active', date: 'Apr 17, 2022' },
    ];

    // Filter Logic
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'All Status' || user.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
    });

    return (
        <div style={styles.container}>
            <AdminSidebar />
            <main style={styles.main}>
                <Header title="User Management" />
                
                <div style={styles.content}>
                    
                    {/* Top Toolbar */}
                    <div style={styles.toolbar}>
                        <button style={styles.addBtn}>
                            <FaPlus style={{marginRight: 8}}/> Add User
                        </button>

                        <div style={styles.filters}>
                            <div style={styles.searchBox}>
                                <FaSearch color="#9CA3AF" />
                                <input 
                                    placeholder="Search users..." 
                                    style={styles.searchInput}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            <select 
                                style={styles.select}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option>All Roles</option>
                                <option>Student</option>
                                <option>Teacher</option>
                                <option>Admin</option>
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

                    {/* Users Table */}
                    <div style={styles.tableCard}>
                        <table style={styles.table}>
                            <thead>
                                <tr style={styles.headerRow}>
                                    <th style={styles.th}>Name</th>
                                    <th style={styles.th}>Email</th>
                                    <th style={styles.th}>Role</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Created</th>
                                    <th style={{...styles.th, textAlign: 'right'}}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.id} style={styles.row}>
                                        <td style={styles.td}>
                                            <div style={styles.userCell}>
                                                <div style={styles.avatar}><FaUser size={12}/></div>
                                                <span style={styles.nameText}>{user.name}</span>
                                            </div>
                                        </td>
                                        <td style={{...styles.td, color: '#6B7280'}}>{user.email}</td>
                                        <td style={styles.td}>
                                            <span style={getRoleStyle(user.role)}>{user.role}</span>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={getStatusStyle(user.status)}>
                                                {user.status === 'Active' ? <FaCheckCircle size={10}/> : <FaTimesCircle size={10}/>}
                                                {user.status}
                                            </div>
                                        </td>
                                        <td style={{...styles.td, color: '#6B7280'}}>{user.date}</td>
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

// Helper for Role Badges
const getRoleStyle = (role) => {
    const base = { padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '500' };
    if (role === 'Teacher') return { ...base, backgroundColor: '#DBEAFE', color: '#1E40AF' }; // Blue
    if (role === 'Student') return { ...base, backgroundColor: '#DCFCE7', color: '#166534' }; // Green
    if (role === 'Admin') return { ...base, backgroundColor: '#F3E8FF', color: '#7E22CE' }; // Purple
    return base;
};

// Helper for Status Badges
const getStatusStyle = (status) => {
    const base = { display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', width: 'fit-content' };
    if (status === 'Active') return { ...base, backgroundColor: '#DCFCE7', color: '#059669' }; // Green
    return { ...base, backgroundColor: '#FEE2E2', color: '#DC2626' }; // Red
};

const styles = {
    container: { display: 'flex', height: '100vh', background: '#F9FAFB', fontFamily: 'sans-serif' },
    main: { marginLeft: '250px', flex: 1, display: 'flex', flexDirection: 'column' },
    content: { padding: '30px', overflowY: 'auto' },

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
    
    userCell: { display: 'flex', alignItems: 'center', gap: '12px' },
    avatar: { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4B5563' },
    nameText: { fontWeight: '500', color: '#111827' },

    actions: { display: 'flex', justifyContent: 'flex-end', gap: '10px' },
    editBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: '5px' },
    deleteBtn: { backgroundColor: '#EF4444', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#fff', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
};

export default AdminUsers;