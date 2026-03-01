import { useState } from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { dialog } from "../../components/CustomDialog";
import "./AddTeacher.css";

export default function AddTeacher() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      dialog.error("Missing Fields", "Please fill in required fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/teacher/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password })
      });
      const data = await res.json();
      if (res.ok) {
        dialog.success("Added", "Teacher added successfully!");
        setFormData({
          name: "",
          email: "",
          password: ""
        });
      } else {
        dialog.error("Error", data.message || "Error adding teacher");
      }
    } catch (err) {
      dialog.error("Error", "Unable to connect to server. Please try again.");
    }
  };

  return (
    <div className="add-teacher-container">
      {/* Header */}
      <div className="header-section">
        <h2 className="header-title">Add New Teacher</h2>
        <p className="header-subtitle">Create a new teacher account with access to the system</p>
      </div>

      <Row>
        <Col lg={8}>
          <Card className="form-card">
            <Card.Body className="form-card-body">
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter teacher name"
                        className="form-control-custom"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        className="form-control-custom"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label-custom">Password *</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        className="form-control-custom"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button type="submit" className="submit-btn">
                  ➕ Add Teacher
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="info-card">
            <Card.Body className="info-card-body">
              <h5 className="info-title">📋 Instructions</h5>
              <p className="info-text">
                Fill in the teacher details to create a new teacher account.
              </p>
              <ul className="info-list">
                <li className="info-list-item"><strong>Name & Email</strong> are required</li>
                <li className="info-list-item"><strong>Password</strong> for teacher login</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
