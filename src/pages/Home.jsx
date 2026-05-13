import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import HeroSection from '../components/sections/HeroSection.jsx'
import AboutSection from '../components/sections/AboutSection.jsx'
import ProjectsSection from '../components/sections/ProjectsSection.jsx'
import PraktikumSection from '../components/sections/PraktikumSection.jsx'
import CertificatesSection from '../components/sections/CertificatesSection.jsx'
import ContactSection from '../components/sections/ContactSection.jsx'

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <PraktikumSection />
      <CertificatesSection />
      <ContactSection />
      <Footer />
    </div>
  )
}
