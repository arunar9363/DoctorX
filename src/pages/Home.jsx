import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Audience from "../components/sections/Audience";
import TermsOfService from "./TermsOfService";
import ContactPage from "./ContactUsPage";

function Home() {
  return (
    <>
      <Hero />
      <Audience />
      <ContactPage />
    </>
  );
}

export default Home;
