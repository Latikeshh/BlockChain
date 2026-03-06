import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import "./AdminPasswordResetRequests.css";
import { dialog } from "../../components/CustomDialog";

export default function AdminPasswordResetRequests() {
  const navigate = useNavigate();
  const [studentRequests, setStudentRequests] = useState([]);
  const [teacherRequests, setTeacherRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("students");
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [processing, setProcessing] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchRequests();
  }, [token]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // Fetch student password reset requests
      const studentRes = await fetch("http://localhost:8000/student/password-reset-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const studentData = await studentRes.json();
      
      // Fetch teacher password reset requests
      const teacherRes = await fetch("http://localhost:8000/teacher/password-reset-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const teacherData = await teacherRes.json();

      if (studentData.success) {
        setStudentRequests(studentData.data);
      }
      if (teacherData.success) {
        setTeacherRequests(teacherData.data);
      }
    } catch (err) {
      console.error(err);
      dialog.error("Error", "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const openResetModal = (request, type) => {
    setSelectedRequest({ ...request, type });
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

    setProcessing(true);
    try {
      const endpoint = selectedRequest.type === "student" 
        ? "http://localhost:8000/student/reset-student-password"
        : "http://localhost:8000/teacher/reset-teacher-password";

      const res = await fetch(endpoint, {
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
      setProcessing(false);
    }
  };

  const rejectRequest = async (request, type) => {
    const reason = prompt("Please enter reason for rejection:");
    if (reason === null) return;

    try {
      let endpoint;
      if (type === "student") {
        endpoint = `http://localhost:8000/student/password-reset-request/${request._id}/reject`;
      } else {
        endpoint = `http://localhost:8000/teacher/password-reset-request/${request._id}/reject`;
      }

      const res = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rejectReason: reason }),
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

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: "pending", label: "Pending" },
      approved: { class: "approved", label: "Approved" },
      rejected: { class: "rejected", label: "Rejected" }
    };
    return badges[status] || badges.pending;
  };

  const currentRequests = activeTab === "students" ? studentRequests : teacherRequests;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-pwdreset-container">
          {/* Header */}
          <div className="admin-pwdreset-header">
            <h2>Password Reset Requests</h2>
          </div>

          {/* Tabs */}
          <div className="pwdreset-tabs">
            <button 
              className={`pwdreset-tab-btn ${activeTab === "students" ? "active" : ""}`}
              onClick={() => setActiveTab("students")}
            >
              Student Requests 
              <span className="pwdreset-tab-count">
                {studentRequests.filter(r => r.status === "pending").length}
              </span>
            </button>
            <button 
              className={`pwdreset-tab-btn ${activeTab === "teachers" ? "active" : ""}`}
              onClick={() => setActiveTab("teachers")}
            >
              Teacher Requests 
              <span className="pwdreset-tab-count">
                {teacherRequests.filter(r => r.status === "pending").length}
              </span>
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <div className="pwdreset-loading">
              <div className="pwdreset-loading-spinner"></div>
            </div>
          ) : currentRequests.length === 0 ? (
            <div className="pwdreset-empty-state">
              <div className="pwdreset-empty-icon">📋</div>
              <h3>No Requests Found</h3>
              <p>There are no password reset requests in this category.</p>
            </div>
          ) : (
            <div className="pwdreset-requests-grid">
              {currentRequests.map((req) => (
                <div key={req._id} className={`pwdreset-request-card ${req.status}`}>
                  <div className="pwdreset-card-header">
                    <div className="pwdreset-student-avatar">
                      {req.requesterName?.charAt(0).toUpperCase() || 
                       req.studentId?.name?.charAt(0).toUpperCase() ||
                       req.teacherId?.name?.charAt(0).toUpperCase() || 'S'}
                    </div>
                    <div className="pwdreset-student-info">
                      <h4>{req.requesterName || req.studentId?.name || req.teacherId?.name}</h4>
                      <span className="enrollment">
                        {req.requesterIdentifier || req.studentId?.enroll || req.teacherId?.email}
                      </span>
                    </div>
                    <span className={`pwdreset-status-badge ${getStatusBadge(req.status).class}`}>
                      {getStatusBadge(req.status).label}
                    </span>
                  </div>

                  <div className="pwdreset-card-body">
                    <div className="pwdreset-card-detail">
                      <span>📋</span>
                      <span>Password Reset Request</span>
                    </div>
                    <div className="pwdreset-card-detail">
                      <span>📅</span>
                      <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {req.status === "pending" && (
                    <div className="pwdreset-card-actions">
                      <button
                        className="pwdreset-btn-action pwdreset-btn-reset"
                        onClick={() => openResetModal(req, activeTab === "students" ? "student" : "teacher")}
                      >
                        🔑 Reset Password
                      </button>
                      <button
                        className="pwdreset-btn-action pwdreset-btn-reject"
                        onClick={() => rejectRequest(req, activeTab === "students" ? "student" : "teacher")}
                      >
                        ❌ Reject
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
        <div className="pwdreset-modal-overlay" onClick={() => setShowResetModal(false)}>
          <div className="pwdreset-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pwdreset-modal-header">
              <h3>Reset Password</h3>
            </div>
            
            <div className="pwdreset-modal-body">
              <div className="pwdreset-modal-student-info">
                <div className="pwdreset-modal-avatar">
                  {selectedRequest?.requesterName?.charAt(0).toUpperCase() || 
                   selectedRequest?.studentId?.name?.charAt(0).toUpperCase() ||
                   selectedRequest?.teacherId?.name?.charAt(0).toUpperCase() || 'S'}
                </div>
                <div className="pwdreset-modal-student-details">
                  <h4>{selectedRequest?.requesterName || selectedRequest?.studentId?.name || selectedRequest?.teacherId?.name}</h4>
                  <span>
                    {selectedRequest?.type === "student" 
                      ? `Enrollment: ${selectedRequest?.requesterIdentifier || selectedRequest?.studentId?.enroll}`
                      : `Email: ${selectedRequest?.requesterIdentifier || selectedRequest?.teacherId?.email}`
                    }
                  </span>
                </div>
              </div>
              
              <div className="pwdreset-form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>
              
              <div className="pwdreset-form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            
            <div className="pwdreset-modal-footer">
              <button
                className="pwdreset-modal-btn pwdreset-modal-btn-cancel"
                onClick={() => setShowResetModal(false)}
              >
                Cancel
              </button>
              <button
                className="pwdreset-modal-btn pwdreset-modal-btn-confirm"
                onClick={handleResetPassword}
                disabled={processing}
              >
                {processing ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

