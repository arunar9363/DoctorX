import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ScrollSpy from "bootstrap/js/dist/scrollspy";
import '../styles/TermsOfService.css';

function TermsOfService() {
  useEffect(() => {
    // ScrollSpy initialization targeting the new Top Navigation
    const spy = new ScrollSpy(document.body, {
      target: "#terms-navigation",
      offset: 180, // Offset to prevent headings from hiding behind the nav
    });

    spy.refresh();
  }, []);

  return (
    <div className="allContainer">
      <div className="container terms-container">
        <h2 className="mb-4">DoctorX – Terms of Service</h2>

        {/* ===== NEW STICKY TOP NAVIGATION ===== */}
        <div id="terms-navigation" className="sticky-nav-container">
          <nav className="nav nav-pills flex-nowrap overflow-auto">
            <a className="nav-link custom-nav-link" href="#term-important">Important</a>
            <a className="nav-link custom-nav-link" href="#term-general">1 General</a>
            <a className="nav-link custom-nav-link" href="#term-liability">2 Liability</a>
            <a className="nav-link custom-nav-link" href="#term-services">3 Services</a>
            <a className="nav-link custom-nav-link" href="#term-agreement">4 User Agreement</a>
            <a className="nav-link custom-nav-link" href="#term-usage">5 Usage</a>
            <a className="nav-link custom-nav-link" href="#term-termination">6 Termination</a>
            <a className="nav-link custom-nav-link" href="#term-ip">7 IP Rights</a>
            <a className="nav-link custom-nav-link" href="#term-support">8 Support</a>
            <a className="nav-link custom-nav-link" href="#term-privacy">9 Privacy</a>
            <a className="nav-link custom-nav-link" href="#term-company">10 Company</a>
            <a className="nav-link custom-nav-link" href="#term-final">11 Final</a>
          </nav>
        </div>

        {/* ===== MAIN CONTENT BOX (Styled like Founder Box) ===== */}
        <div className="main-content-card">

          {/* IMPORTANT NOTE */}
          <h4 id="term-important">IMPORTANT NOTE</h4>
          <p>DoctorX is a digital health information platform designed for educational and wellness purposes only. It is not intended to provide a medical diagnosis, treatment, or professional healthcare advice.</p>
          <p><strong>Universal Regulatory Status:</strong> DoctorX is <strong>not a licensed medical device</strong>. It has not been registered, reviewed, certified, or approved by any governmental or medical regulatory authority worldwide. This includes, but is not limited to, the CDSCO (India), the FDA (United States), and the EMA (European Union).</p>
          <p><strong>User Responsibility:</strong> You are solely responsible for ensuring that your use of this platform is compliant with the laws and regulations of your jurisdiction. Do not use this tool if your local laws classify platforms like this as a regulated medical device requiring formal certification.</p>
          <p data-warning="true">⚠️ DoctorX does not provide a medical diagnosis. It is intended to help you better understand your symptoms and prepare for a consultation with a licensed healthcare professional. Always seek professional medical advice before making healthcare decisions. If you experience an emergency, call your local emergency number immediately.</p>

          <hr className="section-divider" />

          {/* §1. GENERAL PROVISIONS */}
          <h4 id="term-general">1. General Provisions</h4>
          <p>These Terms of Service govern the use of the DoctorX website and mobile application, including: rules for using DoctorX services, the rights and obligations of DoctorX and its users, territorial limitations of use, disclaimers regarding liability. By using DoctorX, you agree to these Terms of Service.</p>

          <hr className="section-divider" />

          {/* §2. ACKNOWLEDGMENTS */}
          <h4 id="term-liability">2. Acknowledgments & Liability</h4>
          <p>DoctorX provides informational and educational content only. DoctorX is not a replacement for professional medical advice, diagnosis, or treatment.</p>
          <p>Do not use DoctorX in emergency situations — always contact emergency services.</p>
          <p>Users must not rely solely on DoctorX results to make medical decisions. Always consult a doctor. Any medicines, treatments, or medical steps should only be taken after professional consultation.</p>
          <p>DoctorX may be unavailable from time to time due to updates, maintenance, or unforeseen issues.</p>
          <p>DoctorX is not liable for: user actions based on the information provided, third-party services or websites linked from DoctorX, hardware/software issues on the user's device, misuse of the application outside allowed jurisdictions, Force Majeure events (e.g., natural disasters, strikes, technical outages).</p>

          <hr className="section-divider" />

          {/* §3. SERVICES */}
          <h4 id="term-services">3. Services Provided</h4>
          <p>DoctorX currently provides several services: our interactive <strong>Symptom Checker</strong>, where users can input symptoms to understand possible health conditions; a focused <strong>Disease Information Library</strong> with articles on a select number of health topics; and <strong>Global Health Updates</strong>, featuring the latest news from the World Health Organization (WHO).</p>
          <p>DoctorX may expand or restrict services at any time. All services are provided free of charge for personal use, unless otherwise stated.</p>

          <hr className="section-divider" />

          {/* §4. USER AGREEMENT */}
          <h4 id="term-agreement">4. User Agreement</h4>
          <p>By accessing and using the DoctorX website, you agree to be bound by these Terms of Service. If you do not agree with these terms, you must immediately cease using the website.</p>
          <p>The services provided on this website are intended for voluntary use by adults (18 years of age or older). DoctorX reserves the right to introduce, modify, or remove services in the future, which may include additional features such as advanced reports.</p>

          <hr className="section-divider" />

          {/* §5. ACCEPTABLE USE */}
          <h4 id="term-usage">§5. Acceptable Use Policy</h4>
          <p>Users must not: upload, share, or promote unlawful or harmful content, use DoctorX for advertising or commercial promotion without written consent, attempt to hack, disrupt, or reverse-engineer DoctorX systems, misuse results for self-treatment without consulting a doctor.</p>
          <p>DoctorX reserves the right to suspend accounts or restrict access if misuse is detected.</p>

          <hr className="section-divider" />

          {/* §6. TERMINATION */}
          <h4 id="term-termination">6. Termination of Use</h4>
          <p>Users may stop using DoctorX anytime. DoctorX may suspend or terminate services if a user violates these Terms.</p>

          <hr className="section-divider" />

          {/* §7. INTELLECTUAL PROPERTY */}
          <h4 id="term-ip">7. Intellectual Property</h4>
          <p>All content, design, and software of DoctorX are protected by copyright. Users are granted a limited, non-transferable license to use DoctorX for personal, non-commercial purposes. Users may not copy, modify, or distribute DoctorX's intellectual property without prior consent.</p>

          <hr className="section-divider" />

          {/* §8. COMPLAINTS */}
          <h4 id="term-support">8. Complaints & Support</h4>
          <p data-contact="true" className="support-intro">For any complaints, queries, or feedback, we're here to help. You can reach us through the following channels:</p>

          <div className="contact-options">
            <div className="support-option">
              <div className="support-option-title">General Support</div>
              <div className="support-option-description">
                For support queries and assistance
              </div>
              <a href="mailto:support@doctorxcare.in" className="support-option-email">support@doctorxcare.in</a>
            </div>

            <div className="support-option">
              <div className="support-option-title">Contact & Inquiries</div>
              <div className="support-option-description">
                For general inquiries and feedback
              </div>
              <a href="mailto:contact@doctorxcare.in" className="support-option-email">
                contact@doctorxcare.in
              </a>
            </div>
          </div>

          <p className="response-time-box">We aim to respond to all inquiries within 14 business days.</p>

          <hr className="section-divider" />

          {/* §9. PRIVACY */}
          <h4 id="term-privacy">§9. Privacy & Cookies</h4>
          <p>Your privacy is fundamental to how DoctorXCare operates. We want to be clear: <strong>we do not store the personal symptom or health data you enter</strong>. The only personal information we collect is the minimal data required for account purposes, such as your email address for login. Any data we do hold is stored securely, never sold, and you can find full details in our Privacy Policy and Cookies Policy.</p>

          <hr className="section-divider" />

          {/* §10. COMPANY INFORMATION */}
          <h4 id="term-company">§10. Company Information</h4>
          <div className="company-info-grid">
            <div className="company-info-card">
              <div className="company-info-label">Business Name</div>
              <div className="company-info-value">DoctorXCare</div>
            </div>
            <div className="company-info-card">
              <div className="company-info-label">MSME Registration</div>
              <div className="company-info-value">Udyam-UP-28-0186274</div>
            </div>
            <div className="company-info-card">
              <div className="company-info-label">Enterprise Type</div>
              <div className="company-info-value">Micro, Small and Medium Enterprise</div>
            </div>
            <div className="company-info-card">
              <div className="company-info-label">Registered Under</div>
              <div className="company-info-value">Government of India</div>
            </div>
          </div>
          <p className="company-info-description">
            DoctorXCare is officially registered with the Ministry of Micro, Small and Medium Enterprises, Government of India, ensuring compliance with national business standards and regulations.
          </p>

          <hr className="section-divider" />

          {/* §11. FINAL PROVISIONS */}
          <h4 id="term-final">§11. Final Provisions</h4>
          <p>Use of DoctorXCare involves typical risks of online services (e.g., malware, hacking, phishing). DoctorXCare takes necessary steps to secure user data but cannot guarantee absolute security.</p>
          <p>DoctorXCare may update these Terms of Service at any time. Continued use means acceptance of changes.</p>
          <p>Governing Law: These Terms are subject to the laws of India, with user protections as per local consumer law.</p>
          <p data-date="true">📅 Effective Date: September 20, 2025</p>
        </div>
      </div>
    </div>
  );
}

export default TermsOfService;