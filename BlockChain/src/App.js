import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import About from"./Pages/About";
import Contact from"./Pages/Contact";
import StudentForm from "./StudentForm";
import Navbar from "./Navbar";
import Footer from "./Footer";
import StudentProfile from "./Pages/Student/StudentProfile";
import StudentDashboard from "./Pages/Student/StudentDashboard";
import VerifiedStudents from "./Pages/Teacher/VerifiedStudents";
import AddStudent from "./Pages/Student/AddStudent";
import TeacherLayout from "../src/Pages/Teacher/TeacherLayout";
import ProtectedRoute from "./Pages/Student/ProtectedRoute";
import TeacherDashboard from "./Pages/Teacher/TeacherDashboard";
import StudentLogin from "../src/Pages/Student/StudentLogin";
import TeacherLogin from "../src/Pages/Teacher/TeacherLogin";



const App = () => {
  return (
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

        <Route path="/sf" element={<StudentForm/>}/>
         {/* contact Page */}
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


         <Route path="/teacher/login" element={
          <>
          <Navbar/>
          <TeacherLogin/>
        </>
      } />
      <Route
  path="/teacher/dashboard"
  element={
    <ProtectedRoute>
      <TeacherLayout>
        <TeacherDashboard />
      </TeacherLayout>
    </ProtectedRoute>
  }
/>
      <Route
  path="/teacher/addStudent"
  element={
    <ProtectedRoute>
      <TeacherLayout>
        <AddStudent />
      </TeacherLayout>
    </ProtectedRoute>
  }
/>
<Route
  path="/teacher/verifiedstudents"
  element={
    <ProtectedRoute>
      <TeacherLayout>
        <VerifiedStudents />
      </TeacherLayout>
    </ProtectedRoute>
  }
  ></Route>

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
  );
};

export default App;
