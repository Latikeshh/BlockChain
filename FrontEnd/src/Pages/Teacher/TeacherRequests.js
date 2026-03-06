import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TeacherSidebar from "./TeacherSidebar";
import "./TeacherRequests.css";
import { dialog } from "../../components/CustomDialog";

export default function TeacherRequests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/teacher/login");
      return;
    }
    fetch("http://localhost:8000/student/request/all", {
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
  }, [token]);

  const changeStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:8000/student/request/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setRequests((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: data.data.status } : r))
        );
      } else {
        dialog.error("Error", data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      dialog.error("Error", "Server error");
    }
  };

  return (
    <div className="teacher-req-layout">
      <TeacherSidebar/>
      <div className="teacher-req-content">
        <div className="teacher-req-container">
          <h2>Student Change Requests</h2>
          {loading ? (
            <p>Loading...</p>
          ) : requests.length === 0 ? (
            <p>No requests found.</p>
          ) : (
            <ul className="req-list">
              {requests.map((req) => (
                <li key={req._id} className={`req-item ${req.status}`}>
                  <div className="req-main">
                    <span className="student-info">
                      {req.studentId?.name} ({req.studentId?.enroll})
                    </span>
                    <span className="category">{req.category}</span>
                    <span className="details">{req.details}</span>
                  </div>
                  <div className="req-actions">
                    {req.status === "pending" && (
                      <>
                        <button
                          className="approve-btn"
                          onClick={() => changeStatus(req._id, "approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => changeStatus(req._id, "rejected")}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <span className={`status-tag ${req.status}`}>{req.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
