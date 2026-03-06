import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { dialog } from "../components/CustomDialog";
import "./Student/StudentLogin.css";
import logo from "./Images/clglogo.png";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const userType = searchParams.get("type"); // "student" or "teacher"
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);

  useEffect(() => {
    if (!token || !email) {
      setIsValidToken(false);
    }
  }, [token, email]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      dialog.warning("Required Fields", "Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      dialog.warning("Password Mismatch", "New password and confirm password do not match");
      return;
    }

    if (newPassword.length < 6) {
      dialog.warning("Weak Password", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    
    const endpoint = userType === "teacher" 
      ? "http://localhost:8000/teacher/reset-password"
      : "http://localhost:8000/student/reset-password";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword })
      });

      const data = await res.json();

      if (res.ok) {
        dialog.success("Success", "Password reset successful! Please login with your new password.");
        
        // Redirect to appropriate login page
        if (userType === "teacher") {
          navigate("/teacher/login");
        } else {
          navigate("/student");
        }
      } else {
        dialog.error("Error", data.message);
      }
    } catch (err) {
      dialog.error("Server Error", "Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="login-background student-login-background">
        <div className="login-card student-login-card">
          <img src={logo} alt="logo" className="login-logo student-login-logo" />
          <h2 className="logintypename">Invalid Reset Link</h2>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px", textAlign: "center" }}>
            This password reset link is invalid or has expired.
          </p>
          <Link to="/student" style={{ marginTop: "15px", display: "block", textAlign: "center" }}>
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="login-background student-login-background">
      <div className="login-card student-login-card">
        <form className="form1" onSubmit={handleResetPassword}>
          <img src={logo} alt="logo" className="login-logo student-login-logo" />
          <h2 className="logintypename">Reset Password</h2>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
            Enter your new password for {email}
          </p>
          
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          
          <button type="submit" className="login-btn student-login-btn" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
          
          <Link to={userType === "teacher" ? "/teacher/login" : "/student"} style={{ marginTop: "15px", display: "block" }}>
            Back to Login
          </Link>
        </form>
      </div>
    </div>
  );
}

