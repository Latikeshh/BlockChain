import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import "./PasswordResetRequests.css";
import { dialog } from "../../components/CustomDialog";

export default function PasswordResetRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/teacher/login");
      return;
    }
    fetchRequests();
  }, [token]);

  const fetchRequests = () => {
    fetch("http://localhost:8000/student/password-reset-requests", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setRequests(data.data);
        } else {
          dialog.error("Error", data.message || "Failed to fetch requests");
        }
      })
      .catch((err) => {
        console.error(err);
        dialog.error("Error", "Server error");
      })
      .finally(() => setLoading(false));
  };

  const openResetModal = (request) => {
    setSelectedRequest(request);
    setShowResetModal(true);
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      dialog.warning("Required Fields", "Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      dialog.warning("Password Mismatch", "Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      dialog.warning("Weak Password", "Password must be at least 6 characters");
      return;
    }

    setProcessing(selectedRequest._id);
    try {
      const res = await fetch("http://localhost:8000/student/reset-student-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId: selectedRequest._id, newPassword }),
      });

      const data = await res.json();
      if (data.success) {
        dialog.success("Success", "Password reset successfully!");
        setShowResetModal(false);
        fetchRequests();
      } else {
        dialog.error("Error", data.message || "Failed to reset password");
      }
    } catch (err) {
      console.error(err);
      dialog.error("Error", "Server error");
    } finally {
      setProcessing(null);
    }
  };

  const rejectRequest = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/student/request/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "rejected" }),
      });

      const data = await res.json();
      if (data.success) {
        dialog.success("Success", "Request rejected");
        fetchRequests();
      } else {
        dialog.error("Error", data.message || "Failed to reject request");
      }
    } catch (err) {
      console.error(err);
      dialog.error("Error", "Server error");
    }
  };

  return (
    <div className="teacher-req-layout">
      <TeacherSidebar />
      <div className="teacher-req-content">
        <div className="teacher-req-container">
          <div className="req-header">
            <h2>Password Reset Requests</h2>
            <span className="req-count">{requests.filter(r => r.status === 'pending').length} pending</span>
          </div>
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="empty-state">
              <svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
              </svg>
              <h3>No Requests Found</h3>
              <p>There are no password reset requests at the moment.</p>
            </div>
          ) : (
            <div className="req-grid">
              {requests.map((req) => (
                <div key={req._id} className={`req-card ${req.status}`}>
                  <div className="req-card-header">
                    <div className="student-avatar">
                      {req.studentId?.name?.charAt(0).toUpperCase() || 'S'}
                    </div>
                    <div className="student-info">
                      <h4>{req.studentId?.name}</h4>
                      <span className="enrollment">{req.studentId?.enroll}</span>
                    </div>
                    <span className={`status-badge ${req.status}`}>
                      {req.status === 'pending' && <span className="status-dot"></span>}
                      {req.status}
                    </span>
                  </div>
                  
                  <div className="req-card-body">
                    <div className="req-detail">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                      <span>Password Reset Request</span>
                    </div>
                    <div className="req-detail">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <span>{new Date(req.createdAt).toLocaleDateString()} at {new Date(req.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  </div>
                  
                  {req.status === "pending" && (
                    <div className="req-card-actions">
                      <button
                        className="btn-reset"
                        onClick={() => openResetModal(req)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                        </svg>
                        Reset Password
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => rejectRequest(req._id)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="modal-overlay" onClick={() => setShowResetModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <div className="modal-icon-reset">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <h3>Reset Student Password</h3>
            </div>
            
            <div className="modal-body-custom">
              <div className="student-info-card">
                <div className="student-avatar-large">
                  {selectedRequest?.studentId?.name?.charAt(0).toUpperCase() || 'S'}
                </div>
                <div className="student-details">
                  <h4>{selectedRequest?.studentId?.name}</h4>
                  <span>Enrollment: {selectedRequest?.studentId?.enroll}</span>
                </div>
              </div>
              
              <div className="form-group-custom">
                <label>New Password</label>
                <div className="input-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
              </div>
              
              <div className="form-group-custom">
                <label>Confirm Password</label>
                <div className="input-wrapper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>
            
            <div className="modal-footer-custom">
              <button
                className="btn-cancel-modal"
                onClick={() => setShowResetModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-confirm-modal"
                onClick={handleResetPassword}
                disabled={processing === selectedRequest?._id}
              >
                {processing === selectedRequest?._id ? (
                  <>
                    <span className="btn-spinner"></span>
                    Resetting...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Reset Password
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

