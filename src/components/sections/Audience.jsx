import "../../styles/Audience.css";

function Audience() {
  return (
    <section className="audience">
      <div className="container">
        <h2>Support for Every Stage of Life</h2>

        <div className="audience-rows">
          {/* Row 1: INDIVIDUALS - Focus on Self-Empowerment & Privacy */}
          <div className="audience-row" id="audience-row-1">
            <div className="audience-card">
              <div className="content-wrapper">
                <h3>For Individuals</h3>
                <ul>
                  <li><strong>Instant Analysis:</strong> Check your symptoms privately with clinical-grade AI.</li>
                  <li><strong>Verified Knowledge:</strong> Access a library of medically reviewed health conditions.</li>
                  <li><strong>Actionable Advice:</strong> Know exactly whether to see a doctor or treat at home.</li>
                  <li><strong>Health Mastery:</strong> Understand medical terms in simple, clear language.</li>
                  <li><strong>24/7 Access:</strong> Get answers anytime, without waiting for an appointment.</li>
                </ul>
              </div>
              <div className="image-wrapper">
                <img src="/assets/wtt-1.svg" alt="Individuals" />
              </div>
            </div>
          </div>

          {/* Row 2: PARENTS - Focus on Child Safety & Peace of Mind */}
          <div className="audience-row" id="audience-row-2">
            <div className="audience-card">
              <div className="image-wrapper">
                <img src="/assets/wtt-2.svg" alt="Parents" />
              </div>
              <div className="content-wrapper">
                <h3>For Parents</h3>
                <ul>
                  <li><strong>Pediatric Focus:</strong> Symptom checks tailored specifically for children and infants.</li>
                  <li><strong>Urgency Detection:</strong> instantly understand if your child needs emergency care.</li>
                  <li><strong>Age-Smart:</strong> Accurate analysis adapted for newborns, toddlers, and teens.</li>
                  <li><strong>Home Relief:</strong> Safe, doctor-approved tips to manage fevers and minor ailments.</li>
                  <li><strong>Peace of Mind:</strong> Reduce anxiety with reliable guidance day or night.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Row 3: CAREGIVERS - Focus on Supporting Loved Ones */}
          <div className="audience-row" id="audience-row-3">
            <div className="audience-card">
              <div className="content-wrapper">
                <h3>For Caregivers</h3>
                <ul>
                  <li><strong>Remote Assessment:</strong> Check symptoms on behalf of parents or partners.</li>
                  <li><strong>Decision Support:</strong> Validate your concerns before rushing to the hospital.</li>
                  <li><strong>Care Coordination:</strong> Easily explain symptoms to doctors using generated reports.</li>
                  <li><strong>Elderly Care:</strong> Specialized insights for age-related health conditions.</li>
                  <li><strong>Emergency Prep:</strong> Quick access to triage advice when every second counts.</li>
                </ul>
              </div>
              <div className="image-wrapper">
                <img src="/assets/wtt-3.svg" alt="Family members" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Audience;