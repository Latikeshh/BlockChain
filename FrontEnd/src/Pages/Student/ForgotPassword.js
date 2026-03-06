import { useState } from "react";
import { Link } from "react-router-dom";
import { dialog } from "../../components/CustomDialog";
import { validateEnrollment } from "../../utils/validation";
import "./StudentLogin.css"
import logo from "../Images/clglogo.png";

export default function ForgotPassword() {
  const [enroll, setEnroll] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [studentName, setStudentName] = useState("");

  const handleSubmitRequest = async (e) => {
    e.preventDefault();

    // Validate enrollment number
    const enrollResult = validateEnrollment(enroll);
    if (!enrollResult.isValid) {
      dialog.warning("Validation Error", enrollResult.error);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/student/password-reset-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enroll })
      });

      const data = await res.json();

      if (res.ok) {
        setRequestSubmitted(true);
        setStudentName(data.studentName || "");
        dialog.success("Request Submitted", "Your password reset request has been sent to your teacher. Please wait for approval.");
      } else {
        dialog.error("Error", data.message);
      }
    } catch (err) {
      dialog.error("Server Error", "Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-background student-login-background">
      <div className="login-card student-login-card">
        {!requestSubmitted ? (
          <form className="form1" onSubmit={handleSubmitRequest}>
            <img src={logo} alt="logo" className="login-logo student-login-logo" />
            <h2 className="logintypename">Forgot Password</h2>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
              Enter your enrollment number to request a password reset. Your teacher will review and reset your password.
            </p>
            
            <input
              type="text"
              inputMode="numeric"
              maxLength={11}
              placeholder="Enrollment Number (11 digits)"
              value={enroll}
              onChange={(e) => setEnroll(e.target.value)}
            />
            
            <button type="submit" className="login-btn student-login-btn" disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </button>
            
            <Link to="/student" style={{ marginTop: "15px", display: "block" }}>
              Back to Login
            </Link>
          </form>
        ) : (
          <div className="success-card">
            <div className="success-icon-container">
              <svg className="success-icon" viewBox="0 0 52 52">
                <circle className="success-icon-circle" cx="26" cy="26" r="25" fill="none"/>
                <path className="success-icon-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
              </svg>
            </div>
            <h2 className="success-title">Request Submitted!</h2>
            <p className="success-message">
              Your password reset request has been sent successfully.
            </p>
            <div className="success-details">
              <div className="detail-item">
                <span className="detail-label">Enrollment</span>
                <span className="detail-value">{enroll}</span>
              </div>
              {studentName && (
                <div className="detail-item">
                  <span className="detail-label">Name</span>
                  <span className="detail-value">{studentName}</span>
                </div>
              )}
            </div>
            <p className="success-note">
              Please contact your teacher to reset your password.
            </p>
            
            <button 
              type="button"
              className="login-btn student-login-btn" 
              onClick={() => {
                setRequestSubmitted(false);
                setEnroll("");
              }}
            >
              Submit Another Request
            </button>
            
            <Link to="/student" className="back-link">
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

