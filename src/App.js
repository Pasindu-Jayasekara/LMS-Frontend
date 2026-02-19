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
import StudentAIAssistant from './pages/StudentAIAssistant';
import TeacherDashboard from './pages/TeacherDashboard';
import TeacherCourses from './pages/TeacherCourses';
import TeacherSchedule from './pages/TeacherSchedule';
import TeacherAssignments from './pages/TeacherAssignments';
import TeacherAnnouncements from './pages/TeacherAnnouncements';
import TeacherMessages from './pages/TeacherMessages';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminCourses from './pages/AdminCourses';
import AdminAttendance from './pages/AdminAttendance';
import AdminAnnouncements from './pages/AdminAnnouncements';
import AdminAnalytics from './pages/AdminAnalytics';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/student-courses" element={<StudentCourses />} />
      <Route path="/student-calendar" element={<StudentCalendar />} />
      <Route path="/student-assignments" element={<StudentAssignments />} />
      <Route path="/student-materials" element={<StudentMaterials />} />
      <Route path="/student-payments" element={<StudentPayments />} />
      <Route path="/student-messages" element={<StudentMessages />} />
      <Route path="/student-ai" element={<StudentAIAssistant />} />
      <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
      <Route path="/teacher-courses" element={<TeacherCourses />} />
      <Route path="/teacher-schedule" element={<TeacherSchedule />} />
      <Route path="/teacher-assignments" element={<TeacherAssignments />} />
      <Route path="/teacher-announcements" element={<TeacherAnnouncements />} />
      <Route path="/teacher-messages" element={<TeacherMessages />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/admin-users" element={<AdminUsers />} />
      <Route path="/admin-courses" element={<AdminCourses />} />
      <Route path="/admin-attendance" element={<AdminAttendance />} />
      <Route path="/admin-announcements" element={<AdminAnnouncements />} />
      <Route path="/admin-analytics" element={<AdminAnalytics />} />
    </Routes>
  );
}
export default App;