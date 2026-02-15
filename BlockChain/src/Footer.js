import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        {/* CONTACT */}
        <div className="footer-col">
          <h3>Contact Us</h3>
          <p>
            📍 Vidyanagri, Deopur, Dhule,<br />
            Maharashtra 424005, India.
          </p>
          <p>📞 (02562) 272713</p>
          <p>📞 272229</p>
          <p>📞 272976</p>
          <p>✉️ princi.ssvpspoly@gmail.com</p>
        </div>

        {/* USEFUL LINKS 1 */}
        <div className="footer-col">
          <h3>Useful Links</h3>
          <ul>
            <li>About College</li>
            <li>Courses Offered</li>
            <li>Eligibility Criteria</li>
            <li>Documents Required</li>
            <li>Fee Structure</li>
          </ul>
        </div>

        {/* USEFUL LINKS 2 */}
        <div className="footer-col">
          <h3>Useful Links</h3>
          <ul>
            <li>MSBTE</li>
            <li>DTE</li>
            <li>AICTE</li>
            <li>Scholarships</li>
            <li>Contact Us</li>
          </ul>
        </div>

        {/* SOCIAL */}
        <div className="footer-col">
          <h3>Find Us on Social</h3>
          <div className="social-icons">
            <span>f</span>
            <span>▶</span>
            <span>📷</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        © 2026 Bapusaheb Shivajirao Deore Polytechnic
      </div>
    </footer>
  );
};

export default Footer;
