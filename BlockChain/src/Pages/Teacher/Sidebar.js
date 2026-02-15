import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Siderbar.css';   // <-- import css

function Sidebar() {
  return (
    <div className="sidebar">
      <h4 className="mb-4"> </h4>
      <Nav defaultActiveKey="teacher/dashboard" className="flex-column">
        <Nav.Link as={Link} to="teacher/dashboard">Dashboard</Nav.Link>
        <Nav.Link as={Link} to="/teacher/verifiedstudents">Verified</Nav.Link>
        <Nav.Link as={Link} to="/student">Students</Nav.Link>
        <Nav.Link as={Link} to="/Pending">Pending Student</Nav.Link>
        <Nav.Link as={Link} to="/comments">Comments</Nav.Link>
      </Nav>
    </div>
  );
}

export default Sidebar;
