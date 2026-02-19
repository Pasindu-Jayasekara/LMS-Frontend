import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    FaBook, FaCalendarAlt, FaFileAlt, FaRobot, FaSignOutAlt 
} from 'react-icons/fa';
import { MdDashboard, MdPayment, MdAssignment } from 'react-icons/md';
import { BiMessageSquareDetail } from 'react-icons/bi';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    // Helper to check if link is active
    const isActive = (path) => location.pathname === path;

    return (
        <aside style={styles.sidebar}>
            <div style={styles.logoArea}>
                <h2 style={styles.logoText}>GCBT LMS</h2>
            </div>
            
            <nav style={styles.navMenu}>
                {/* Dashboard Link */}
                <div onClick={() => navigate('/student-dashboard')}>
                    <NavItem 
                        icon={<MdDashboard />} 
                        name="Dashboard" 
                        active={isActive('/student-dashboard')} 
                    />
                </div>

                {/* Courses Link */}
                <div onClick={() => navigate('/student-courses')}>
                    <NavItem 
                        icon={<FaBook />} 
                        name="Courses" 
                        active={isActive('/student-courses')} 
                    />
                </div>

                {/* Calendar Link */}
                <div onClick={() => navigate('/student-calendar')}>
                    <NavItem 
                        icon={<FaCalendarAlt />} 
                        name="Calendar" 
                        active={isActive('/student-calendar')} 
                    />
                </div>

                {/* Assignments Link */}
                <div onClick={() => navigate('/student-assignments')}>
                    <NavItem 
                        icon={<MdAssignment />} 
                        name="Assignments" 
                        active={isActive('/student-assignments')} 
                    />
                </div>

                {/* Materials Link */}
                <div onClick={() => navigate('/student-materials')}>
                    <NavItem 
                        icon={<FaFileAlt />} 
                        name="Materials" 
                        active={isActive('/student-materials')} 
                    />
                </div>

                {/* Payment Link */}
                <div onClick={() => navigate('/student-payments')}>
                    <NavItem 
                        icon={<MdPayment />} 
                        name="Payments" 
                        active={isActive('/student-payments')} 
                    />
                </div>

                {/* Messages Link */}
                <div onClick={() => navigate('/student-messages')}>
                    <NavItem icon={<BiMessageSquareDetail />} name="Messages" active={isActive('/student-messages')} />
                </div>

                {/* AI Link */}
                <div onClick={() => navigate('/student-ai')}>
                    <NavItem icon={<FaRobot />} name="AI Assistant" active={isActive('/student-ai')} />
                </div>
            </nav>

            <div style={styles.sidebarFooter}>
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

export default Sidebar;