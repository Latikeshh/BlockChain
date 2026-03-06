import { useState, useEffect } from "react";
import StudentSidebar from "./StudentSidebar";
import "./StudentStatus.css";

export default function StudentStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8000/student/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          // response now includes verify,name,enroll from profile controller
          setStatus({
            verified: data.verify === true,
            name: data.name || data.data?.profile?.name || "N/A",
            enroll: data.enroll || data.data?.profile?.enroll || "N/A",
            message: data.verify
              ? "Your profile has been verified successfully!"
              : "Your profile is awaiting verification by administrator."
          });
        } else {
          setStatus({
            verified: false,
            message: data.message || "Unable to fetch verification status"
          });
        }
      } catch (err) {
        setError("Server error. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  if (loading) {
    return (
      <div className="student-page-wrapper">
        <StudentSidebar />
        <div className="student-layout">
          <div className="status-content">
            <div className="loading-spinner">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="student-page-wrapper">
      <StudentSidebar />
      <div className="student-layout">
        <div className="status-content">
          <div className="status-container">
            <h2>Verification Status</h2>
            {error ? (
              <div className="status-card error">
                <div className="status-icon error-icon">✕</div>
                <p className="error-message">{error}</p>
              </div>
            ) : status?.verified ? (
              <div className="status-card success">
                <div className="status-icon success-icon">✓</div>
                <h3>Verified Student</h3>
                <p className="success-message">{status.message}</p>
                <div className="student-info">
                  <div className="info-row">
                    <span className="label">Name:</span>
                    <span className="value">{status.name}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Enrollment:</span>
                    <span className="value">{status.enroll}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="status-card pending">
                <div className="status-icon pending-icon">⏳</div>
                <h3>Pending Verification</h3>
                <p className="pending-message">{status?.message || "Your profile is awaiting verification by administrator."}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
