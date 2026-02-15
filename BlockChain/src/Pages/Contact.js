import "./Contact.css";

const Contact = () => {
  return (
    <>
      {/* CONTACT PAGE */}
      <div className="contact-page">
        {/* HEADER */}
        <header className="contact-header">
          <h2>Contact Us</h2>
          <p>Any question or remark? Kindly message us.</p>
        </header>

        {/* MAIN CARD */}
        <div className="contact-card">
          {/* LEFT SIDE */}
          <div className="contact-left">
            <h3>Contact Information</h3>
            <p>Say something to start a chat.</p>

            <div className="info">
              <p>📞 (02562) 272713
272229
272976</p>
              <p>✉️ princi.ssvpspoly@gmail.com</p>
              <p>📍 Vidyanagri, Deopur, Dhule, Maharashtra 424005, India.</p>
            </div>

            <div className="socials">
              <span>f</span>
              <span>▶</span>
              <span>📷</span>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="contact-right">
            <form>
              <div className="row">
                <div>
                  <label>First Name</label>
                  <input type="text" />
                </div>
                <div>
                  <label>Last Name</label>
                  <input type="text" />
                </div>
              </div>

              <div className="row">
                <div>
                  <label>Email</label>
                  <input type="email" />
                </div>
                <div>
                  <label>Phone Number</label>
                  <input type="text" />
                </div>
              </div>

              <label className="purpose">Purpose?</label>
              <div className="radio-group">
                <label><input type="radio" name="purpose" /> General Inquiry</label>
                <label><input type="radio" name="purpose" /> Admission</label>
                <label><input type="radio" name="purpose" /> Support</label>
              </div>

              <label>Message</label>
              <textarea placeholder="Write your message"></textarea>

              <button type="submit">Send Message</button>
            </form>
          </div>
        </div>
      </div>

     
    </>
  );
};

export default Contact;
