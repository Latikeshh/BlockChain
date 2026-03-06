import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { dialog } from "../../components/CustomDialog";
import { validateEnrollment, validatePassword } from "../../utils/validation";
import "./StudentLogin.css";
import logo from "../Images/clglogo.png";

export default function StudentLogin() {
  const [enroll, setEnroll] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleStudentLogin = async (e) => {
    e.preventDefault();

    // Validate enrollment number
    const enrollResult = validateEnrollment(enroll);
    if (!enrollResult.isValid) {
      dialog.warning("Validation Error", enrollResult.error);
      return;
    }

    // Validate password
    const passwordResult = validatePassword(password);
    if (!passwordResult.isValid) {
      dialog.warning("Validation Error", passwordResult.error);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enroll, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("role", "student");
        localStorage.setItem("name", data.user.name);
        navigate("/student/dashboard");
      } else {
        dialog.error("Login Failed", data.message);
      }
    } catch (err) {
      dialog.error("Server Error", "Unable to connect to server. Please try again.");
    }
  };

  return (
    <div className="login-background student-login-background">
      <div className="login-card student-login-card">
        <form className="form1" onSubmit={handleStudentLogin}>
          <img src={logo} alt="logo" className="login-logo student-login-logo" />
          <h2 className="logintypename">Student Login</h2>
          <input
            type="text"
            inputMode="numeric"
            maxLength={11}
            placeholder="Enrollment Number"
            value={enroll}
            onChange={(e) => setEnroll(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Link to="/student/forgot-password">Forgot password?</Link>
          <button type="submit" className="login-btn student-login-btn">  Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
