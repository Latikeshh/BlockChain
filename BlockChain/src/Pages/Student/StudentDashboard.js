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
      default:
        break;
    }
  };

  return (
    <div className="student-layout">
      <StudentSidebar />

      <div className="student-content">
        <h2>Welcome to Student Dashboard 🎓</h2>

        <div className="cards">

          <div
            className="card"
            onClick={() => handleClick("profile")}
            style={{ cursor: "pointer" }}
          >
            <h3>Profile</h3>
            <p>View your details</p>
          </div>

          <div
            className="card"
            onClick={() => handleClick("status")}
            style={{ cursor: "pointer" }}
          >
            <h3>Status</h3>
            <p>Check verification status</p>
          </div>

        </div>
      </div>
    </div>
  );
}
