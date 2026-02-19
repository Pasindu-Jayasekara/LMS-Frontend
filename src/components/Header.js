import React, { useState, useEffect } from 'react';
import { FaSearch, FaBell, FaRobot } from 'react-icons/fa';

const Header = ({ title }) => {
    const [student, setStudent] = useState({ name: 'Student', id: '' });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setStudent(JSON.parse(userData));
        }
    }, []);

    return (
        <header style={styles.topbar}>
            {/* Search Bar */}
            <div style={styles.searchBar}>
                <FaSearch color="#aaa" />
                <input type="text" placeholder="Search..." style={styles.searchInput} />
            </div>

            {/* User Section */}
            <div style={styles.userSection}>
                <div style={styles.iconBtn}><FaRobot /></div>
                <div style={styles.iconBtn}>
                    <FaBell />
                    <span style={styles.badge}>3</span>
                </div>
                <div style={styles.profileBadge}>
                    <div style={styles.avatar}>PS</div>
                    <span>{student.name}</span>
                </div>
            </div>
        </header>
    );
};

const styles = {
    topbar: { height: '64px', backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 30px', position: 'sticky', top: 0, zIndex: 10, width: '100%' },
    searchBar: { display: 'flex', alignItems: 'center', backgroundColor: '#f9fafb', borderRadius: '8px', padding: '8px 15px', width: '400px', border: '1px solid #e5e7eb' },
    searchInput: { border: 'none', background: 'transparent', outline: 'none', marginLeft: '10px', width: '100%', fontSize: 13 },
    userSection: { display: 'flex', alignItems: 'center', gap: '15px' },
    iconBtn: { padding: 8, borderRadius: '50%', backgroundColor: '#f3f4f6', cursor: 'pointer', position: 'relative', color: '#4b5563' },
    badge: { position: 'absolute', top: -2, right: -2, background: '#ef4444', color: '#fff', fontSize: 10, width: 14, height: 14, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    profileBadge: { display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' },
    avatar: { width: 32, height: 32, borderRadius: '50%', backgroundColor: '#dbeafe', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 'bold' },
};

export default Header;