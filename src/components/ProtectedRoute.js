import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute — wraps any route that requires authentication and a specific role.
 *
 * Props:
 *   allowedRoles  {string[]}  e.g. ['Admin'], ['Teacher'], ['Student']
 *   children      {JSX}       The page component to render if access is granted.
 *
 * Logic:
 *   1. If no userId in sessionStorage → user is not logged in → redirect to /login.
 *   2. If userId exists but role is not in allowedRoles → redirect to /unauthorized.
 *   3. If userId AND role match → render the requested page normally.
 */
const ProtectedRoute = ({ allowedRoles, children }) => {
    // Use userId as the "session token" — set by Login.js after a successful login
    const userId = sessionStorage.getItem('userId');
    const role   = sessionStorage.getItem('role');

    // 1. Not logged in at all
    if (!userId) {
        return <Navigate to="/login" replace />;
    }

    // 2. Logged in, but wrong role for this page
    if (!allowedRoles.includes(role)) {
        // Since Unauthorized.js is removed, route them to their respective dashboards instead
        if (role === 'Admin') return <Navigate to="/admin-dashboard" replace />;
        if (role === 'Teacher') return <Navigate to="/teacher-dashboard" replace />;
        if (role === 'Student') return <Navigate to="/student-dashboard" replace />;
        return <Navigate to="/login" replace />;
    }

    // 3. Correct role — render the protected page
    return children;
};

export default ProtectedRoute;
