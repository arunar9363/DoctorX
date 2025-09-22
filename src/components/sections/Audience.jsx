import "../../styles/Audience.css";

function Audience() {
  return (
    <section className="audience">
      <div className="container">
        <h2>Support for Every Stage of Life</h2>

        <div className="audience-rows">
          {/* Row 1: Text Left, Image Right */}
          <div className="audience-row" id="audience-row-1">
            <div className="audience-card">
              <div className="content-wrapper">
                <h3>Individuals</h3>
                <ul>
                  <li>Personal symptom checker for your specific health concerns.</li>
                  <li>Access a comprehensive library of medically-vetted health conditions.</li>
                  <li>Receive clear recommendations for self-care or seeing a doctor.</li>
                  <li>Medical information explained in simple, everyday language.</li>
                  <li>Track your health journey and understand your body better.</li>
                </ul>
              </div>
              <div className="image-wrapper">
                <img src="/assets/wtt-1.svg" alt="Individuals" />
              </div>
            </div>
          </div>

          {/* Row 2: Image Left, Text Right */}
          <div className="audience-row" id="audience-row-2">
            <div className="audience-card">
              <div className="image-wrapper">
                <img src="/assets/wtt-2.svg" alt="Parents" />
              </div>
              <div className="content-wrapper">
                <h3>Parents</h3>
                <ul>
                  <li>Specialized guidance for your child's symptoms and illnesses.</li>
                  <li>Understand when to seek immediate care with our child safety protocols.</li>
                  <li>Explore a pediatric-focused database of common childhood conditions.</li>
                  <li>Age-appropriate analysis from newborns to teenagers.</li>
                  <li>Get actionable tips for home care and keeping your family healthy.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Row 3: Text Left, Image Right */}
          <div className="audience-row" id="audience-row-3">
            <div className="audience-card">
              <div className="content-wrapper">
                <h3>Family Members</h3>
                <ul>
                  <li>Use our symptom checker on behalf of a loved one with third-person mode.</li>
                  <li>Help coordinate care with easy-to-share health summaries.</li>
                  <li>Gain a deeper understanding of their diagnosis and treatment options.</li>
                  <li>Access dedicated tools and resources for caregiver support.</li>
                  <li>Emergency contact features</li>
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