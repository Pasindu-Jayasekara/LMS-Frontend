# GCBT LMS - Frontend Client

This is the React.js frontend application for the GCBT Learning Management System. It provides dedicated, secure portals for Students, Teachers, and Administrators, featuring responsive design, protected routing, and real-time interactive components.

## 🚀 Tech Stack
* **Framework:** React.js
* **Routing:** React Router DOM (v6)
* **HTTP Client:** Axios
* **Styling:** Custom CSS (Flexbox/Grid patterns, modern card-based UI)
* **Icons:** React Icons (`react-icons`)

## ✨ Key Features by Role

### 🎓 Student Portal
* **Dashboard:** Personalized view of today's classes, upcoming assignments, and direct links to live online classes.
* **Course Enrollment:** Browse available subjects and send enrollment requests to instructors.
* **AI Tutor:** Integrated Gemini AI assistant for real-time study help and concept explanations.
* **Assignments & Materials:** Download teacher-uploaded notes and submit completed assignments via secure file upload.
* **Messaging:** Two-way messaging interface to communicate directly with assigned teachers.
* **Payments:** Streamlined monthly fee tracking with a manual bank receipt upload system.

### 👨‍🏫 Teacher Portal
* **Class Management:** View daily schedules, launch online classes, and manage student enrollment requests.
* **Materials & Assignments:** Upload course materials (.pdf, .docx) and track student assignment submissions.
* **Messaging:** Dedicated inbox to respond to student questions securely within the platform.

### 🛡️ Administrator Portal
* **User Management:** Full control over registering, updating, and deleting Student and Teacher accounts.
* **Course Creation:** Build courses and assign specific registered teachers to them.
* **Financial Oversight:** Review and approve/reject pending student payment receipts.

## 📋 Prerequisites
Before running this project, ensure you have the following installed:
* Node.js (v16 or higher)
* The **GCBT LMS Backend** running locally on port 5000.

## 🛠️ Installation & Setup

**1. Clone the repository and navigate to the frontend folder:**
```bash
git clone <your-repository-url>
cd lms-frontend

2. Install dependencies:
npm install

3. Environment Variables:
Create a .env file in the root of your frontend directory to link it to your backend API.

REACT_APP_API_BASE_URL=http://localhost:5000/api

4. Start the Application:
npm start

The application will launch in your default browser at http://localhost:3000.

📁 Folder Structure & Architecture

/lms-frontend
│
├── /public             # Static assets (index.html, favicon, logos)
├── /src
│   ├── /components     # Reusable UI elements (ProtectedRoute, Sidebars, Modals)
│   ├── /pages          # Role-specific page views 
│   │   ├── /admin      # AdminDashboard, ManageCourses, AdminPayments...
│   │   ├── /teacher    # TeacherDashboard, TeacherClassroom...
│   │   └── /student    # StudentDashboard, AIAssistant, StudentMessaging...
│   ├── App.js          # Main router configuration and role-based route wrapping
│   ├── index.js        # React DOM rendering entry point
│   └── index.css       # Global styles and CSS variables
├── .env                # API configuration
└── package.json        # Dependencies and scripts


🔒 Security Implementation
This application implements Role-Based Protected Routing. Users attempting to manually navigate to unauthorized URLs (e.g., a student typing /admin-dashboard) will be intercepted by the ProtectedRoute.js wrapper, which verifies their JWT token and role state before redirecting them safely.
