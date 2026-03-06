import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { dialog } from "../../components/CustomDialog";
import { validateEmail, validatePassword } from "../../utils/validation";
import "../Student/StudentLogin.css";
import logo from "../Images/clglogo.png";

export default function TeacherLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  /* ===================== ADMIN LOGIN CHECK ===================== */
  const isAdminLogin = email.toLowerCase() === "admin@gmail.com" && password === "admin1";

  /* ===================== TEACHER/ADMIN LOGIN ===================== */
  const handleTeacherLogin = async (e) => {
    e.preventDefault();

    // Validate email
    const emailResult = validateEmail(email);
    if (!emailResult.isValid) {
      dialog.warning("Validation Error", emailResult.error);
      return;
    }

    // Validate password
    const passwordResult = validatePassword(password);
    if (!passwordResult.isValid) {
      dialog.warning("Validation Error", passwordResult.error);
      return;
    }

    // Check for admin login
    if (isAdminLogin) {
      localStorage.setItem("token", "admin-token");
      localStorage.setItem("role", "admin");
      localStorage.setItem("name", "Admin");
      navigate("/admin/dashboard");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/teacher/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        const permissions = data.user.permissions || {};
        const firstAllowedPath =
          permissions.dashboard
            ? "/teacher/dashboard"
            : permissions.verifiedStudents
            ? "/teacher/verifiedstudents"
            : permissions.pendingStudents
            ? "/teacher/pending"
            : permissions.changeRequests
            ? "/teacher/requests"
            : permissions.contacts
            ? "/teacher/contacts"
            : "/";

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", "teacher");
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("teacherPermissions", JSON.stringify(permissions));
        navigate(firstAllowedPath);
      } else {
        dialog.error("Login Failed", data.message);
      }
    } catch (err) {
      dialog.error("Server Error", "Unable to connect to server. Please try again.");
    }
  };

  return (
    <div className="login-background teacher-login-background">
      <div className="login-card teacher-login-card">
        <form className="form1" onSubmit={handleTeacherLogin}>
          <img src={logo} alt="logo" className="login-logo teacher-login-logo" />
          <h2 className="logintypename">Teacher Login</h2>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Link to="/teacher/forgot-password">Forgot password?</Link>
          <button type="submit" className="login-btn teacher-login-btn">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
