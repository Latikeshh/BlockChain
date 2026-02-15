import "./StudentForm.css";

export default function StudentForm() {
  return (
    <div className="student-page">
      {/* LEFT SECTION */}
      <div className="student-left">
        <h2>Personal Details</h2>

        <div className="photo-row">
          <label>Photo</label>
          <div className="photo-box">Upload</div>
        </div>

        <div className="form-grid">
          <div>
            <label>Name</label>
            <input type="text" placeholder="Student Name" />
          </div>

          <div>
            <label>Age</label>
            <input type="number" placeholder="Age" />
          </div>

          <div>
            <label>Date of Birth</label>
            <input type="date" />
          </div>

          <div>
            <label>Gender</label>
            <select>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <h3>Contact Details</h3>

        <div className="form-grid">
          <div>
            <label>Mobile Number</label>
            <input type="text" placeholder="+91 XXXXXXXX" />
          </div>

          <div>
            <label>Email Address</label>
            <input type="email" placeholder="email@example.com" />
          </div>

          <div>
            <label>Nationality</label>
            <input type="text" placeholder="Indian" />
          </div>

          <div>
            <label>City</label>
            <input type="text" placeholder="City" />
          </div>

          <div className="full">
            <label>Permanent Address</label>
            <input type="text" placeholder="Full Address" />
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
     
    </div>
  );
}
