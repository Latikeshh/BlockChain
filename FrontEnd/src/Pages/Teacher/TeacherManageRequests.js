import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import "./TeacherManageRequests.css";
import { dialog } from "../../components/CustomDialog";

export default function TeacherManageRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [approveData, setApproveData] = useState("");
  const [teacherNote, setTeacherNote] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("requests"); // "requests" or "permissions"
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/teacher/login");
      return;
    }
    fetchRequests();
    fetchPermissions();
  }, [token, navigate]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const url = filterStatus === "all" 
        ? "http://localhost:8000/student/teacher-request/all"
        : `http://localhost:8000/student/teacher-request/all?status=${filterStatus}`;
      
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setRequests(data.data);
      }
    } catch (err) {
      console.error(err);
      dialog.error("Error", "Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const res = await fetch("http://localhost:8000/student/permission/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("Permissions response:", data);
      if (data.success) {
        setPermissions(data.permissions);
      }
    } catch (err) {
      console.error("Error fetching permissions:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [filterStatus]);

  const viewRequestDetails = async (req) => {
    setSelectedRequest(req);
    setCurrentProfile(null);
    
    try {
      const res = await fetch(`http://localhost:8000/student/teacher-request/${req._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setCurrentProfile(data.currentProfile);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async () => {
    if (!selectedRequest) return;

    try {
      const res = await fetch(`http://localhost:8000/student/teacher-request/${selectedRequest._id}/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ approvedData: approveData }),
      });
      const data = await res.json();
      if (data.success) {
        dialog.success("Success", "Request approved. Student can now update their profile.");
        setShowApproveDialog(false);
        setApproveData("");
        fetchRequests();
        setSelectedRequest(null);
      } else {
        dialog.error("Error", data.message || "Failed to approve request");
      }
    } catch (err) {
      console.error(err);
      dialog.error("Error", "Server error");
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    const reason = prompt("Please enter reason for rejection:");
    if (reason === null) return;

    try {
      const res = await fetch(`http://localhost:8000/student/teacher-request/${selectedRequest._id}/reject`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rejectReason: reason }),
      });
      const data = await res.json();
      if (data.success) {
        dialog.success("Rejected", "Request has been rejected.");
        fetchRequests();
        setSelectedRequest(null);
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
      rejected: { class: "rejected", label: "Rejected" },
      completed: { class: "completed", label: "Completed" }
    };
    return badges[status] || badges.pending;
  };

  // Permission handlers
  const viewPermissionDetails = (perm) => {
    setSelectedPermission(perm);
    setTeacherNote("");
    setShowPermissionModal(true);
  };

  const handleApprovePermission = async () => {
    if (!selectedPermission) return;

    try {
      const res = await fetch(`http://localhost:8000/student/permission/respond/${selectedPermission._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "approved", teacherNote: teacherNote }),
      });
      
      const data = await res.json();
      console.log("Approve response:", data);
      
      if (res.ok && data.success) {
        dialog.success("Success", "Permission approved. Student can now fill higher semester marks.");
        setShowPermissionModal(false);
        setTeacherNote("");
        fetchPermissions();
      } else {
        dialog.error("Error", data.message || "Failed to approve permission");
      }
    } catch (err) {
      console.error("Approve error:", err);
      dialog.error("Error", "Server error: " + err.message);
    }
  };

  const handleRejectPermission = async () => {
    if (!selectedPermission) return;

    const reason = prompt("Please enter reason for rejection:");
    if (reason === null) return;

    try {
      const res = await fetch(`http://localhost:8000/student/permission/respond/${selectedPermission._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "rejected", teacherNote: reason }),
      });
      
      const data = await res.json();
      console.log("Reject response:", data);
      
      if (res.ok && data.success) {
        dialog.success("Rejected", "Permission request has been rejected.");
        setShowPermissionModal(false);
        fetchPermissions();
      } else {
        dialog.error("Error", data.message || "Failed to reject permission");
      }
    } catch (err) {
      console.error("Reject error:", err);
      dialog.error("Error", "Server error: " + err.message);
    }
  };

  const getPermissionTypeLabel = (type) => {
    return type === "2nd_year" ? "2nd Year (Sem 3 & 4)" : "3rd Year (Sem 5 & 6)";
  };

  return (
    <div className="teacher-req-layout">
      <TeacherSidebar/>
      <div className="teacher-req-content">
        <div className="teacher-req-container">
          {/* Tab Navigation */}
          <div className="tab-navigation">
            <button 
              className={`tab-btn ${activeTab === "requests" ? "active" : ""}`}
              onClick={() => setActiveTab("requests")}
            >
              📋 Student Info Requests ({requests.filter(r => r.status === "pending").length})
            </button>
            <button 
              className={`tab-btn ${activeTab === "permissions" ? "active" : ""}`}
              onClick={() => setActiveTab("permissions")}
            >
              🎓 Permission Requests ({permissions.length})
            </button>
          </div>

          {/* Student Info Requests Tab */}
          {activeTab === "requests" && (
            <>
              <div className="teacher-req-header">
                <h2>Student Information Requests</h2>
                <div className="filter-section">
                  <label>Filter by Status: </label>
                  <select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Requests</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <p className="loading-text">Loading requests...</p>
              ) : requests.length === 0 ? (
                <div className="empty-state">
                  <p>No requests found.</p>
                </div>
              ) : (
                <div className="requests-grid">
                  {requests.map((req) => (
                    <div 
                      key={req._id} 
                      className={`request-card ${req.status}`}
                      onClick={() => viewRequestDetails(req)}
                    >
                      <div className="request-card-header">
                        <span className="student-name">{req.studentName}</span>
                        <span className={`status-badge ${getStatusBadge(req.status).class}`}>
                          {getStatusBadge(req.status).label}
                        </span>
                      </div>
                      <div className="request-card-body">
                        <p className="enrollment">📚 {req.studentEnroll}</p>
                        <p className="category">📋 {req.category}</p>
                        <div className="request-details-preview">
                          <p><strong>Current:</strong> {req.currentData.substring(0, 50)}...</p>
                          <p><strong>Requested:</strong> {req.requestedChange.substring(0, 50)}...</p>
                        </div>
                      </div>
                      <div className="request-card-footer">
                        <span className="date">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Permission Requests Tab */}
          {activeTab === "permissions" && (
            <>
              <div className="teacher-req-header">
                <h2>Semester Filling Permission Requests</h2>
                <p className="header-subtitle">Students requesting permission to fill higher semester marks</p>
              </div>

              {permissions.length === 0 ? (
                <div className="empty-state">
                  <p>No pending permission requests.</p>
                </div>
              ) : (
                <div className="requests-grid">
                  {permissions.map((perm) => (
                    <div 
                      key={perm._id} 
                      className="request-card permission-card"
                      onClick={() => viewPermissionDetails(perm)}
                    >
                      <div className="request-card-header">
                        <span className="student-name">{perm.studentName}</span>
                        <span className="status-badge pending">Pending</span>
                      </div>
                      <div className="request-card-body">
                        <p className="enrollment">📚 {perm.studentEnroll}</p>
                        <p className="category">🎓 {getPermissionTypeLabel(perm.permissionType)}</p>
                        <p className="request-date">
                          Requested: {new Date(perm.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Request Details Modal */}
          {selectedRequest && (
            <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Request Details</h3>
                  <button className="close-btn" onClick={() => setSelectedRequest(null)}>×</button>
                </div>
                <div className="modal-body">
                  <div className="detail-section">
                    <h4>Student Information</h4>
                    <p><strong>Name:</strong> {selectedRequest.studentName}</p>
                    <p><strong>Enrollment:</strong> {selectedRequest.studentEnroll}</p>
                    <p><strong>Status:</strong> <span className={`status-badge ${getStatusBadge(selectedRequest.status).class}`}>{getStatusBadge(selectedRequest.status).label}</span></p>
                  </div>

                  <div className="detail-section">
                    <h4>Request Details</h4>
                    <p><strong>Category:</strong> {selectedRequest.category}</p>
                    <p><strong>Current Information:</strong></p>
                    <div className="info-box">{selectedRequest.currentData}</div>
                    <p><strong>Requested Change:</strong></p>
                    <div className="info-box highlight">{selectedRequest.requestedChange}</div>
                    <p><strong>Submitted:</strong> {new Date(selectedRequest.createdAt).toLocaleString()}</p>
                  </div>

                  {currentProfile && (
                    <div className="detail-section">
                      <h4>Current Student Profile</h4>
                      <div className="profile-preview">
                        <p><strong>Name:</strong> {currentProfile.name}</p>
                        <p><strong>Enrollment:</strong> {currentProfile.enroll}</p>
                        <p><strong>Branch:</strong> {currentProfile.branch}</p>
                        <p><strong>Year:</strong> {currentProfile.year}</p>
                        <p><strong>Phone:</strong> {currentProfile.phone}</p>
                        <p><strong>Email:</strong> {currentProfile.email}</p>
                      </div>
                    </div>
                  )}

                  {selectedRequest.status === "approved" && (
                    <div className="detail-section">
                      <h4>Approval Info</h4>
                      <p><strong>Approved by:</strong> {selectedRequest.teacherName}</p>
                      <p><strong>Approved at:</strong> {selectedRequest.approvedAt ? new Date(selectedRequest.approvedAt).toLocaleString() : "N/A"}</p>
                      <p><strong>Status:</strong> {selectedRequest.studentSubmitted ? "Student submitted updated profile" : "Waiting for student to update"}</p>
                    </div>
                  )}

                  {selectedRequest.status === "rejected" && (
                    <div className="detail-section">
                      <h4>Rejection Info</h4>
                      <p><strong>Rejected by:</strong> {selectedRequest.teacherName}</p>
                      <p><strong>Reason:</strong> {selectedRequest.approvedData}</p>
                    </div>
                  )}
                </div>

                {selectedRequest.status === "pending" && (
                  <div className="modal-footer">
                    <button className="reject-btn" onClick={handleReject}>
                      Reject Request
                    </button>
                    <button className="approve-btn" onClick={() => setShowApproveDialog(true)}>
                      Approve & Allow Update
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Approve Dialog */}
          {showApproveDialog && (
            <div className="modal-overlay" onClick={() => setShowApproveDialog(false)}>
              <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Approve Request</h3>
                  <button className="close-btn" onClick={() => setShowApproveDialog(false)}>×</button>
                </div>
                <div className="modal-body">
                  <p>You are about to approve this request. The student will be able to update their profile information. When they submit the updated information, the old blockchain block will be permanently deleted.</p>
                  
                  <div className="form-group">
                    <label>Additional Notes (Optional):</label>
                    <textarea
                      value={approveData}
                      onChange={(e) => setApproveData(e.target.value)}
                      placeholder="Add any notes for the student..."
                      rows={4}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="cancel-btn" onClick={() => setShowApproveDialog(false)}>
                    Cancel
                  </button>
                  <button className="approve-btn" onClick={handleApprove}>
                    Confirm Approval
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Permission Details Modal */}
          {showPermissionModal && selectedPermission && (
            <div className="modal-overlay" onClick={() => setShowPermissionModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Permission Request Details</h3>
                  <button className="close-btn" onClick={() => setShowPermissionModal(false)}>×</button>
                </div>
                <div className="modal-body">
                  <div className="detail-section">
                    <h4>Student Information</h4>
                    <p><strong>Name:</strong> {selectedPermission.studentName}</p>
                    <p><strong>Enrollment:</strong> {selectedPermission.studentEnroll}</p>
                  </div>

                  <div className="detail-section">
                    <h4>Permission Details</h4>
                    <p><strong>Permission Type:</strong> {getPermissionTypeLabel(selectedPermission.permissionType)}</p>
                    <p><strong>Submitted:</strong> {new Date(selectedPermission.createdAt).toLocaleString()}</p>
                    <p><strong>Status:</strong> <span className="status-badge pending">Pending</span></p>
                  </div>

                  <div className="form-group">
                    <label>Add Note (Optional):</label>
                    <textarea
                      value={teacherNote}
                      onChange={(e) => setTeacherNote(e.target.value)}
                      placeholder="Add a note for the student..."
                      rows={3}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="reject-btn" onClick={handleRejectPermission}>
                    Reject Permission
                  </button>
                  <button className="approve-btn" onClick={handleApprovePermission}>
                    Approve Permission
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

