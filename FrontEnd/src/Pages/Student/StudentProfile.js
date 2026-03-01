import { useState, useEffect } from "react";
import StudentSidebar from "./StudentSidebar";
import { dialog } from "../../components/CustomDialog";
import "./StudentProfile.css";

export default function StudentProfile() {
  const [photo, setPhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [isProfileLocked, setIsProfileLocked] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // rejection metadata (if teacher sent feedback)
  const [status, setStatus] = useState(""); // pending|verified|rejected
  const [rejectNote, setRejectNote] = useState("");
  const [rejectSections, setRejectSections] = useState({});

  const [form, setForm] = useState(() => {
    // start with values from localStorage user if available
    const user = localStorage.getItem("user");
    let initial = {
      name: "",
      enroll: "",
      branch: "",
      year: "",
      dob: "",
      gender: "",
      phone: "",
      email: "",
      address: "",
      fatherName: "",
      motherName: "",
      parentPhone: "",
      sem1: "",
      sem2: "",
      sem3: "",
      sem4: "",
      sem5: "",
      sem6: "",
    };
    if (user) {
      try {
        const u = JSON.parse(user);
        if (u.name) initial.name = u.name;
        if (u.enroll) initial.enroll = u.enroll;
      } catch {} // ignore parse errors
    }
    return initial;
  });

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:8000/student/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log("Profile API:", data);

        if (res.ok && data.success) {
          setIsProfileLocked(data.isProfileLocked === true);
          setHasProfile(data.hasProfile === true);
          setStatus(data.status || "");
          setRejectNote(data.rejectNote || "");
          setRejectSections(data.rejectSections || {});

          // if backend returned basic info (name/enroll) use it as defaults
          if (!data.data) {
            setForm((prev) => ({
              ...prev,
              name: data.name || prev.name,
              enroll: data.enroll || prev.enroll,
            }));
          }

          if (data.data) {
            const profile = data.data;

            setForm({
              name: profile.name || data.name || "",
              enroll: profile.enroll || data.enroll || "",
              branch: profile.branch || "",
              year: profile.year || "",
              dob: profile.dob ? profile.dob.substring(0, 10) : "",
              gender: profile.gender || "",
              phone: profile.phone || "",
              email: profile.email || "",
              address: profile.address || "",
              fatherName: profile.fatherName || "",
              motherName: profile.motherName || "",
              parentPhone: profile.parentPhone || "",
              sem1: profile.sem1 || "",
              sem2: profile.sem2 || "",
              sem3: profile.sem3 || "",
              sem4: profile.sem4 || "",
              sem5: profile.sem5 || "",
              sem6: profile.sem6 || "",
            });

            if (profile.photo) {
              setPhoto(`http://localhost:8000/uploads/${profile.photo}`);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* ================= HANDLERS ================= */

  // determine if a given section may be edited by the student
  const canEditSection = (section) => {
    if (status === "rejected") {
      // only sections that were explicitly rejected
      return !!rejectSections[section];
    }
    return !isProfileLocked;
  };

  const handleChange = (e, section) => {
    if (!canEditSection(section)) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePhoto = (e) => {
    if (!canEditSection("basic")) return; // photo part of basic section
    const file = e.target.files[0];
    setPhotoFile(file);
    setPhoto(URL.createObjectURL(file));
  };

  // determine whether all required fields have some value
  const isFormValid = (() => {
    if (status === "rejected") {
      // only fields in editable sections must be filled
      const required = [];
      if (canEditSection("basic")) {
        required.push("name", "enroll", "branch", "year", "dob", "gender");
      }
      if (canEditSection("contact")) {
        required.push("phone", "email", "address");
      }
      if (canEditSection("guardian")) {
        required.push("fatherName", "motherName", "parentPhone");
      }
      if (canEditSection("academic")) {
        required.push("sem1", "sem2", "sem3", "sem4", "sem5", "sem6");
      }
      return required.every((f) => form[f] !== "" && form[f] !== null);
    }
    return Object.values(form).every((val) => val !== "" && val !== null);
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isProfileLocked) {
      dialog.warning("Profile Locked", "Profile is locked. Contact admin.");
      return;
    }

    if (!isFormValid) {
      dialog.error("Incomplete Form", "Please fill out every field before saving.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      const res = await fetch("http://localhost:8000/student/form", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        dialog.success("Success", "Profile Saved Successfully ✅");

        setHasProfile(true);
        // lock immediately regardless of backend flag (should be true)
        setIsProfileLocked(true);
        // after re-submitting clear any rejection state locally
        setStatus("pending");
        setRejectNote("");
        setRejectSections({});

        if (data.data) {
          const profile = data.data;

          setForm({
            name: profile.name || "",
            enroll: profile.enroll || "",
            branch: profile.branch || "",
            year: profile.year || "",
            dob: profile.dob ? profile.dob.substring(0, 10) : "",
            gender: profile.gender || "",
            phone: profile.phone || "",
            email: profile.email || "",
            address: profile.address || "",
            fatherName: profile.fatherName || "",
            motherName: profile.motherName || "",
            parentPhone: profile.parentPhone || "",
            sem1: profile.sem1 || "",
            sem2: profile.sem2 || "",
            sem3: profile.sem3 || "",
            sem4: profile.sem4 || "",
            sem5: profile.sem5 || "",
            sem6: profile.sem6 || "",
          });

          if (profile.photo) {
            setPhoto(`http://localhost:8000/uploads/${profile.photo}`);
          }
        }
      } else {
        dialog.error("Error", data.message);
      }
    } catch (err) {
      console.error(err);
      dialog.error("Server Error", "Unable to connect to server. Please try again.");
    }
  };
         
  if (isLoading) {
    return (
      <div className="student-page-wrapper">
        <StudentSidebar />
        <div className="student-layout">
          <div className="setalignment">
            <div className="profile-container">
              <div className="loading-spinner"></div>
              <p>Loading your profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="student-page-wrapper">
      <StudentSidebar />
      <div className="student-layout">
        <div className="setalignment">
          <div className="profile-container">
            <div className="profile-header">
              <h2>Student Profile</h2>
              <p className="subtitle">
                {isProfileLocked
                  ? "Your profile has been saved successfully"
                  : hasProfile
                  ? "View your profile details"
                  : "Complete your academic & personal details"}
              </p>
            </div>

            {status === "rejected" && (
              <div className="rejected-banner">
                <span className="lock-icon">⚠️</span>
                <div className="locked-text">
                  <strong>Changes Requested</strong>
                  <p>
                    Your teacher has asked you to update the following sections: <br />
                    {Object.entries(rejectSections)
                      .filter(([_, v]) => v)
                      .map(([k]) => k.charAt(0).toUpperCase() + k.slice(1))
                      .join(", ") || "(none specified)"}
                  </p>
                  {rejectNote && <p>Note: {rejectNote}</p>}
                </div>
              </div>
            )}
            {isProfileLocked && status !== "rejected" && (
              <div className="locked-banner">
                <span className="lock-icon">🔒</span>
                <div className="locked-text">
                  <strong>Profile Saved & Locked</strong>
                  <p>Your profile data has been securely saved and cannot be modified.</p>
                </div>
              </div>
            )}

            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="photo-section">
                <div className="photo-preview">
                  {photo ? (
                    <img src={photo} alt="Profile" />
                  ) : (
                    <div className="photo-placeholder">
                      <span>📷</span>
                      <p>Upload Photo</p>
                    </div>
                  )}
                </div>
                {canEditSection("basic") && (
                  <label className="file-upload-btn">
                    <input type="file" onChange={handlePhoto} accept="image/*" />
                    Choose Photo
                  </label>
                )}
              </div>

              <div className="section-card">
                <h3>Basic Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={(e) => handleChange(e, "basic")}
                      disabled={!canEditSection("basic")}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Enrollment Number</label>
                    <input
                      type="text"
                      name="enroll"
                      value={form.enroll}
                      onChange={(e) => handleChange(e, "basic")}
                      disabled={!canEditSection("basic")}
                      placeholder="Enter enrollment number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Branch</label>
                    <input
                      type="text"
                      name="branch"
                      value={form.branch}
                      onChange={(e) => handleChange(e, "basic")}
                      disabled={!canEditSection("basic")}
                      placeholder="Enter branch"
                    />
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <select
                      name="year"
                      value={form.year}
                      onChange={(e) => handleChange(e, "basic")}
                      disabled={!canEditSection("basic")}
                    >
                      <option value="">Select Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                    required
                      type="date"
                      name="dob"
                      value={form.dob}
                      onChange={(e) => handleChange(e, "basic")}
                      disabled={!canEditSection("basic")}
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select
                    required
                      name="gender"
                      value={form.gender}
                      onChange={(e) => handleChange(e, "basic")}
                      disabled={!canEditSection("basic")}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="section-card">
                <h3>Contact Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                    required
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={(e) => handleChange(e, "contact")}
                      disabled={!canEditSection("contact")}
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                    required
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={(e) => handleChange(e, "contact")}
                      disabled={!canEditSection("contact")}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Address</label>
                    <textarea
                    required
                      name="address"
                      value={form.address}
                      onChange={(e) => handleChange(e, "contact")}
                      disabled={!canEditSection("contact")}
                      placeholder="Enter your address"
                      rows="3"
                    />
                  </div>
                </div>
              </div>

              <div className="section-card">
                <h3>Guardian Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Father's Name</label>
                    <input
                    required
                      type="text"
                      name="fatherName"
                      value={form.fatherName}
                      onChange={(e) => handleChange(e, "guardian")}
                      disabled={!canEditSection("guardian")}
                      placeholder="Enter father's name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Mother's Name</label>
                    <input
                    required
                      type="text"
                      name="motherName"
                      value={form.motherName}
                      onChange={(e) => handleChange(e, "guardian")}
                      disabled={!canEditSection("guardian")}
                      placeholder="Enter mother's name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Parent's Contact</label>
                    <input
                    required
                      type="tel"
                      name="parentPhone"
                      value={form.parentPhone}
                      onChange={(e) => handleChange(e, "guardian")}
                      disabled={!canEditSection("guardian")}
                      placeholder="Enter parent's contact"
                    />
                  </div>
                </div>
              </div>

              <div className="section-card">
                <h3>Academic Performance (Semester Marks %)</h3>
                <div className="form-grid academic-grid">
                  {["sem1", "sem2", "sem3", "sem4", "sem5", "sem6"].map((sem, index) => (
                    <div className="form-group" key={sem}>
                      <label>Semester {index + 1}</label>
                      <input
                        type="number"
                        name={sem}
                        value={form[sem]}
                        onChange={(e) => handleChange(e, "academic")}
                        disabled={!canEditSection("academic")}
                        placeholder="%"
                        min="0"
                        max="100"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {!isProfileLocked && (
                <button type="submit" className="save-btn" disabled={!isFormValid}>
                  Save Profile
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
