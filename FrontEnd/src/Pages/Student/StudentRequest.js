import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";
import "./StudentRequest.css";
import { dialog } from "../../components/CustomDialog";
import { validateSelect, validateMessage } from "../../utils/validation";

// Category icons mapping
const categoryIcons = {
  "Basic Information": "👤",
  "Contact Information": "📞",
  "Guardian Details": "👨‍👩‍👧",
  "Academic Performance": "📚",
  "Other": "📝"
};

// Status icon component
const StatusIcon = ({ status }) => {
  const icons = {
    pending: "⏳",
    approved: "✓",
    rejected: "✕"
  };
  return <span className="status-icon">{icons[status] || "•"}</span>;
};

export default function StudentRequest() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [requests, setRequests] = useState([]);
  
  // Permission states
  const [secondYearPermission, setSecondYearPermission] = useState(null);
  const [thirdYearPermission, setThirdYearPermission] = useState(null);
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  
  // Get student info from localStorage (no API call needed)
  const studentName = localStorage.getItem("name") || "Student";
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/student/login");
      return;
    }
    // fetch my previous requests
    fetch("http://localhost:8000/student/request/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) setRequests(data.data);
      })
      .catch(err => console.error(err));
      
    // Fetch permissions
    fetchPermissions();
  }, [token, navigate]);

  const fetchPermissions = async () => {
    try {
      // Fetch 2nd year permission status
      const secondYearRes = await fetch("http://localhost:8000/student/permission/status/2nd_year", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const secondYearData = await secondYearRes.json();
      if (secondYearData.success) {
        setSecondYearPermission(secondYearData.permission);
      }

      // Fetch 3rd year permission status
      const thirdYearRes = await fetch("http://localhost:8000/student/permission/status/3rd_year", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const thirdYearData = await thirdYearRes.json();
      if (thirdYearData.success) {
        setThirdYearPermission(thirdYearData.permission);
      }
    } catch (err) {
      console.error("Error fetching permissions:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate category selection
    const categoryResult = validateSelect(category, "category");
    if (!categoryResult.isValid) {
      dialog.error("Validation Error", categoryResult.error);
      return;
    }

    // Validate details/message
    const detailsResult = validateMessage(details, 10, 500);
    if (!detailsResult.isValid) {
      dialog.error("Validation Error", detailsResult.error);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:8000/student/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ category, details }),
      });
      const data = await res.json();
      if (data.success) {
        dialog.success("Submitted", "Your request has been sent to the administration.");
        setCategory("");
        setDetails("");
        setRequests([data.data, ...requests]);
      } else {
        dialog.error("Error", data.message || "Failed to submit request");
      }
    } catch (err) {
      console.error(err);
      dialog.error("Error", "Server error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestPermission = async (permissionType) => {
    dialog.confirm(
      "Request Permission",
      permissionType === "2nd_year" 
        ? "Do you want to request permission to fill Semester 3 & 4 marks (2nd Year)?"
        : "Do you want to request permission to fill Semester 5 & 6 marks (3rd Year)?",
      async () => {
        setIsRequestingPermission(true);
        try {
          const res = await fetch("http://localhost:8000/student/permission/request", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ permissionType }),
          });

          const data = await res.json();

          if (res.ok && data.success) {
            dialog.success("Request Submitted", "Your permission request has been sent to the teacher.");
            // Refresh permissions
            fetchPermissions();
          } else {
            dialog.error("Error", data.message || "Failed to submit request");
          }
        } catch (err) {
          console.error("Error requesting permission:", err);
          dialog.error("Server Error", "Unable to connect to server. Please try again.");
        } finally {
          setIsRequestingPermission(false);
        }
      },
      "Request",
      "Cancel"
    );
  };

  const getPermissionStatus = (permission) => {
    if (!permission) return null;
    return permission.status;
  };

  return (
    <div className="request-layout">
      <StudentSidebar />
      <div className="request-content">
        <div className="request-container">
          {/* Student Info Header */}
          <div className="student-info-header">
            <div className="student-avatar">🎓</div>
            <div className="student-details">
              <span className="student-label">Welcome,</span>
              <h2 className="student-name">{studentName}</h2>
            </div>
          </div>

          {/* Permission Requests Section */}
          <div className="request-form-card permission-section-card">
            <h3>🎓 Semester Filling Permissions</h3>
            <p className="form-subtitle">
              Request permission to fill higher semester marks
            </p>
            
            <div className="permissions-grid">
              {/* 2nd Year Permission */}
              <div className="permission-card">
                <div className="permission-header">
                  <span className="permission-title">2nd Year (Sem 3 & 4)</span>
                  {getPermissionStatus(secondYearPermission) === "approved" && (
                    <span className="permission-badge approved">✓ Approved</span>
                  )}
                  {getPermissionStatus(secondYearPermission) === "pending" && (
                    <span className="permission-badge pending">⏳ Pending</span>
                  )}
                  {getPermissionStatus(secondYearPermission) === "rejected" && (
                    <span className="permission-badge rejected">✕ Rejected</span>
                  )}
                </div>
                <p className="permission-desc">
                  Permission to fill Semester 3 and 4 marks
                </p>
                {secondYearPermission?.teacherNote && (
                  <div className="permission-note">
                    <strong>Note:</strong> {secondYearPermission.teacherNote}
                  </div>
                )}
                {!secondYearPermission || secondYearPermission.status === "rejected" ? (
                  <button 
                    className="permission-request-btn"
                    onClick={() => handleRequestPermission("2nd_year")}
                    disabled={isRequestingPermission}
                  >
                    {isRequestingPermission ? "Requesting..." : "Request Permission"}
                  </button>
                ) : getPermissionStatus(secondYearPermission) === "pending" ? (
                  <button className="permission-request-btn pending-btn" disabled>
                    Awaiting Response
                  </button>
                ) : null}
              </div>

              {/* 3rd Year Permission */}
              <div className="permission-card">
                <div className="permission-header">
                  <span className="permission-title">3rd Year (Sem 5 & 6)</span>
                  {getPermissionStatus(thirdYearPermission) === "approved" && (
                    <span className="permission-badge approved">✓ Approved</span>
                  )}
                  {getPermissionStatus(thirdYearPermission) === "pending" && (
                    <span className="permission-badge pending">⏳ Pending</span>
                  )}
                  {getPermissionStatus(thirdYearPermission) === "rejected" && (
                    <span className="permission-badge rejected">✕ Rejected</span>
                  )}
                </div>
                <p className="permission-desc">
                  Permission to fill Semester 5 and 6 marks
                </p>
                {thirdYearPermission?.teacherNote && (
                  <div className="permission-note">
                    <strong>Note:</strong> {thirdYearPermission.teacherNote}
                  </div>
                )}
                {!thirdYearPermission || thirdYearPermission.status === "rejected" ? (
                  <button 
                    className="permission-request-btn"
                    onClick={() => handleRequestPermission("3rd_year")}
                    disabled={isRequestingPermission}
                  >
                    {isRequestingPermission ? "Requesting..." : "Request Permission"}
                  </button>
                ) : getPermissionStatus(thirdYearPermission) === "pending" ? (
                  <button className="permission-request-btn pending-btn" disabled>
                    Awaiting Response
                  </button>
                ) : null}
              </div>
            </div>
          </div>
          
          <div className="request-form-card">
            <h3>📝 Submit Change Request</h3>
            <p className="form-subtitle">
              Request modifications to your profile information
            </p>
          
            <form className="request-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="category">
                  <span style={{ marginRight: '8px' }}>📋</span>
                  Change Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">-- choose --</option>
                  <option value="Basic Information">Basic Information</option>
                  <option value="Contact Information">Contact Information</option>
                  <option value="Guardian Details">Guardian Details</option>
                  <option value="Academic Performance">Academic Performance</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="details">
                  <span style={{ marginRight: '8px' }}>✏️</span>
                  Details / Comments
                </label>
                <textarea
                  id="details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={5}
                  placeholder="Please describe the changes you need..."
                ></textarea>
              </div>

              <button type="submit" disabled={submitting} className="submit-btn">
                {submitting ? (
                  <>Submitting...</>
                ) : (
                  <>
                    <span>🚀</span> Send Request
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="history-section">
            <h3>Your Previous Requests</h3>
            
            {requests.length > 0 ? (
              <ul className="request-list">
                {requests.map((req) => (
                  <li key={req._id} className={`req-item ${req.status}`}>
                    <div className="req-header">
                      <span className="req-category">
                        {categoryIcons[req.category] || "📝"} {req.category}
                      </span>
                      <span className="status-tag">
                        <StatusIcon status={req.status} />
                        {req.status}
                      </span>
                    </div>
                    <p className="req-details">{req.details}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                <p>No previous requests found. Submit your first request above!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

