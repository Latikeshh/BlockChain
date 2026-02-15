import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";
import "../Teacher/TeacherDashboard.css"

export default function TeacherDashboard() {
  const navigate = useNavigate();

  const [studentCount, setStudentCount] = useState(0);
  const [name, setName] = useState("");
  const [enroll, setEnroll] = useState("");
  const [password, setPassword] = useState("");

  const token = localStorage.getItem("token");

  /* ================= NAVIGATION ================= */
  const handleCardClick = (type) => {
    switch (type) {
      case "student":
        navigate("/teacher/addstudent");
        break;
      case "teacher":
        navigate("/teacher/verifiedstudents");
        break;
      case "pending":
        navigate("/teacher/pending");
        break;
      case "comments":
        navigate("/teacher/comments");
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

  /* ================= GET STUDENT COUNT ================= */
  useEffect(() => {
    const fetchStudentCount = async () => {
      try {
        const res = await fetch("http://localhost:8000/student/count", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setStudentCount(data.count);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudentCount();
  }, [token]);

  /* ================= CARD DATA ================= */
  const cardData = [
    { title: "Total Students", text: studentCount, bg: "primary", type: "student" },
    { title: "Verified Students", text: "8", bg: "success", type: "teacher" },
    { title: "Pending", text: "54", bg: "info", type: "pending" },
    { title: "Contacted", text: "230", bg: "danger", type: "comments" },
  ];

  return (
    <Container fluid className="dashboard-container">
      <h2 className="dashboard-title">Teacher Dashboard</h2>
      <Row>
        {cardData.map((card, idx) => (
          <Col md={4} lg={3} key={idx} className="mb-4">
            <Card
              className={`dashboard-card bg-${card.bg}`}
              onClick={() => handleCardClick(card.type)}>
              <Card.Body>
                <h5 className="card-title">{card.title}</h5>
                <h2 className="card-value">{card.text}</h2>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
