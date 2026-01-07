import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ScrollSpy from "bootstrap/js/dist/scrollspy";
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react';

function About() {
  useEffect(() => {
    const spy = new ScrollSpy(document.body, {
      target: "#top-navigation",
      offset: 140,
    });
    spy.refresh();
  }, []);

  const styles = `
    :root {
      --color-primary: #ffffff;
      --color-secondary: #0d9db8;
      --color-third: #3b82f6;
      --color-fourth: #d1f4f9;
      --color-dark: #1a1a1a;
    }

    [data-theme="dark"] {
      --color-primary: #121212;
      --color-secondary: #0d9db8;
      --color-third: #60a5fa;
      --color-fourth: #1f2937;
      --color-dark: #e5e7eb;
    }

    .allContainer {
      min-height: 100vh;
      transition: background-color 0.3s ease;
      margin: 0;
      padding: 0;
      padding-top: 80px;
    }

    [data-theme="dark"] .allContainer {
      padding-top: 80px;
    }

    .about-container {
      margin-top: 0px;
      padding: 20px 20px;
      max-width: 1200px;
    }

    .about-container h2 {
      font-weight: 600 !important;
      color: var(--color-secondary) !important;
      margin-bottom: 30px;
      margin-top: 20px;
      font-family: "Merriweather", serif;
      font-size: 2.5rem;
      text-align: center;
    }

    .team-members-wrapper {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }

    .team-member-card {
      background: var(--color-primary);
      border-radius: 15px;
      padding: 40px;
      border: 1px solid rgba(13, 157, 184, 0.1);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      gap: 25px;
    }

    [data-theme="dark"] .team-member-card {
      background: var(--color-fourth);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(13, 157, 184, 0.2);
    }

    .profile-image-wrapper {
      position: relative;
      width: 220px;
      height: 220px;
      margin: 0 auto;
    }

    .profile-image-wrapper img:hover {
      transform: scale(1.05);
    }

    .profile-image-circle {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      object-fit: cover;
      border: 8px solid var(--color-primary);
      box-shadow: 0 15px 30px rgba(13, 157, 184, 0.25),
        inset 0 0 15px rgba(255, 255, 255, 0.1);
      transition: all 0.4s ease;
      position: relative;
      z-index: 2;
    }

    [data-theme="dark"] .profile-image-circle {
      border-color: var(--color-fourth);
    }

    .profile-badge {
      position: absolute;
      bottom: -15px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-third) 100%);
      color: var(--color-primary);
      padding: 12px 30px;
      border-radius: 50px;
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 0.5px;
      white-space: nowrap;
      z-index: 3;
    }

    .profile-info-box {
      text-align: center;
      padding: 20px;
    }

    .profile-name {
      font-size: 1.8rem;
      font-weight: 600;
      color: var(--color-secondary);
      font-family: "Merriweather", serif;
      margin-bottom: 8px;
    }

    .profile-title {
      font-size: 1.1rem;
      color: var(--color-third);
      font-weight: 500;
      font-family: "'Merriweather', serif";
      margin: 0;
    }

    .profile-bio {
      font-size: 1rem;
      line-height: 1.7;
      color: var(--color-dark);
      text-align: justify;
      margin: 0;
      font-family: "'Merriweather', serif";
    }

    .profile-bio strong {
      color: var(--color-secondary);
    }

    .social-links-row {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
    }

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 14px 20px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      font-size: 15px;
      transition: all 0.3s ease;
      border: 2px solid transparent;
      color: var(--color-dark);
      background: var(--color-fourth);
    }

    .social-link:hover {
      transform: translateX(5px);
    }

    .linkedin-link {
      color: #0a66c2;
      border-color: #0a66c2;
    }

    .linkedin-link:hover {
      background: rgba(10, 102, 194, 0.1);
      color: #0a66c2;
    }

    .email-link {
      color: var(--color-secondary);
      border-color: var(--color-secondary);
    }

    .email-link:hover {
      background: rgba(13, 157, 184, 0.1);
    }

    .main-content-card {
      background: var(--color-primary) !important;
      border-radius: 15px;
      padding: 50px;
      border: 1px solid rgba(13, 157, 184, 0.1);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      margin-bottom: 50px;
    }

    [data-theme="dark"] .main-content-card {
      background: var(--color-fourth) !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(13, 157, 184, 0.2);
    }

    .main-content-card h4 {
      margin-top: 10px;
      margin-bottom: 20px;
      font-size: 1.8rem;
      font-weight: 600;
      color: var(--color-secondary);
      font-family: "Merriweather", serif;
      scroll-margin-top: 160px;
    }

    .main-content-card p {
      font-size: 16px;
      color: var(--color-dark);
      line-height: 1.7;
      text-align: justify;
      margin-bottom: 16px;
    }

    .main-content-card p strong {
      color: var(--color-secondary);
    }

    .section-divider {
      border: 0;
      height: 1px;
      background: linear-gradient(to right, transparent, rgba(13, 157, 184, 0.3), transparent);
      margin: 40px 0;
    }

    p[data-warning] {
      background: rgba(220, 53, 69, 0.1);
      padding: 20px;
      border-left: 4px solid #dc3545;
      border-radius: 8px;
      font-weight: 500;
      color: var(--color-dark);
    }

    p[data-contact] {
      background: var(--color-fourth);
      padding: 20px;
      border-left: 4px solid var(--color-secondary);
      border-radius: 8px;
      font-weight: 500;
      color: var(--color-dark);
      text-align: center;
    }

    .impact-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }

    .stat-item {
      background: var(--color-fourth);
      padding: 20px;
      border-radius: 12px;
      border-left: 4px solid var(--color-secondary);
      transition: all 0.3s ease;
    }

    .stat-item:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .stat-item h5 {
      font-size: 2rem;
      color: var(--color-secondary);
      font-family: "Merriweather", serif;
      margin-bottom: 5px;
    }

    .stat-item p {
      font-size: 14px;
      margin: 0;
    }

    .sticky-nav-container {
      position: sticky;
      top: 80px;
      background: var(--color-primary);
      z-index: 100;
      border-bottom: 1px solid rgba(13, 157, 184, 0.1);
      margin-bottom: 40px;
    }

    .custom-nav-link {
      color: var(--color-secondary) !important;
      font-weight: 500;
      padding: 12px 16px !important;
      border-radius: 8px;
      transition: all 0.3s ease;
      white-space: nowrap;
    }

    .custom-nav-link:hover {
      background-color: rgba(13, 157, 184, 0.1) !important;
      transform: translateY(-2px);
    }

    .custom-nav-link.active {
      background-color: var(--color-secondary) !important;
      color: var(--color-primary) !important;
    }

    @media (max-width: 1024px) {
      .team-members-wrapper {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .allContainer {
        padding-top: 70px;
      }

      .about-container {
        margin-top: 0px;
        padding: 15px 15px;
      }

      .team-member-card {
        padding: 30px 20px;
      }

      .sticky-nav-container {
        top: 70px;
      }

      .main-content-card {
        padding: 25px;
      }

      .impact-stats-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 576px) {
      .allContainer {
        padding-top: 60px;
      }

      .about-container {
        padding: 12px 12px;
      }

      #founder-card {
        display: block;
        width: 100%;
        order: 1;
      }

      #medical-advisor-card {
        display: block;
        width: 100%;
        order: 2;
      }

      .team-members-wrapper {
        display: flex;
        flex-direction: column;
        gap: 25px;
        margin-bottom: 40px;
      }

      .team-member-card {
        padding: 20px 15px;
        gap: 18px;
      }

      .profile-image-wrapper {
        width: 160px;
        height: 160px;
      }

      .profile-name {
        font-size: 1.5rem;
      }

      .profile-title {
        font-size: 1rem;
      }

      .profile-bio {
        font-size: 0.95rem;
        line-height: 1.6;
        text-align: left;
      }

      .social-link {
        padding: 12px 16px;
        font-size: 14px;
        gap: 8px;
      }

      .social-link svg {
        width: 18px;
        height: 18px;
      }

      .impact-stats-grid {
        grid-template-columns: 1fr;
        gap: 15px;
      }

      .stat-item {
        padding: 15px;
      }

      .stat-item h5 {
        font-size: 1.5rem;
      }

      .stat-item p {
        font-size: 13px;
      }

      .main-content-card {
        padding: 20px 15px;
      }

      .main-content-card h4 {
        font-size: 1.5rem;
        margin-bottom: 15px;
      }

      .main-content-card p {
        font-size: 14px;
        line-height: 1.6;
        margin-bottom: 12px;
      }

      .about-container h2 {
        font-size: 2rem;
        margin-bottom: 20px;
      }

      .sticky-nav-container {
        top: 60px;
        margin-bottom: 20px;
      }

      .section-divider {
        margin: 25px 0;
      }

      p[data-warning],
      p[data-contact] {
        padding: 15px;
        font-size: 14px;
      }
    }

    * {
      transition: background-color 0.3s ease, border-color 0.3s ease;
    }

    button, a, .social-link, .role-card, .cta-button, .custom-nav-link {
      transition: all 0.3s ease;
    }

    .support-option-email {
      color: var(--color-secondary);
      text-decoration: none;
      font-weight: 600;
    }

    .support-option-email:hover {
      text-decoration: underline;
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="allContainer">
        <div className="container about-container">
          <h2 className="mb-4">About Us</h2>

          {/* ===== TEAM MEMBERS SECTION (2 SEPARATE BOXES) ===== */}
          <div className="team-members-wrapper">

            {/* FOUNDER CARD */}
            <div id="founder-card" className="team-member-card">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <div className="profile-image-wrapper">
                  <img
                    src="/assets/arun.jpg"
                    alt="Arun Pratap Singh - Founder & Developer"
                    className="profile-image-circle"
                  />
                  <div className="profile-badge">Founder</div>
                </div>

                <div className="profile-info-box">
                  <h3 className="profile-name">Arun Pratap Singh</h3>
                  <p className="profile-title">Founder & Lead Developer</p>
                </div>

                <p className="profile-bio">
                  <strong>Arun</strong> is the Founder and Lead Developer of <strong>DoctorXCare</strong>, dedicated to democratizing healthcare through ethical AI and healthcare services. By architecting a secure, patient-centered ecosystem, he bridges the gap between complex medical data and public accessibility. Committed to empowering users and inspiring a future of trusted digital health, he ensures that reliable, stress-free medical guidance is accessible to everyone, everywhere.
                </p>

                <div className="social-links-row">
                  <a
                    href="https://www.linkedin.com/in/arun-pratap-singh-944491292"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link linkedin-link"
                    title="LinkedIn Profile"
                  >
                    <Linkedin size={20} />
                    <span>LinkedIn</span>
                  </a>

                  <a
                    href="mailto:arunstp45@gmail.com"
                    className="social-link email-link"
                    title="Send Email"
                  >
                    <Mail size={20} />
                    <span>Email</span>
                  </a>
                </div>
              </div>
            </div>

            {/* MEDICAL ADVISOR CARD */}
            <div id="medical-advisor-card" className="team-member-card">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <div className="profile-image-wrapper">
                  <img
                    src="/assets/jayshree.png"
                    alt="Jayshree - Medical Advisor"
                    className="profile-image-circle"
                  />
                  <div className="profile-badge">Medical Advisor</div>
                </div>

                <div className="profile-info-box">
                  <h3 className="profile-name">Jayshree Gondane</h3>
                  <p className="profile-title">Medical Advisor</p>
                </div>

                <p className="profile-bio">
                  <strong>Jayshree</strong> is the Medical Advisor at <strong>DoctorXCare</strong>, dedicated to ensuring clinical excellence at the intersection of medicine, technology, and innovation. By providing rigorous clinical validation and medical precision, she bridges the gap between complex healthcare standards and scalable digital solutions. Committed to accuracy and patient safety, she ensures that every AI-driven insight is built on a foundation of medical integrity and trust.
                </p>

                <div className="social-links-row">
                  <a
                    href="https://www.linkedin.com/in/jayshree-g-12aa47357"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link linkedin-link"
                    title="LinkedIn Profile"
                  >
                    <Linkedin size={20} />
                    <span>LinkedIn</span>
                  </a>

                  <a
                    href="mailto:jayshree08gondane@gmail.com"
                    className="social-link email-link"
                    title="Send Email"
                  >
                    <Mail size={20} />
                    <span>Email</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* ===== STICKY TOP NAVIGATION BAR ===== */}
          <div id="top-navigation" className="sticky-nav-container">
            <nav className="nav nav-pills flex-nowrap overflow-auto justify-content-lg-center">
              <a className="nav-link custom-nav-link" href="#sec-overview">Overview</a>
              <a className="nav-link custom-nav-link" href="#sec-mission">Mission</a>
              <a className="nav-link custom-nav-link" href="#sec-services">Services</a>
              <a className="nav-link custom-nav-link" href="#sec-impact">Impact</a>
              <a className="nav-link custom-nav-link" href="#sec-tech">Technology</a>
              <a className="nav-link custom-nav-link" href="#sec-privacy">Privacy</a>
              <a className="nav-link custom-nav-link" href="#sec-compliance">Compliance</a>
              <a className="nav-link custom-nav-link" href="#sec-future">Roadmap</a>
            </nav>
          </div>

          {/* ===== MAIN CONTENT BOX ===== */}
          <div className="main-content-card">

            {/* COMPANY OVERVIEW */}
            <h4 id="sec-overview">Overview</h4>
            <p>DoctorXCare is a leading digital health information platform that revolutionizes how individuals understand and manage their health concerns. Founded with the vision of democratizing healthcare information, we bridge the gap between medical expertise and public accessibility through innovative AI-powered technology solutions.</p>
            <p>Our platform serves as a comprehensive digital health companion, featuring an advanced AI Medical Assistant powered by Google Gemini. This intelligent assistant provides personalized medical guidance, accurate treatment recommendations, and professional health advice based on established medical guidelines. By combining evidence-based medical knowledge with state-of-the-art artificial intelligence, DoctorXCare delivers reliable, accurate, and actionable health insights tailored to each user's unique needs.</p>
            <p>From symptom analysis and disease information to personalized health risk assessments, DoctorXCare empowers individuals worldwide to make informed decisions about their health and wellness. We are committed to ensuring that quality healthcare information and expert medical guidance are accessible to everyone, anytime, anywhere.</p>

            <hr className="section-divider" />

            {/* MISSION & VISION */}
            <h4 id="sec-mission">Mission & Vision</h4>
            <p><strong>Our Mission:</strong> To empower individuals globally by providing accessible, accurate, and reliable health information that enables informed healthcare decisions. We strive to make quality health insights available anytime, anywhere, while maintaining the highest standards of privacy, security, and medical accuracy.</p>
            <p><strong>Our Mission:</strong> To empower individuals to understand their health concerns with clarity and confidence. We provide the initial knowledge that allows our users to make informed decisions, guiding them on whether to manage their condition at home or to seek professional medical help.</p>
            <p><strong>Our Vision:</strong> To create a future where healthcare is demystified and accessible to all. We envision a world where every person can confidently take the first step in understanding their health, leading to better outcomes and more effective collaboration with medical professionals.</p>
            <p><strong>Core Values:</strong> Our work is guided by a deep commitment to <strong>Trust</strong>, <strong>Accuracy</strong>, and <strong>Accessibility</strong>. We champion <strong>Patient-Centered Care</strong>, rigorously protect user <strong>Privacy</strong>, and drive <strong>Innovation</strong> in everything we do.</p>

            <hr className="section-divider" />

            {/* OUR SERVICES */}
            <h4 id="sec-services">Our Services</h4>
            <p><strong>AI Medical Assistant (Powered by Google Gemini):</strong> Our advanced AI assistant acts as your personal medical companion, providing accurate and up-to-date health information, suggesting appropriate medicines and treatments, offering professional medical advice based on established guidelines, and explaining medical concepts clearly. The AI assistant prioritizes your safety and well-being in all recommendations, ensuring you receive reliable guidance for your health concerns.</p>
            <p><strong>Symptom Analysis Engine:</strong> Our flagship service provides users with an interactive, AI-powered symptom assessment tool. Users can input their symptoms to receive detailed explanations of possible health conditions, along with clear guidance on appropriate next steps and recommendations.</p>
            <p><strong>Disease Information Library:</strong> A vast repository of medically reviewed articles and educational content covering a wide range of health conditions. This library is continuously updated with the latest health news and advisories from the <strong>World Health Organization (WHO)</strong>, providing a reliable and current resource for your health information needs.</p>
            <p><strong>Health Risk Assessment:</strong> Proactive tools that provide personalized risk evaluations. By analyzing lifestyle factors, family history, and current health data, these assessments help users understand their predisposition to various conditions and empower them to take preventive action.</p>
            <p>All services are designed for educational and informational purposes only and are <strong>not a substitute</strong> for professional medical consultation, diagnosis, or treatment.</p>

            <hr className="section-divider" />

            {/* IMPACT NUMBERS */}
            <h4 id="sec-impact">Our Impact in Numbers</h4>
            <div className="impact-stats-grid">
              <div className="stat-item">
                <h5>2000+</h5>
                <p>Hours of medical research and platform development invested to ensure accuracy and reliability</p>
              </div>
              <div className="stat-item">
                <h5>250+</h5>
                <p>Symptom assessments completed by users worldwide, helping individuals better understand their health concerns</p>
              </div>
              <div className="stat-item">
                <h5>200+</h5>
                <p>Monthly active users receiving health guidance and information through our platform</p>
              </div>
              <div className="stat-item">
                <h5>95%</h5>
                <p>User satisfaction rate based on feedback surveys and platform reviews</p>
              </div>
            </div>

            <hr className="section-divider" />

            {/* TECHNOLOGY & APPROACH */}
            <h4 id="sec-tech">Technology & Approach</h4>
            <p><strong>Intelligent Analysis Engine:</strong> Our symptom analysis engine is built on a foundation of carefully researched and validated health information. We are committed to ensuring our knowledge base is comprehensive and reflects a deep understanding of the conditions presented.</p>
            <p><strong>User-Centric Design:</strong> We believe that health information should be clear and empowering. Every aspect of our platform is designed with the user experience as the top priority, ensuring complex medical topics are presented in an accessible and easy-to-understand format.</p>
            <p><strong>Commitment to Accuracy:</strong> We are dedicated to providing accurate and relevant health information. All content undergoes a thorough internal review process to ensure its validity, and we are committed to keeping it updated with the latest health insights.</p>
            <p><strong>Continuous Improvement:</strong> Our platform is constantly evolving. We actively use <strong>user feedback</strong> to guide our improvements, and your input is essential to helping us enhance our services. If you encounter any issues, we are ready to make changes accordingly.</p>

            <hr className="section-divider" />

            {/* PRIVACY & SECURITY */}
            <h4 id="sec-privacy">Privacy & Security</h4>
            <p><strong>Your Privacy Comes First:</strong> Your trust is our highest priority. We are committed to protecting your privacy by <strong>not storing the personal symptoms or health inquiries you submit</strong> after your session is complete. We only handle the minimal account information necessary for our service to function, and it is always encrypted and securely managed.</p>
            <p><strong>Anonymous Processing for Improvement:</strong> To help us improve our system, the symptom data you provide is processed in a completely anonymous form. This means your identity is fully protected, as the information is detached from any personal account details before it is used for statistical analysis.</p>
            <p><strong>Secure Infrastructure:</strong> Our platform utilizes industry-standard security measures, including SSL encryption and secure data transmission protocols, to protect your account information and ensure a safe user experience.</p>
            <p><strong>Confidentiality Commitment:</strong> We adhere to strict data protection and confidentiality protocols in all our operations and will never sell your data to third parties.</p>

            <hr className="section-divider" />

            {/* REGULATORY COMPLIANCE */}
            <h4 id="sec-compliance">Regulatory Compliance</h4>
            <p data-warning="true"><strong>Important Regulatory Notice:</strong> DoctorXCare is an informational tool for educational purposes and is <strong>not a licensed medical device</strong> in any jurisdiction. It is not intended to provide a medical diagnosis.</p>
            <p><strong>Regulatory Status:</strong> This platform has not been registered, reviewed, or approved as a medical device by regulatory authorities such as the <strong>U.S. Food and Drug Administration (FDA)</strong>, the <strong>European Medicines Agency (EMA)</strong>, or the <strong>Central Drugs Standard Control Organisation (CDSCO)</strong> in India.</p>
            <p><strong>Usage Restrictions:</strong> The use of this platform is prohibited in any country or jurisdiction where its services would be considered a regulated medical device and require formal certification. It is the user's responsibility to ensure compliance with their local regulations.</p>
            <p><strong>Permitted Use:</strong> This platform is intended for use in jurisdictions where AI-driven health information tools for educational purposes are permitted without requiring formal medical device registration.</p>

            <hr className="section-divider" />

            {/* FUTURE ROADMAP */}
            <h4 id="sec-future">Future Roadmap</h4>
            <p><strong>Enhanced AI Capabilities:</strong> Continued development of our artificial intelligence algorithms to provide more accurate, personalized health assessments and recommendations.</p>
            <p><strong>Expanded Service Portfolio:</strong> Introduction of additional features including health tracking tools, medication reminders, and integration with wearable devices for comprehensive health monitoring.</p>
            <p><strong>Global Expansion:</strong> Strategic expansion into new markets while ensuring compliance with local regulatory requirements and cultural health practices.</p>
            <p><strong>Healthcare Provider Integration:</strong> Development of tools and APIs that enable healthcare providers to integrate DoctorX insights into their clinical workflows, enhancing patient care and consultation efficiency.</p>
            <p><strong>Research Partnerships:</strong> Collaboration with academic institutions, research organizations, and healthcare systems to advance digital health research and improve global health outcomes.</p>

            <p data-contact="true">For partnership opportunities or media inquiries, please reach out to us.</p>
            <p data-contact="true">We value your input. To provide <strong>feedback</strong> or ask a questions to - <a href="mailto:contact@doctorxcare.in" className="support-option-email">
              contact@doctorxcare.in
            </a>.</p>
          </div>

        </div>
      </div>
    </>
  );
}

export default About;