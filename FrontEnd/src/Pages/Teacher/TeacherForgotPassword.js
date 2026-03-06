import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { dialog } from "../../components/CustomDialog";
import "./TeacherForgotPassword.css";
import logo from "../Images/clglogo.png";

export default function TeacherForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const navigate = useNavigate();

  const handleSendResetRequest = async (e) => {
    e.preventDefault();

    if (!email) {
      dialog.warning("Required Fields", "Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      // Send request to admin via new endpoint
      const res = await fetch("http://localhost:8000/teacher/password-reset-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setRequestSent(true);
        dialog.success("Request Submitted", "Your password reset request has been sent to admin. Please wait for approval.");
      } else {
        dialog.error("Error", data.message || "Failed to submit request");
      }
    } catch (err) {
      dialog.error("Server Error", "Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tfp-login-background">
      <div className="tfp-login-card">
        {!requestSent ? (
          <form className="form1" onSubmit={handleSendResetRequest}>
            <img src={logo} alt="logo" className="tfp-login-logo" />
            <h2 className="logintypename">Forgot Password</h2>
            <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
              Enter your registered email address to request a password reset. Admin will review and reset your password.
            </p>

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button type="submit" className="tfp-login-btn" disabled={loading}>
              {loading ? "Sending..." : "Submit Request"}
            </button>

            <Link to="/teacher/login" style={{ marginTop: "15px", display: "block" }}>
              Back to Login
            </Link>
          </form>
        ) : (
          <div className="tfp-success-card">
            <div className="tfp-success-icon-container">
              <svg className="tfp-success-icon" viewBox="0 0 52 52">
                <circle className="tfp-success-icon-circle" cx="26" cy="26" r="25" fill="none" />
                <path className="tfp-success-icon-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>
            <h2 className="tfp-success-title">Request Submitted!</h2>
            <p className="tfp-success-message">
              Your password reset request has been sent successfully.
            </p>
            <div className="tfp-success-details">
              <div className="tfp-detail-item">
                <span className="tfp-detail-label">Email</span>
                <span className="tfp-detail-value">{email}</span>
              </div>
            </div>
            <p className="tfp-success-note">
              Admin will review your request and reset your password.
            </p>

            <button
              type="button"
              className="tfp-login-btn"
              onClick={() => {
                setRequestSent(false);
                setEmail("");
              }}
            >
              Submit Another Request
            </button>

            <Link to="/teacher/login" className="tfp-back-link">
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

