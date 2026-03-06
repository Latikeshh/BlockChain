import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";
import "./StudentRequest.css";
import { dialog } from "../../components/CustomDialog";
import { validateSelect, validateMessage, getFirstError } from "../../utils/validation";

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
    rejected: "✕",
    completed: "✅"
  };
  return <span className="status-icon">{icons[status] || "•"}</span>;
};

export default function StudentTeacherRequest() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [currentData, setCurrentData] = useState("");
  const [requestedChange, setRequestedChange] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [requests, setRequests] = useState([]);
  const [approvedRequest, setApprovedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  
  // Get student info from localStorage
  const studentName = localStorage.getItem("name") || "Student";
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/student/login");
      return;
    }
    fetchData();
  }, [token, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch my requests
      const requestsRes = await fetch("http://localhost:8000/student/teacher-request/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const requestsData = await requestsRes.json();
      if (requestsData.success) {
        setRequests(requestsData.data);
      }

      // Check for approved request
      const approvedRes = await fetch("http://localhost:8000/student/teacher-request/me/approved", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const approvedData = await approvedRes.json();
      if (approvedData.success) {
        setApprovedRequest(approvedData.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const validateTeacherRequestForm = () => {
    const newErrors = {};
    
    const categoryResult = validateSelect(category, "Category");
    if (!categoryResult.isValid) {
      newErrors.category = categoryResult.error;
    }
    
    const currentDataResult = validateMessage(currentData, 5, 500);
    if (!currentDataResult.isValid) {
      newErrors.currentData = currentDataResult.error;
    }
    
    const requestedChangeResult = validateMessage(requestedChange, 5, 500);
    if (!requestedChangeResult.isValid) {
      newErrors.requestedChange = requestedChangeResult.error;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateTeacherRequestForm()) {
      const errorMsg = getFirstError(errors);
      dialog.error("Validation Error", errorMsg);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:8000/student/teacher-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ category, currentData, requestedChange }),
      });
      const data = await res.json();
      if (data.success) {
        dialog.success("Submitted", "Your request has been sent to the teacher.");
        setCategory("");
        setCurrentData("");
        setRequestedChange("");
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

  const handleUpdateProfile = () => {
    // Navigate to profile page for editing
    navigate("/student/profile");
  };

  if (loading) {
    return (
      <div className="request-layout">
        <StudentSidebar />
        <div className="request-content">
          <div className="request-container">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

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

          {/* Approved Request Alert */}
          {approvedRequest && (
            <div className="approved-banner">
              <div className="approved-icon">🎉</div>
              <div className="approved-text">
                <strong>Request Approved!</strong>
                <p>
                  Your request for "{approvedRequest.category}" has been approved by the teacher.
                  You can now update your information.
                </p>
                <button className="update-profile-btn" onClick={handleUpdateProfile}>
                  📝 Update My Profile
                </button>
              </div>
            </div>
          )}
          
          <div className="request-form-card">
            <h3>Request Teacher to Add/Modify Information</h3>
            <p className="form-subtitle">
              Submit a request to your teacher to add or modify your profile information
            </p>
          
            <form className="request-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="category">
                  <span style={{ marginRight: '8px' }}>📋</span>
                  Category
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
                <label htmlFor="currentData">
                  <span style={{ marginRight: '8px' }}>📄</span>
                  Current Information
                </label>
                <textarea
                  id="currentData"
                  value={currentData}
                  onChange={(e) => setCurrentData(e.target.value)}
                  rows={3}
                  placeholder="What is the current information (that you want to change)?"
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="requestedChange">
                  <span style={{ marginRight: '8px' }}>✏️</span>
                  Requested Change
                </label>
                <textarea
                  id="requestedChange"
                  value={requestedChange}
                  onChange={(e) => setRequestedChange(e.target.value)}
                  rows={3}
                  placeholder="What changes would you like to make?"
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
                    <div className="req-details-box">
                      <p><strong>Current:</strong> {req.currentData}</p>
                      <p><strong>Requested:</strong> {req.requestedChange}</p>
                    </div>
                    {req.status === "rejected" && req.approvedData && (
                      <p className="reject-reason">Reason: {req.approvedData}</p>
                    )}
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
