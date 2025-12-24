import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ScrollSpy from "bootstrap/js/dist/scrollspy";
import '../../styles/About.css';
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react';

function About() {
  useEffect(() => {
    const scrollElement = document.querySelector(".scrollspy-example");
    if (scrollElement) {
      new ScrollSpy(document.body, {
        target: "#list-example",
        offset: 100,
      });
    }
  }, []);

  return (
    <div className="allContainer">
      <div className="container about-container">
        <h2 className="mb-4">About DoctorXCare</h2>

        {/* ===== FOUNDER SECTION ===== */}
        <div className="founder-showcase-section">
          <div className="founder-container">
            {/* Left Side - Image and Quick Links */}
            <div className="founder-left">
              <div className="profile-image-wrapper">
                <img 
                  src="/assets/arun.jpg" 
                  alt="Arun Pratap Singh - Founder & Developer"
                  className="profile-image-circle"
                />
                <div className="profile-badge">Founder</div>
              </div>

              {/* Social Links */}
              <div className="founder-social-links">
                <a 
                  href="https://www.linkedin.com/in/arun-pratap-singh" 
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

            {/* Right Side - Founder Details */}
            <div className="founder-right">
              <div className="founder-header">
                <h3 className="founder-name">Arun Pratap Singh</h3>
                <p className="founder-tagline">Founder, Full-Stack Developer & Designer</p>
              </div>

              <div className="founder-bio">
                <p>
                  Designed and developed single-handedly by <strong>Arun Pratap Singh</strong>, a visionary Full-Stack Developer and Founder. With deep expertise in Information Technology and AI integration, Arun architected DoctorXCare to bridge the critical gap between complex medical data and public accessibility. His mission is to democratize healthcare information, ensuring that smart, reliable, and user-friendly health guidance is available to everyone, everywhere.
                </p>
              </div>

              {/* Roles & Responsibilities */}
              <div className="founder-roles">
                <div className="role-card">
                  <h5 className="role-title">👨‍💻 Lead Architect</h5>
                  <p className="role-description">
                    Engineering a secure full-stack architecture using React.js and Node.js. Focused on integrating clinical AI, optimizing performance, and building a scalable digital health ecosystem.
                  </p>
                </div>
                <div className="role-card">
                  <h5 className="role-title">🎨 Product Designer</h5>
                  <p className="role-description">
                    Crafting empathetic, patient-centric interfaces that translate complex medical data into clarity. Prioritizing accessibility and intuitive design to ensure a stress-free experience for users of all ages.
                  </p>
                </div>
                <div className="role-card">
                  <h5 className="role-title">🚀 Founder & Visionary</h5>
                  <p className="role-description">
                    Driving the mission to democratize healthcare access through ethical AI. Strategizing a future where trusted medical guidance is instant, accessible, and free from misinformation for everyone.
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="founder-cta">
                <a 
                  href="https://www.linkedin.com/in/arun-pratap-singh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-button primary"
                >
                  <span>Connect on LinkedIn</span>
                  <ExternalLink size={16} />
                </a>
                <a 
                  href="mailto:arunstp45@gmail.com"
                  className="cta-button secondary"
                >
                  <span>Get in Touch</span>
                  <Mail size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ===== MAIN CONTENT WITH SIDEBAR ===== */}
        <div className="row mt-5">
          {/* Sidebar */}
          <div className="col-md-4 mb-3">
            <div id="list-example" className="list-group sticky-top">
              <a className="list-group-item list-group-item-action" href="#company-overview">Overview</a>
              <a className="list-group-item list-group-item-action" href="#mission-vision">Mission & Vision</a>
              <a className="list-group-item list-group-item-action" href="#our-services">Our Services</a>
              <a className="list-group-item list-group-item-action" href="#impact-numbers">Our Impact in Numbers</a>
              <a className="list-group-item list-group-item-action" href="#technology-approach">Technology & Approach</a>
              <a className="list-group-item list-group-item-action" href="#privacy-security">Privacy & Security</a>
              <a className="list-group-item list-group-item-action" href="#regulatory-compliance">Regulatory Compliance</a>
              <a className="list-group-item list-group-item-action" href="#future-roadmap">Future Roadmap</a>
            </div>
          </div>

          {/* Content */}
          <div className="col-md-8">
            <div
              data-bs-spy="scroll"
              data-bs-target="#list-example"
              data-bs-smooth-scroll="true"
              className="scrollspy-example"
              style={{ height: "80vh", overflowY: "auto" }}
              tabIndex="0"
            >
              {/* COMPANY OVERVIEW */}
              <h4 id="company-overview">Overview</h4>
              <p>DoctorXCare is a leading digital health information platform that revolutionizes how individuals understand and manage their health concerns. Founded with the vision of democratizing healthcare information, we bridge the gap between medical expertise and public accessibility through innovative AI-powered technology solutions.</p>
              <p>Our platform serves as a comprehensive digital health companion, featuring an advanced AI Medical Assistant powered by Google Gemini. This intelligent assistant provides personalized medical guidance, accurate treatment recommendations, and professional health advice based on established medical guidelines. By combining evidence-based medical knowledge with state-of-the-art artificial intelligence, DoctorXCare delivers reliable, accurate, and actionable health insights tailored to each user's unique needs.</p>
              <p>From symptom analysis and disease information to personalized health risk assessments, DoctorXCare empowers individuals worldwide to make informed decisions about their health and wellness. We are committed to ensuring that quality healthcare information and expert medical guidance are accessible to everyone, anytime, anywhere.</p>

              {/* MISSION & VISION */}
              <h4 id="mission-vision">Mission & Vision</h4>
              <p><strong>Our Mission:</strong> To empower individuals globally by providing accessible, accurate, and reliable health information that enables informed healthcare decisions. We strive to make quality health insights available anytime, anywhere, while maintaining the highest standards of privacy, security, and medical accuracy.</p>
              <p><strong>Our Mission:</strong> To empower individuals to understand their health concerns with clarity and confidence. We provide the initial knowledge that allows our users to make informed decisions, guiding them on whether to manage their condition at home or to seek professional medical help.</p>
              <p><strong>Our Vision:</strong> To create a future where healthcare is demystified and accessible to all. We envision a world where every person can confidently take the first step in understanding their health, leading to better outcomes and more effective collaboration with medical professionals.</p>
              <p><strong>Core Values:</strong> Our work is guided by a deep commitment to <strong>Trust</strong>, <strong>Accuracy</strong>, and <strong>Accessibility</strong>. We champion <strong>Patient-Centered Care</strong>, rigorously protect user <strong>Privacy</strong>, and drive <strong>Innovation</strong> in everything we do.</p>

              {/* OUR SERVICES */}
              <h4 id="our-services">Our Services</h4>
              <p><strong>AI Medical Assistant (Powered by Google Gemini):</strong> Our advanced AI assistant acts as your personal medical companion, providing accurate and up-to-date health information, suggesting appropriate medicines and treatments, offering professional medical advice based on established guidelines, and explaining medical concepts clearly. The AI assistant prioritizes your safety and well-being in all recommendations, ensuring you receive reliable guidance for your health concerns.</p>
              <p><strong>Symptom Analysis Engine:</strong> Our flagship service provides users with an interactive, AI-powered symptom assessment tool. Users can input their symptoms to receive detailed explanations of possible health conditions, along with clear guidance on appropriate next steps and recommendations.</p>
              <p><strong>Disease Information Library:</strong> A vast repository of medically reviewed articles and educational content covering a wide range of health conditions. This library is continuously updated with the latest health news and advisories from the <strong>World Health Organization (WHO)</strong>, providing a reliable and current resource for your health information needs.</p>
              <p><strong>Health Risk Assessment:</strong> Proactive tools that provide personalized risk evaluations. By analyzing lifestyle factors, family history, and current health data, these assessments help users understand their predisposition to various conditions and empower them to take preventive action.</p>
              <p>All services are designed for educational and informational purposes only and are <strong>not a substitute</strong> for professional medical consultation, diagnosis, or treatment.</p>

              {/* IMPACT NUMBERS */}
              <h4 id="impact-numbers">Our Impact in Numbers</h4>
              <div className="impact-stats-grid">
                <div className="stat-item">
                  <h5>1500+</h5>
                  <p>Hours of medical research and platform development invested to ensure accuracy and reliability</p>
                </div>
                <div className="stat-item">
                  <h5>100+</h5>
                  <p>Symptom assessments completed by users worldwide, helping individuals better understand their health concerns</p>
                </div>
                <div className="stat-item">
                  <h5>50+</h5>
                  <p>Monthly active users receiving health guidance and information through our platform</p>
                </div>
                <div className="stat-item">
                  <h5>95%</h5>
                  <p>User satisfaction rate based on feedback surveys and platform reviews</p>
                </div>
              </div>

              {/* TECHNOLOGY & APPROACH */}
              <h4 id="technology-approach">Technology & Approach</h4>
              <p><strong>Intelligent Analysis Engine:</strong> Our symptom analysis engine is built on a foundation of carefully researched and validated health information. We are committed to ensuring our knowledge base is comprehensive and reflects a deep understanding of the conditions presented.</p>
              <p><strong>User-Centric Design:</strong> We believe that health information should be clear and empowering. Every aspect of our platform is designed with the user experience as the top priority, ensuring complex medical topics are presented in an accessible and easy-to-understand format.</p>
              <p><strong>Commitment to Accuracy:</strong> We are dedicated to providing accurate and relevant health information. All content undergoes a thorough internal review process to ensure its validity, and we are committed to keeping it updated with the latest health insights.</p>
              <p><strong>Continuous Improvement:</strong> Our platform is constantly evolving. We actively use <strong>user feedback</strong> to guide our improvements, and your input is essential to helping us enhance our services. If you encounter any issues, we are ready to make changes accordingly.</p>

              {/* PRIVACY & SECURITY */}
              <h4 id="privacy-security">Privacy & Security</h4>
              <p><strong>Your Privacy Comes First:</strong> Your trust is our highest priority. We are committed to protecting your privacy by <strong>not storing the personal symptoms or health inquiries you submit</strong> after your session is complete. We only handle the minimal account information necessary for our service to function, and it is always encrypted and securely managed.</p>
              <p><strong>Anonymous Processing for Improvement:</strong> To help us improve our system, the symptom data you provide is processed in a completely anonymous form. This means your identity is fully protected, as the information is detached from any personal account details before it is used for statistical analysis.</p>
              <p><strong>Secure Infrastructure:</strong> Our platform utilizes industry-standard security measures, including SSL encryption and secure data transmission protocols, to protect your account information and ensure a safe user experience.</p>
              <p><strong>Confidentiality Commitment:</strong> We adhere to strict data protection and confidentiality protocols in all our operations and will never sell your data to third parties.</p>

              {/* REGULATORY COMPLIANCE */}
              <h4 id="regulatory-compliance">Regulatory Compliance</h4>
              <p data-warning="true"><strong>Important Regulatory Notice:</strong> DoctorXCare is an informational tool for educational purposes and is <strong>not a licensed medical device</strong> in any jurisdiction. It is not intended to provide a medical diagnosis.</p>
              <p><strong>Regulatory Status:</strong> This platform has not been registered, reviewed, or approved as a medical device by regulatory authorities such as the <strong>U.S. Food and Drug Administration (FDA)</strong>, the <strong>European Medicines Agency (EMA)</strong>, or the <strong>Central Drugs Standard Control Organisation (CDSCO)</strong> in India.</p>
              <p><strong>Usage Restrictions:</strong> The use of this platform is prohibited in any country or jurisdiction where its services would be considered a regulated medical device and require formal certification. It is the user's responsibility to ensure compliance with their local regulations.</p>
              <p><strong>Permitted Use:</strong> This platform is intended for use in jurisdictions where AI-driven health information tools for educational purposes are permitted without requiring formal medical device registration.</p>

              {/* FUTURE ROADMAP */}
              <h4 id="future-roadmap">Future Roadmap</h4>
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
      </div>
    </div>
  );
}

export default About;