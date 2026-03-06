import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dialog } from "../../components/CustomDialog";
import "../Teacher/TeacherDashboard.css";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem("name") || "Teacher";

  const [stats, setStats] = useState({
    totalStudents: 0,
    verifiedStudents: 0,
    pendingStudents: 0,
    contacted: 0,
  });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const verifiedPercent =
    stats.totalStudents > 0
      ? Math.round((stats.verifiedStudents / stats.totalStudents) * 100)
      : 0;
  const pendingPercent = 100 - verifiedPercent;
  const circleRadius = 48;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const verifiedArc = (verifiedPercent / 100) * circleCircumference;
  const pendingArc = circleCircumference - verifiedArc;

  /* ================= NAVIGATION ================= */
  const handleCardClick = (type) => {
    switch (type) {
      case "student":
        navigate("/teacher/addstudent");
        break;
      case "verified":
        navigate("/teacher/verifiedstudents");
        break;
      case "pending":
        navigate("/teacher/pending");
        break;
      case "comments":
      case "contacts":
        navigate("/teacher/contacts");
        break;
      default:
        break;
    }
  };

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    if (!token) {
      navigate("/teacher/login");
    }
  }, [token, navigate]);

  /* ================= FETCH STATS ================= */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:8000/student/getst", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (res.ok) {
          const students = await res.json();
          
          const verified = students.filter(s => s.verify === true).length;
          const pending = students.filter(s => s.verify === false).length;
          
          setStats((prev) => ({
            ...prev,
            totalStudents: students.length,
            verifiedStudents: verified,
            pendingStudents: pending,
          }));
        }

        // fetch contact count separately
        try {
          const contactRes = await fetch("http://localhost:8000/contact/count", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const contactData = await contactRes.json();
          if (contactRes.ok) {
            setStats((prev) => ({ ...prev, contacted: contactData.count || 0 }));
          }
        } catch (err) {
          console.error("contact count error", err);
        }
      } catch (err) {
        console.error(err);
        dialog.error("Error", "Failed to fetch statistics");
      } finally {
        setLoading(false);
      }
    };
    
    if (token) {
      fetchStats();
    }
  }, [token]);

  /* ================= GET CURRENT DATE ================= */
  const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  /* ================= STATS DATA ================= */
  const statsData = [
    { 
      label: "Total Students", 
      number: stats.totalStudents, 
      icon: "👨‍🎓",
      type: "primary",
      onClick: () => handleCardClick("student")
    },
    { 
      label: "Verified Students", 
      number: stats.verifiedStudents, 
      icon: "✅",
      type: "success",
      onClick: () => handleCardClick("verified")
    },
    { 
      label: "Pending Students", 
      number: stats.pendingStudents, 
      icon: "⏳",
      type: "warning",
      onClick: () => handleCardClick("pending")
    },
    { 
      label: "Contacted", 
      number: stats.contacted, 
      icon: "📩",
      type: "info",
      onClick: () => handleCardClick("contacts")
    },
  ];

  /* ================= QUICK ACTIONS ================= */
  const quickActions = [
    {
      icon: "➕",
      title: "Add New Student",
      description: "Register a new student in the system",
      onClick: () => navigate("/teacher/addstudent")
    },
    {
      icon: "✅",
      title: "Verify Students",
      description: "Review and verify student applications",
      onClick: () => navigate("/teacher/verifiedstudents")
    },
    {
      icon: "⏳",
      title: "Pending Requests",
      description: "View pending student requests",
      onClick: () => navigate("/teacher/requests")
    }
  ];

  return (
    <div className="teacher-dashboard-container">
      {/* Header Section */}
      <div className="teacher-dashboard-header">
        <div className="teacher-header-content">
          <h1 className="teacher-dashboard-title">Welcome back, {name}! 👋</h1>
          <p className="teacher-header-subtitle">Here's what's happening with your students today.</p>
          <p className="teacher-header-date">{getCurrentDate()}</p>
        </div>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="teacher-loading-state">
          <div className="teacher-loading-spinner"></div>
        </div>
      ) : (
        <>
          <div className="teacher-stats-grid">
            {statsData.map((stat, idx) => (
              <div 
                key={idx} 
                className={`teacher-stat-card-modern teacher-${stat.type}`}
                onClick={stat.onClick}
              >
                <div className="teacher-stat-icon-wrapper">
                  {stat.icon}
                </div>
                <h3 className="teacher-stat-number">{stat.number}</h3>
                <p className="teacher-stat-label">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* verification overview chart */}
          <div className="teacher-stats-chart">
            <h2 className="teacher-section-heading">Verification Overview</h2>
            <div className="teacher-chart-layout">
              <div className="teacher-donut-chart-wrap">
                <svg
                  className="teacher-donut-chart"
                  width="130"
                  height="130"
                  viewBox="0 0 120 120"
                  role="img"
                  aria-label="Students verification distribution"
                >
                  <circle
                    cx="60"
                    cy="60"
                    r={circleRadius}
                    className="teacher-donut-track"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r={circleRadius}
                    className="teacher-donut-segment teacher-pending"
                    strokeDasharray={`${pendingArc} ${circleCircumference}`}
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r={circleRadius}
                    className="teacher-donut-segment teacher-verified"
                    strokeDasharray={`${verifiedArc} ${circleCircumference}`}
                    strokeDashoffset={-pendingArc}
                  />
                </svg>
                <div className="teacher-donut-center">
                  <span className="teacher-donut-value">{verifiedPercent}%</span>
                  <span className="teacher-donut-label">Verified</span>
                </div>
              </div>
              <div className="teacher-chart-breakdown">
                <div className="teacher-breakdown-item">
                  <span className="teacher-legend-color teacher-verified" />
                  <div>
                    <strong>{stats.verifiedStudents}</strong>
                    <p>Verified ({verifiedPercent}%)</p>
                  </div>
                </div>
                <div className="teacher-breakdown-item">
                  <span className="teacher-legend-color teacher-pending" />
                  <div>
                    <strong>{stats.pendingStudents}</strong>
                    <p>Pending ({pendingPercent}%)</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="teacher-chart-legend">
              <div className="teacher-chart-stat teacher-total">
                <span className="teacher-legend-color teacher-total" />
                <div>
                  <strong>{stats.totalStudents}</strong>
                  <p>Total Students</p>
                </div>
              </div>
              <div className="teacher-chart-stat teacher-verified">
                <span className="teacher-legend-color teacher-verified" />
                <div>
                  <strong>{stats.verifiedStudents}</strong>
                  <p>Verified</p>
                </div>
              </div>
              <div className="teacher-chart-stat teacher-pending">
                <span className="teacher-legend-color teacher-pending" />
                <div>
                  <strong>{stats.pendingStudents}</strong>
                  <p>Pending</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="teacher-quick-actions">
            <h2 className="teacher-section-heading">Quick Actions</h2>
            <div className="teacher-actions-grid">
              {quickActions.map((action, idx) => (
                <div 
                  key={idx} 
                  className="teacher-action-card"
                  onClick={action.onClick}
                >
                  <div className="teacher-action-icon-box">
                    {action.icon}
                  </div>
                  <div className="teacher-action-details">
                    <h4>{action.title}</h4>
                    <p>{action.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
