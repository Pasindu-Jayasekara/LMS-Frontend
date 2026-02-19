import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    FaHome, FaUsers, FaBook, FaCalendarCheck, 
    FaBullhorn, FaChartBar, FaSignOutAlt, FaUser 
} from 'react-icons/fa';

const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <aside style={styles.sidebar}>
            <div style={styles.logoArea}>
                <h2 style={styles.logoText}>GCBT LMS</h2>
            </div>
            
            <nav style={styles.navMenu}>
                <div onClick={() => navigate('/admin-dashboard')}>
                    <NavItem icon={<FaHome />} name="Dashboard" active={isActive('/admin-dashboard')} />
                </div>
                <div onClick={() => navigate('/admin-users')}>
                    <NavItem icon={<FaUsers />} name="User Management" active={isActive('/admin-users')} />
                </div>
                <div onClick={() => navigate('/admin-courses')}>
                    <NavItem icon={<FaBook />} name="Course Management" active={isActive('/admin-courses')} />
                </div>
                <div onClick={() => navigate('/admin-attendance')}>
                    <NavItem icon={<FaCalendarCheck />} name="Attendance" active={isActive('/admin-attendance')} />
                </div>
                <div onClick={() => navigate('/admin-announcements')}>
                    <NavItem icon={<FaBullhorn />} name="Announcements" active={isActive('/admin-announcements')} />
                </div>
                
                <div onClick={() => navigate('/admin-analytics')}>
                    <NavItem icon={<FaChartBar />} name="Analytics" active={isActive('/admin-analytics')} />
                </div>
            </nav>

            <div style={styles.sidebarFooter}>
                <div style={styles.navItem} onClick={() => navigate('/admin-profile')}>
                    <FaUser /> <span style={{marginLeft: '10px'}}>Profile</span>
                </div>
                <div style={styles.navItem} onClick={handleLogout}>
                    <FaSignOutAlt /> <span style={{marginLeft: '10px'}}>Sign out</span>
                </div>
            </div>
        </aside>
    );
};

const NavItem = ({ icon, name, active }) => (
    <div style={active ? styles.navItemActive : styles.navItem}>
        {icon}
        <span style={{marginLeft: '12px'}}>{name}</span>
    </div>
);

const styles = {
    sidebar: { width: '250px', backgroundColor: '#fff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100%', top: 0, left: 0, zIndex: 100 },
    logoArea: { padding: '20px', borderBottom: '1px solid #f0f0f0' },
    logoText: { color: '#2563eb', fontWeight: '800', margin: 0 },
    navMenu: { padding: '20px 10px', flex: 1 },
    navItem: { display: 'flex', alignItems: 'center', padding: '12px 15px', color: '#4b5563', borderRadius: '8px', cursor: 'pointer', marginBottom: 5, fontSize: 14, transition: '0.2s' },
    navItemActive: { display: 'flex', alignItems: 'center', padding: '12px 15px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '8px', cursor: 'pointer', marginBottom: 5, fontSize: 14, fontWeight: '600' },
    sidebarFooter: { padding: '20px', borderTop: '1px solid #f0f0f0' },
};

export default AdminSidebar;