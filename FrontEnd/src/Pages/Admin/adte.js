// import { useState } from "react";
// -import { dialog } from "../../components/CustomDialog";
// -import "./AddTeacher.css";
// -
// -export default function AddTeacher() {
// -  const [formData, setFormData] = useState({
// -    name: "",
// -    email: "",
// -    password: ""
// -  });
// -  const [loading, setLoading] = useState(false);
// -
// -  const handleChange = (e) => {
// -    setFormData({ ...formData, [e.target.name]: e.target.value });
// -  };
// -
// -  const handleSubmit = async (e) => {
// -    e.preventDefault();
// -    
// -    if (!formData.name || !formData.email || !formData.password) {
// -      dialog.error("Missing Fields", "Please fill in required fields");
// -      return;
// -    }
// -
// -    setLoading(true);
// -    try {
// -      const res = await fetch("http://localhost:8000/teacher/signup", {
// -        method: "POST",
// -        headers: { "Content-Type": "application/json" },
// -        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password })
// -      });
// -      const data = await res.json();
// -      if (res.ok) {
// -        dialog.success("Added", "Teacher added successfully!");
// -        setFormData({
// -          name: "",
// -          email: "",
// -          password: ""
// -        });
// -      } else {
// -        dialog.error("Error", data.message || "Error adding teacher");
// -      }
// -    } catch (err) {
// -      dialog.error("Error", "Unable to connect to server. Please try again.");
// -    } finally {
// -      setLoading(false);
// -    }
// -  };
// -
// -  return (
// -    <div className="form-page-container">
// -      {/* Header */}
// -      <div className="dashboard-header">
// -        <div className="header-content">
// -          <h1 className="dashboard-title">Add New Teacher</h1>
// -          <p className="header-subtitle">Create a new teacher account with access to the system</p>
// -        </div>
// -      </div>
// -
// -      <div className="form-content">
// -        <div className="form-card">
// -          <div className="form-card-body">
// -            <form onSubmit={handleSubmit}>
// -              <div className="form-row">
// -                <div className="form-group">
// -                  <label className="form-label-custom">Name *</label>
// -                  <input
// -                    type="text"
// -                    name="name"
// -                    value={formData.name}
// -                    onChange={handleChange}
// -                    placeholder="Enter teacher name"
// -                    className="form-control-custom"
// -                    required
// -                  />
// -                </div>
// -                <div className="form-group">
// -                  <label className="form-label-custom">Email *</label>
// -                  <input
// -                    type="email"
// -                    name="email"
// -                    value={formData.email}
// -                    onChange={handleChange}
// -                    placeholder="Enter email address"
// -                    className="form-control-custom"
// -                    required
// -                  />
// -                </div>
// -              </div>
// -              <div className="form-row">
// -                <div className="form-group">
// -                  <label className="form-label-custom">Password *</label>
// -                  <input
// -                    type="password"
// -                    name="password"
// -                    value={formData.password}
// -                    onChange={handleChange}
// -                    placeholder="Enter password"
// -                    className="form-control-custom"
// -                    required
// -                  />
// -                </div>
// -              </div>
// -              <button type="submit" className="submit-btn" disabled={loading}>
// -                {loading ? "Adding..." : "➕ Add Teacher"}
// -              </button>
// -            </form>
// -          </div>
// -        </div>
// -
// -        <div className="info-card">
// -          <div className="info-card-body">
// -            <h5 className="info-title">📋 Instructions</h5>
// -            <p className="info-text">
// -              Fill in the teacher details to create a new teacher account.
// -            </p>
// -            <ul className="info-list">
// -              <li className="info-list-item"><strong>Name & Email</strong> are required</li>
// -              <li className="info-list-item"><strong>Password</strong> for teacher login</li>
// -              <li className="info-list-item">Teacher can access student records after login</li>
// -            </ul>
// -          </div>
// -        </div>
// -      </div>
// -    </div>
// -  );
// -}
