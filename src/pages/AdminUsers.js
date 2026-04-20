import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    FaSearch, FaUsers, FaUserEdit, FaTrashAlt, 
    FaUserGraduate, FaChalkboardTeacher, FaTimes 
} from 'react-icons/fa';
import AdminSidebar from '../components/AdminSidebar';

// Injecting purely cosmetic hover/animation CSS overrides 
const injectedStyles = `
    .action-btn { transition: all 0.2s ease; transform: scale(1); }
    .action-btn:hover { transform: scale(1.1); filter: brightness(1.2); }
    .table-row { transition: background-color 0.2s ease; }
    .table-row:hover { background-color: #F9FAFB; }
    .modal-overlay { animation: fadeIn 0.2s ease-out; }
    .modal-content { animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
`;

const AdminUsers = () => {
    // State variables
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    
    // Modal state for editing
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editFormData, setEditFormData] = useState({ firstName: '', lastName: '', email: '' });

    // 1. Fetch Users
    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching admin users:", error);
        }
    };

    useEffect(() => {
        // Inject CSS safely
        const styleTag = document.createElement('style');
        styleTag.innerText = injectedStyles;
        document.head.appendChild(styleTag);

        fetchUsers();

        return () => { document.head.removeChild(styleTag); };
    }, []);

    // 2. Delete Handler
    const handleDelete = async (user) => {
        const confirmDelete = window.confirm(`Are you sure you want to permanently delete ${user.name} (${user.id})?`);
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5000/api/admin/users/${user.role}/${user.id}`);
            // Success, remove from UI instantly instead of refetching for speed (or just refetch)
            setUsers(users.filter(u => u.id !== user.id));
        } catch (error) {
            alert(error.response?.data?.message || "Failed to delete user.");
        }
    };

    // 3. Edit Flow Handlers
    const handleOpenEdit = (user) => {
        // Split name visually in the form. (Note: simple split logic)
        const nameParts = user.name.split(' ');
        const fName = nameParts[0];
        const lName = nameParts.slice(1).join(' ');

        setEditingUser(user);
        setEditFormData({ firstName: fName, lastName: lName, email: user.email });
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async () => {
        if (!editFormData.firstName || !editFormData.lastName || !editFormData.email) {
            alert("All fields are required.");
            return;
        }

        try {
            await axios.put(`http://localhost:5000/api/admin/users/${editingUser.role}/${editingUser.id}`, editFormData);
            
            // Success, update local state or refetch
            fetchUsers();
            setIsEditModalOpen(false);
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update user.");
        }
    };

    const handleEditChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    // 4. Filtering Logic
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'All' ? true : user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <div style={styles.container}>
            <AdminSidebar />
            
            <main style={styles.main}>
                <div style={styles.content}>
                    
                    {/* Header */}
                    <div style={styles.headerBox}>
                        <div>
                            <h2 style={styles.title}>User Management</h2>
                            <p style={styles.subtitle}>View, edit, and safely remote student and teacher records natively.</p>
                        </div>
                        <div style={styles.iconContainer}>
                            <FaUsers size={32} color="#2563EB" />
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div style={styles.filterBar}>
                        <div style={styles.searchBox}>
                            <FaSearch color="#9CA3AF" />
                            <input 
                                type="text"
                                style={styles.searchInput}
                                placeholder="Search by ID, Name or Email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        
                        <div style={styles.roleFilterGroup}>
                            <label style={styles.filterLabel}>Role Filter:</label>
                            <select 
                                style={styles.filterSelect}
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                <option value="All">All Roles</option>
                                <option value="Student">Students Only</option>
                                <option value="Teacher">Teachers Only</option>
                            </select>
                        </div>
                    </div>

                    {/* Unified Data Table */}
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>USER ID</th>
                                    <th style={styles.th}>FULL NAME</th>
                                    <th style={styles.th}>EMAIL ADDRESS</th>
                                    <th style={styles.th}>ROLE</th>
                                    <th style={{...styles.th, textAlign: 'right'}}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={styles.noDataRow}>No users found dynamically matching your criteria.</td>
                                    </tr>
                                ) : (
                                    filteredUsers.map(user => (
                                        <tr key={`${user.role}-${user.id}`} className="table-row" style={styles.tr}>
                                            <td style={styles.td}>
                                                <span style={styles.idBadge}>{user.id}</span>
                                            </td>
                                            <td style={styles.tdActiveName}>{user.name}</td>
                                            <td style={styles.tdSubtle}>{user.email}</td>
                                            <td style={styles.td}>
                                                <span style={user.role === 'Student' ? styles.roleBadgeStudent : styles.roleBadgeTeacher}>
                                                    {user.role === 'Student' ? <FaUserGraduate style={{marginRight: 4}}/> : <FaChalkboardTeacher style={{marginRight: 4}}/>}
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td style={styles.tdActions}>
                                                <button 
                                                    className="action-btn"
                                                    style={styles.editBtn} 
                                                    onClick={() => handleOpenEdit(user)}
                                                    title="Edit Details"
                                                >
                                                    <FaUserEdit />
                                                </button>
                                                <button 
                                                    className="action-btn"
                                                    style={styles.deleteBtn} 
                                                    onClick={() => handleDelete(user)}
                                                    title="Delete Permanently"
                                                >
                                                    <FaTrashAlt />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Edit Modal Overlay */}
            {isEditModalOpen && (
                <div className="modal-overlay" style={styles.modalOverlay}>
                    <div className="modal-content" style={styles.modalContent}>
                        <div style={styles.modalHeader}>
                            <h3 style={styles.modalTitle}>Edit {editingUser?.role}</h3>
                            <button style={styles.closeBtn} onClick={() => setIsEditModalOpen(false)}>
                                <FaTimes />
                            </button>
                        </div>
                        
                        <div style={styles.modalBody}>
                            <div style={styles.readonlyIdBlock}>
                                <span>Editing ID:</span>
                                <strong>{editingUser?.id}</strong>
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>First Name</label>
                                <input name="firstName" value={editFormData.firstName} onChange={handleEditChange} style={styles.input} />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Last Name</label>
                                <input name="lastName" value={editFormData.lastName} onChange={handleEditChange} style={styles.input} />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Email Address</label>
                                <input type="email" name="email" value={editFormData.email} onChange={handleEditChange} style={styles.input} />
                            </div>
                        </div>

                        <div style={styles.modalFooter}>
                            <button style={styles.cancelBtn} onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                            <button style={styles.saveBtn} onClick={handleSaveEdit}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: { display: 'flex', height: '100vh', backgroundColor: '#F3F4F6', fontFamily: "'Inter', sans-serif" },
    main: { marginLeft: '250px', flex: 1, overflowY: 'auto' },
    content: { padding: '40px' },

    headerBox: { backgroundColor: '#fff', borderRadius: '16px', padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', marginBottom: '30px' },
    title: { margin: 0, fontSize: '26px', fontWeight: '800', color: '#111827' },
    subtitle: { margin: '8px 0 0 0', color: '#6B7280', fontSize: '15px' },
    iconContainer: { backgroundColor: '#EFF6FF', padding: '15px', borderRadius: '16px' },

    filterBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '25px' },
    searchBox: { display: 'flex', alignItems: 'center', backgroundColor: '#F9FAFB', padding: '12px 16px', borderRadius: '8px', border: '1px solid #E5E7EB', width: '350px' },
    searchInput: { border: 'none', background: 'transparent', outline: 'none', marginLeft: '10px', fontSize: '14px', width: '100%' },
    
    roleFilterGroup: { display: 'flex', alignItems: 'center', gap: '15px' },
    filterLabel: { fontWeight: '600', color: '#374151', fontSize: '14px' },
    filterSelect: { padding: '10px 15px', borderRadius: '8px', border: '1px solid #D1D5DB', outline: 'none', fontWeight: '500', cursor: 'pointer', backgroundColor: '#fff' },

    tableContainer: { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' },
    table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th: { backgroundColor: '#F9FAFB', padding: '16px 20px', color: '#6B7280', fontSize: '12px', fontWeight: '700', letterSpacing: '0.05em' },
    tr: { borderBottom: '1px solid #F3F4F6' },
    td: { padding: '16px 20px', verticalAlign: 'middle' },
    tdActiveName: { padding: '16px 20px', verticalAlign: 'middle', fontWeight: '700', color: '#111827' },
    tdSubtle: { padding: '16px 20px', verticalAlign: 'middle', color: '#6B7280', fontSize: '14px' },
    tdActions: { padding: '16px 20px', textAlign: 'right', verticalAlign: 'middle' },

    idBadge: { backgroundColor: '#F3F4F6', color: '#374151', padding: '5px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', border: '1px solid #E5E7EB' },
    
    roleBadgeStudent: { display: 'inline-flex', alignItems: 'center', backgroundColor: '#ECFDF5', color: '#059669', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },
    roleBadgeTeacher: { display: 'inline-flex', alignItems: 'center', backgroundColor: '#EFF6FF', color: '#2563EB', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' },

    editBtn: { background: 'none', border: 'none', color: '#3B82F6', fontSize: '18px', cursor: 'pointer', marginRight: '15px' },
    deleteBtn: { background: 'none', border: 'none', color: '#EF4444', fontSize: '18px', cursor: 'pointer' },
    noDataRow: { textAlign: 'center', padding: '40px', color: '#9CA3AF', fontSize: '15px' },

    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(3px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: '#fff', width: '100%', maxWidth: '400px', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', overflow: 'hidden' },
    modalHeader: { padding: '20px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F3F4F6' },
    modalTitle: { margin: 0, fontSize: '18px', fontWeight: '700', color: '#111827' },
    closeBtn: { background: 'none', border: 'none', color: '#9CA3AF', fontSize: '20px', cursor: 'pointer' },
    modalBody: { padding: '25px' },
    readonlyIdBlock: { backgroundColor: '#F9FAFB', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', color: '#4B5563', fontSize: '14px' },
    inputGroup: { marginBottom: '15px' },
    label: { display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '600', color: '#374151' },
    input: { width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '14px', outline: 'none' },
    modalFooter: { padding: '20px', borderTop: '1px solid #F3F4F6', backgroundColor: '#F9FAFB', display: 'flex', justifyContent: 'flex-end', gap: '10px' },
    cancelBtn: { padding: '10px 18px', backgroundColor: '#fff', border: '1px solid #D1D5DB', borderRadius: '8px', fontWeight: '600', color: '#4B5563', cursor: 'pointer' },
    saveBtn: { padding: '10px 18px', backgroundColor: '#2563EB', border: 'none', borderRadius: '8px', fontWeight: '600', color: '#fff', cursor: 'pointer' }
};

export default AdminUsers;