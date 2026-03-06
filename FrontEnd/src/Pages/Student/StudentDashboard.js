import { useNavigate } from "react-router-dom";
import StudentSidebar from "./StudentSidebar";
import "./StudentDashboard.css";

export default function StudentDashboard() {
  const navigate = useNavigate();

  const handleClick = (type) => {
    switch (type) {
      case "profile":
        navigate("/student/profile");
        break;
      case "status":
        navigate("/student/status");
        break;
      case "request":
        navigate("/student/request");
        break;
      default:
        break;
    }
  };

  return (
    <div className="student-page-wrapper">
      <StudentSidebar />
      <div className="student-layout">
        <div className="student-content">
          <div className="student-dashboard-header">
            <div className="student-header-content">
              <h1 className="student-dashboard-title">
                Welcome to Student Dashboard 🎓
              </h1>

              <p className="student-header-subtitle">
                Manage your profile and check your verification status
              </p>

              <p className="student-header-date">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </p>
            </div>
          </div>

          <div className="cards">
            <div
              className="card profile-card"
              onClick={() => handleClick("profile")}
            >
              <span className="card-icon">👤</span>
              <h3>My Profile</h3>
              <p>View and manage your details</p>
              <button className="action-btn">View Profile →</button>
            </div>

            <div
              className="card status-card"
              onClick={() => handleClick("status")}
            >
              <span className="card-icon">📋</span>
              <h3>Verification Status</h3>
              <p>Check your document status</p>
              <button className="action-btn">Check Status →</button>
            </div>

            <div
              className="card request-card"
              onClick={() => handleClick("request")}
            >
              <span className="card-icon">📝</span>
              <h3>Change Request</h3>
              <p>Ask for updates to your record</p>
              <button className="action-btn">Send Request →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
