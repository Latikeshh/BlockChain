import { useState } from "react";
import StudentSidebar from "./StudentSidebar";
import "./StudentProfile.css";

export default function StudentProfile() {
  const [photo, setPhoto] = useState(null);
const [photoFile, setPhotoFile] = useState(null);
  const [form, setForm] = useState({
    /* BASIC INFO */
    name: "",
    enroll: "",
    branch: "",
    year: "",
    dob: "",
    gender: "",

    /* CONTACT */
    phone: "",
    email: "",
    address: "",

    /* GUARDIAN INFO */
    fatherName: "",
    motherName: "",
    parentPhone: "",

    /* ACADEMIC */
    sem1: "",
    sem2: "",
    sem3: "",
    sem4: "",
    sem5: "",
    sem6: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoto = (e) => {
  const file = e.target.files[0];
  setPhotoFile(file);
  setPhoto(URL.createObjectURL(file));
};

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    const formData = new FormData();

    // append all fields
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    // append image file
    if (photoFile) {
      formData.append("photo", photoFile);
    }

    const res = await fetch("http://localhost:8000/student/save", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (res.ok) {
      alert("Profile Saved Successfully");
    } else {
      alert(data.message);
    }
  } catch (err) {
    console.error(err);
    alert(err.message ,"Server error");
  }
};

  return (
    <div className="student-layout">
      <StudentSidebar />

      <div className="setalignment">
        <div className="profile-container">
          <h2>Student Profile</h2>
          <p className="subtitle">Complete your academic & personal details</p>

          <form className="profile-form" onSubmit={handleSubmit}>
            
            {/* PHOTO */}
            <div className="photo-section">
              <div className="photo-preview">
                {photo ? <img src={photo} alt="profile" /> : <span>Upload Photo</span>}
              </div>
              <input type="file" onChange={handlePhoto} />
            </div>

            {/* ================= BASIC INFO ================= */}
            <div className="section-card">
              <h3>Basic Information</h3>

              <div className="grid-3">
                <div className="form-group">
                  <label>Full Name</label>
                  <input name="name" value={form.name} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Enrollment Number</label>
                  <input name="enroll" value={form.enroll} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label>Branch</label>
                  <input name="branch" value={form.branch} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Year</label>
                  <select name="year" value={form.year} onChange={handleChange}>
                    <option value="">Select</option>
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Date of Birth</label>
                  <input type="date" name="dob" value={form.dob} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Gender</label>
                  <select name="gender" value={form.gender} onChange={handleChange}>
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ================= CONTACT INFO ================= */}
            <div className="section-card">
              <h3>Contact Information</h3>

              <div className="grid-3">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input name="phone" value={form.phone} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input name="email" value={form.email} onChange={handleChange} />
                </div>

                <div className="form-group full">
                  <label>Address</label>
                  <textarea name="address" value={form.address} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* ================= GUARDIAN INFO ================= */}
            <div className="section-card">
              <h3>Guardian Details</h3>

              <div className="grid-3">
                <div className="form-group">
                  <label>Father Name</label>
                  <input name="fatherName" value={form.fatherName} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Mother Name</label>
                  <input name="motherName" value={form.motherName} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label>Parent Contact</label>
                  <input name="parentPhone" value={form.parentPhone} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* ================= ACADEMIC INFO ================= */}
            <div className="section-card">
              <h3>Academic Performance (Semester Marks %)</h3>

              <div className="grid-3">
                {["sem1","sem2","sem3","sem4","sem5","sem6"].map((sem, i) => (
                  <div className="form-group" key={sem}>
                    <label>Semester {i + 1}</label>
                    <input
                      name={sem}
                      value={form[sem]}
                      onChange={handleChange}
                    />
                  </div>
                ))}
              </div>
            </div>

            <button className="save-btn">Save Profile</button>
          </form>
        </div>
      </div>
    </div>
  );
}
