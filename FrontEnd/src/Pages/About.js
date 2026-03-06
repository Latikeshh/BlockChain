import "./About.css";
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
              Shri Shivaji Vidya Prasarak Sanstha's Bapusaheb Shivajirao Deore
              Polytechnic is committed to excellence in technical education.
              We focus on innovation, integrity and industry‑ready skills.
            </p>

            <h2>Our Vision</h2>
            <p>
            To be recognized as a model department for imparting knowledge-based education in accord with the needs of the society.
            </p>

            <h2>Our Mission</h2>
            <ul>
              <li>To create an ambience for academic excellence.</li>
              <li>To empower students with practical tools and ideas for any domain.</li>
              <li>To inculcate professional behavior, ethical values, and leadership qualities.</li>
            </ul>
          </div>

          <div className="about-image">
            <img src={aboutImg} alt="About College" />
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="about-stats">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-labell">Students Enrolled</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-labelll">Expert Faculty</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">15+</span>
            <span className="stat-labell">Technical Programs</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-labell">Secure Records</span>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="about-highlights">
        <div className="highlight-card">
          <span className="highlight-icon">🎓</span>
          <h3>Quality Education</h3>
          <p>Experienced faculty and industry-oriented curriculum designed for practical skills.</p>
        </div>

        <div className="highlight-card">
          <span className="highlight-icon">🔐</span>
          <h3>Secure Records</h3>
          <p>Blockchain-based student record verification system ensuring data integrity.</p>
        </div>

        <div className="highlight-card">
          <span className="highlight-icon">🚀</span>
          <h3>Career Focus</h3>
          <p>Skill development, internships and comprehensive placement support.</p>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="about-cta">
        <h2>Ready to Get Started?</h2>
        <p>Join us to experience modern education with cutting-edge technology.</p>
        <a href="/contact" className="cta-button">Contact Us </a>
      </section>
    </div>
  );
};

export default About;
