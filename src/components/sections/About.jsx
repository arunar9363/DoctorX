import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ScrollSpy from "bootstrap/js/dist/scrollspy";
import '../../styles/About.css';

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
        <h2 className="mb-4">About DoctorX</h2>
        <div className="row">
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
              <h4 id="company-overview"> Overview</h4>
              <p>DoctorX is a leading digital health information platform that revolutionizes how individuals understand and manage their health concerns. Founded with the vision of democratizing healthcare information, we bridge the gap between medical expertise and public accessibility through innovative technology solutions.</p>
              <p>Our platform serves as a comprehensive digital health companion, utilizing advanced algorithms and evidence-based medical knowledge to provide users with reliable, accurate, and actionable health insights. DoctorX is committed to empowering individuals worldwide to make informed decisions about their health and wellness.</p>

              {/* MISSION & VISION */}
              <h4 id="mission-vision">Mission & Vision</h4>
              <p><strong>Our Mission:</strong> To empower individuals globally by providing accessible, accurate, and reliable health information that enables informed healthcare decisions. We strive to make quality health insights available anytime, anywhere, while maintaining the highest standards of privacy, security, and medical accuracy.</p>
              <p><strong>Our Mission:</strong> To empower individuals to understand their health concerns with clarity and confidence. We provide the initial knowledge that allows our users to make informed decisions, guiding them on whether to manage their condition at home or to seek professional medical help.</p>
              <p><strong>Our Vision:</strong> To create a future where healthcare is demystified and accessible to all. We envision a world where every person can confidently take the first step in understanding their health, leading to better outcomes and more effective collaboration with medical professionals.</p>
              <p><strong>Core Values:</strong> Our work is guided by a deep commitment to <strong>Trust</strong>, <strong>Accuracy</strong>, and <strong>Accessibility</strong>. We champion <strong>Patient-Centered Care</strong>, rigorously protect user <strong>Privacy</strong>, and drive <strong>Innovation</strong> in everything we do.</p>

              {/* OUR SERVICES */}
              <h4 id="our-services">Our Services</h4>
              <p><strong>Symptom Analysis Engine:</strong> Our flagship service provides users with an interactive, AI-powered symptom assessment tool. Users can input their symptoms to receive detailed explanations of possible health conditions, along with clear guidance on appropriate next steps and recommendations.</p>
              <p><strong>Disease Information Library:</strong> A vast repository of medically reviewed articles and educational content covering a wide range of health conditions. This library is continuously updated with the latest health news and advisories from the <strong>World Health Organization (WHO)</strong>, providing a reliable and current resource for your health information needs.</p>
              <p><strong>Health Risk Assessment:</strong> Proactive tools that provide personalized risk evaluations. By analyzing lifestyle factors, family history, and current health data, these assessments help users understand their predisposition to various conditions and empower them to take preventive action.</p>
              <p>All services are designed for educational and informational purposes only and are <strong>not a substitute</strong> for professional medical consultation, diagnosis, or treatment.</p>

              {/* IMPACT NUMBERS */}
              <h4 id="impact-numbers">Our Impact in Numbers</h4>
              <div className="impact-stats-grid">
                <div className="stat-item">
                  <h5>720+</h5>
                  <p>Hours of medical research and platform development invested to ensure accuracy and reliability</p>
                </div>
                <div className="stat-item">
                  <h5>***K+</h5>
                  <p>Symptom assessments completed by users worldwide, helping individuals better understand their health concerns</p>
                </div>
                <div className="stat-item">
                  <h5>******+</h5>
                  <p>Monthly active users receiving health guidance and information through our platform</p>
                </div>
                <div className="stat-item">
                  <h5>**%</h5>
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
              <p data-warning="true"><strong>Important Regulatory Notice:</strong> DoctorX is an informational tool for educational purposes and is <strong>not a licensed medical device</strong> in any jurisdiction. It is not intended to provide a medical diagnosis.</p>
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
              <p data-contact="true">We value your input. To provide <strong>feedback</strong> or ask a question, please visit our <a href="/contact">Contact/Feedback Page</a>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;