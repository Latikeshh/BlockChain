import "../Pages/About.css";
import aboutImg from "../Images/ssvps1.jpg"

const About = () => {
  return (
    <div className="about-page">
      {/* HERO */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About Our Institution</h1>
          <p>
            Empowering students with secure, transparent and future‑ready
            academic systems.
          </p>
        </div>
      </section>

      {/* ABOUT CONTENT */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-text">
            <h2>Who We Are</h2>
            <p>
              Shri Shivaji Vidya Prasarak Sanstha’s Bapusaheb Shivajirao Deore
              Polytechnic is committed to excellence in technical education.
              We focus on innovation, integrity and industry‑ready skills.
            </p>

            <h2>Our Vision</h2>
            <p>
              To become a leading institution providing quality technical
              education with modern technologies like Blockchain, AI and
              Cyber Security.
            </p>

            <h2>Our Mission</h2>
            <ul>
              <li>✔ Provide quality technical education</li>
              <li>✔ Promote ethical and professional values</li>
              <li>✔ Encourage innovation and research</li>
              <li>✔ Prepare students for industry & higher studies</li>
            </ul>
          </div>

          <div className="about-image">
            <img src={aboutImg} alt="About College" />
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="about-highlights">
        <div className="highlight-card">
          <h3>🎓 Quality Education</h3>
          <p>Experienced faculty and industry-oriented curriculum.</p>
        </div>

        <div className="highlight-card">
          <h3>🔐 Secure Records</h3>
          <p>Blockchain-based student record verification system.</p>
        </div>

        <div className="highlight-card">
          <h3>🚀 Career Focus</h3>
          <p>Skill development, internships and placement support.</p>
        </div>
      </section>
    </div>
  );
};

export default About;
