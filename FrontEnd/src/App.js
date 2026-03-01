import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import About from"./Pages/About";
import Contact from"./Pages/Contact";
import Navbar from "./Navbar";
import Footer from "./Footer";
import StudentProfile from "./Pages/Student/StudentProfile";
import StudentDashboard from "./Pages/Student/StudentDashboard";
import VerifiedStudents from "./Pages/Teacher/VerifiedStudents";
import AddStudent from "./Pages/Student/AddStudent";
import TeacherLayout from "./Pages/Teacher/TeacherLayout";
import AdminLayout from "./Pages/Admin/AdminLayout";
import ProtectedRoute from "./Pages/Student/ProtectedRoute";
import TeacherDashboard from "./Pages/Teacher/TeacherDashboard";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AddTeacher from "./Pages/Admin/AddTeacher";
import ManageTeachers from "./Pages/Admin/ManageTeachers";
import AdminSettings from "./Pages/Admin/AdminSettings";
import StudentLogin from "./Pages/Student/StudentLogin";
import TeacherLogin from "./Pages/Teacher/TeacherLogin";
import StudentStatus from "./Pages/Student/StudentStatus";
import StudentSearch from "./Pages/Student/StudentSearch";
import PendingStudents from "./Pages/Teacher/PendingStudents";
import TeacherRequests from "./Pages/Teacher/TeacherRequests";
import ContactList from "./Pages/ContactList";
import StudentRequest from "./Pages/Student/StudentRequest";
import { DialogProvider } from "./components/CustomDialog";



const App = () => {
  return (
    <DialogProvider>
      <Router>
        <Routes>
          {/* Home Page */}
          <Route path="/" element={
            <>
              <Navbar/>
              <Home />
              <Footer/>
            </>
          } />
          
          {/* Contact Page */}
          <Route path="/contact" element={
            <>
              <Navbar/>
              <Contact/>
              <Footer/>
            </>
          } />
          
          <Route path="/student/login" element={
            <>
              <Navbar/>
              <StudentLogin/>
            </>
          } />
            
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/status" element={<StudentStatus />} />
          <Route path="/student/search" element={<StudentSearch />} />
          <Route path="/student/request" element={<StudentRequest />} />

          <Route path="/teacher/login" element={
            <>
              <Navbar/>
              <TeacherLogin/>
            </>
          } />
          
          <Route path="/teacher/dashboard" element={
            <ProtectedRoute>
              <TeacherLayout>
                <TeacherDashboard />
              </TeacherLayout>
            </ProtectedRoute>
          } />
          
          {/* Admin Routes - Using AdminLayout (no Navbar, with sidebar) */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/addteacher" element={
            <ProtectedRoute>
              <AdminLayout>
                <AddTeacher />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/teachers" element={
            <ProtectedRoute>
              <AdminLayout>
                <ManageTeachers />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/settings" element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminSettings />
              </AdminLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/contacts" element={
            <ProtectedRoute>
              <AdminLayout>
                <ContactList />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/teacher/addStudent" element={
            <ProtectedRoute>
              <TeacherLayout>
                <AddStudent />
              </TeacherLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/teacher/verifiedstudents" element={
            <ProtectedRoute>
              <TeacherLayout>
                <VerifiedStudents />
              </TeacherLayout>
            </ProtectedRoute>
          } />

          <Route path="/teacher/requests" element={
            <ProtectedRoute>
              <TeacherLayout>
                <TeacherRequests />
              </TeacherLayout>
            </ProtectedRoute>
          } />

          <Route path="/teacher/contacts" element={
            <ProtectedRoute>
              <TeacherLayout>
                <ContactList />
              </TeacherLayout>
            </ProtectedRoute>
          } />

          <Route path="/teacher/pending" element={
            <ProtectedRoute>
              <TeacherLayout>
                <PendingStudents />
              </TeacherLayout>
            </ProtectedRoute>
          } />

          {/* About Page */}
          <Route path="/about" element={
            <>
              <Navbar/>
              <About/>
              <Footer/>
            </>
          } />
        </Routes>
      </Router>
    </DialogProvider>
  );
};

export default App;
