import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [teacherCount, setTeacherCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [verifiedCount, setVerifiedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name") || "Admin";

  /* ================= NAVIGATION ================= */
  const handleCardClick = (path) => {
    navigate(path);
  };

  /* ================= AUTH GUARD ================= */
  useEffect(() => {
    if (!token || role !== "admin") {
      navigate("/teacher/login");
    }
  }, [token, role, navigate]);

  /* ================= GET CURRENT DATE ================= */
  const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  /* ================= FETCH COUNTS ================= */
  useEffect(() => {
    const fetchCounts = async () => {
      
      try {
        // Fetch all students and calculate counts in frontend (same as TeacherDashboard)
        const studentRes = await fetch("http://localhost:8000/student/getst", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (studentRes.ok) {
          const students = await studentRes.json();
          const verified = students.filter(s => s.verify === true).length;
          const pending = students.filter(s => s.verify === false).length;
          
          setStudentCount(students.length || 0);
          setVerifiedCount(verified);
          setPendingCount(pending);
        }

        // Fetch teacher count
        const teacherRes = await fetch("http://localhost:8000/teacher/teachers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const teacherData = await teacherRes.json();
        if (teacherRes.ok) {
          setTeacherCount(teacherData.length || 0);
        }

        // contact count (same as TeacherDashboard)
        try {
          const contactRes = await fetch("http://localhost:8000/contact/count", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const contactData = await contactRes.json();
          if (contactRes.ok) {
            setContactCount(contactData.count || 0);
          }
        } catch (err) {
          console.error(err);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCounts();
  }, [token]);

  /* ================= STATS DATA ================= */
  const statsData = [
    { 
      label: "Total Teachers", 
      number: teacherCount, 
      icon: "👨‍🏫",
      type: "primary",
      onClick: () => handleCardClick("/admin/teachers")
    },
    { 
      label: "Total Students", 
      number: studentCount, 
      icon: "👨‍🎓",
      type: "success",
      onClick: () => handleCardClick("/teacher/verifiedstudents")
    },
    { 
      label: "Verified Students", 
      number: verifiedCount, 
      icon: "✅",
      type: "info",
      onClick: () => handleCardClick("/teacher/verifiedstudents")
    },
    { 
      label: "Pending Requests", 
      number: pendingCount, 
      icon: "⏳",
      type: "warning",
      onClick: () => handleCardClick("/teacher/pending")
    },
    {
      label: "Contacts",
      number: contactCount,
      icon: "📩",
      type: "success",
      onClick: () => handleCardClick("/admin/contacts")
    },
  ];

  /* ================= QUICK ACTIONS ================= */
  const quickActions = [
    {
      icon: "➕",
      title: "Add New Teacher",
      description: "Create teacher accounts and manage access",
      onClick: () => navigate("/admin/addteacher")
    },
    {
      icon: "👥",
      title: "Manage Teachers",
      description: "View, edit or remove teacher accounts",
      onClick: () => navigate("/admin/teachers")
    },
    {
      icon: "⚙️",
      title: "System Settings",
      description: "Configure system preferences",
      onClick: () => navigate("/admin/settings")
    },
    {
      icon: "📝",
      title: "Add Student",
      description: "Add new student records",
      onClick: () => navigate("/teacher/addstudent")
    },
    {
      icon: "📋",
      title: "Verified Students",
      description: "View verified student records",
      onClick: () => navigate("/teacher/verifiedstudents")
    },
    {
      icon: "📥",
      title: "Pending Students",
      description: "Review pending student requests",
      onClick: () => navigate("/teacher/pending")
    },
  ];

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Welcome back, {name}! 👋</h1>
          <p className="header-subtitle">Here's what's happening with your records today.</p>
          <p className="header-date">{getCurrentDate()}</p>
        </div>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            {statsData.map((stat, idx) => (
              <div 
                key={idx} 
                className={`stat-card-modern ${stat.type}`}
                onClick={stat.onClick}
              >
                <div className="stat-icon-wrapper">
                  {stat.icon}
                </div>
                <h3 className="stat-number">{stat.number}</h3>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h2 className="section-heading">Quick Actions</h2>
            <div className="actions-grid">
              {quickActions.map((action, idx) => (
                <div 
                  key={idx} 
                  className="action-card"
                  onClick={action.onClick}
                >
                  <div className="action-icon-box">
                    {action.icon}
                  </div>
                  <div className="action-details">
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
