import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import StudentCourses from './pages/StudentCourses';
import StudentCalendar from './pages/StudentCalendar';
import StudentAssignments from './pages/StudentAssignments';
import StudentMaterials from './pages/StudentMaterials';
import StudentPayments from './pages/StudentPayments';
import StudentMessages from './pages/StudentMessages';
import StudentMessaging from './pages/StudentMessaging';
import AIAssistant from './pages/AIAssistant';
import StudentClassroom from './pages/StudentClassroom';
import StudentProfile from './pages/StudentProfile';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherCourses from './pages/TeacherCourses';
import TeacherClassroom from './pages/TeacherClassroom';
import TeacherSchedule from './pages/TeacherSchedule';
import TeacherAssignments from './pages/TeacherAssignments';
import TeacherAnnouncements from './pages/TeacherAnnouncements';
import TeacherMessaging from './pages/TeacherMessaging';
import TeacherProfile from './pages/TeacherProfile';
import TeacherEnrollmentRequests from './pages/TeacherEnrollmentRequests';
import TeacherMaterials from './pages/TeacherMaterials';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminCourses from './pages/AdminCourses';
import AdminPayments from './pages/AdminPayments';
// import AdminAttendance from './pages/AdminAttendance'; // [DISABLED] QR Attendance removed for final presentation
import AdminAnnouncements from './pages/AdminAnnouncements';
import AdminProfile from './pages/AdminProfile';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <Routes>
      {/* ── PUBLIC ROUTES ─────────────────────────────────────── */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* ── STUDENT ROUTES (role: 'Student') ─────────────────── */}
      <Route path="/student-dashboard" element={<ProtectedRoute allowedRoles={['Student']}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student-courses" element={<ProtectedRoute allowedRoles={['Student']}><StudentCourses /></ProtectedRoute>} />
      <Route path="/student-calendar" element={<ProtectedRoute allowedRoles={['Student']}><StudentCalendar /></ProtectedRoute>} />
      <Route path="/student-assignments" element={<ProtectedRoute allowedRoles={['Student']}><StudentAssignments /></ProtectedRoute>} />
      <Route path="/student-materials" element={<ProtectedRoute allowedRoles={['Student']}><StudentMaterials /></ProtectedRoute>} />
      <Route path="/student-payments" element={<ProtectedRoute allowedRoles={['Student']}><StudentPayments /></ProtectedRoute>} />
      <Route path="/student/messages" element={<ProtectedRoute allowedRoles={['Student']}><StudentMessaging /></ProtectedRoute>} />
      <Route path="/student-profile" element={<ProtectedRoute allowedRoles={['Student']}><StudentProfile /></ProtectedRoute>} />
      <Route path="/student/ai-assistant" element={<ProtectedRoute allowedRoles={['Student']}><AIAssistant /></ProtectedRoute>} />
      <Route path="/student/classroom/:courseId" element={<ProtectedRoute allowedRoles={['Student']}><StudentClassroom /></ProtectedRoute>} />
      {/* ── TEACHER ROUTES (role: 'Teacher') ─────────────────── */}
      <Route path="/teacher-dashboard" element={<ProtectedRoute allowedRoles={['Teacher']}><TeacherDashboard /></ProtectedRoute>} />
      <Route path="/teacher-courses" element={<ProtectedRoute allowedRoles={['Teacher']}><TeacherCourses /></ProtectedRoute>} />
      <Route path="/teacher-materials" element={<ProtectedRoute allowedRoles={['Teacher']}><TeacherMaterials /></ProtectedRoute>} />
      <Route path="/teacher/classroom/:courseId/:grade" element={<ProtectedRoute allowedRoles={['Teacher']}><TeacherClassroom /></ProtectedRoute>} />
      <Route path="/teacher-schedule" element={<ProtectedRoute allowedRoles={['Teacher']}><TeacherSchedule /></ProtectedRoute>} />
      <Route path="/teacher-assignments" element={<ProtectedRoute allowedRoles={['Teacher']}><TeacherAssignments /></ProtectedRoute>} />
      <Route path="/teacher-announcements" element={<ProtectedRoute allowedRoles={['Teacher']}><TeacherAnnouncements /></ProtectedRoute>} />
      <Route path="/teacher-messages" element={<ProtectedRoute allowedRoles={['Teacher']}><TeacherMessaging /></ProtectedRoute>} />
      <Route path="/teacher-profile" element={<ProtectedRoute allowedRoles={['Teacher']}><TeacherProfile /></ProtectedRoute>} />
      <Route path="/teacher/enrollment-requests" element={<ProtectedRoute allowedRoles={['Teacher']}><TeacherEnrollmentRequests /></ProtectedRoute>} />

      {/* ── ADMIN ROUTES (role: 'Admin') ──────────────────────── */}
      <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['Admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin-users" element={<ProtectedRoute allowedRoles={['Admin']}><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin-courses" element={<ProtectedRoute allowedRoles={['Admin']}><AdminCourses /></ProtectedRoute>} />
      <Route path="/admin-payments" element={<ProtectedRoute allowedRoles={['Admin']}><AdminPayments /></ProtectedRoute>} />
      {/* [DISABLED] QR Attendance removed for final presentation
      <Route path="/admin-attendance" element={<AdminAttendance />} />
      */}
      <Route path="/admin-announcements" element={<ProtectedRoute allowedRoles={['Admin']}><AdminAnnouncements /></ProtectedRoute>} />
      <Route path="/admin-profile" element={<ProtectedRoute allowedRoles={['Admin']}><AdminProfile /></ProtectedRoute>} />
    </Routes>
  );
}
export default App;