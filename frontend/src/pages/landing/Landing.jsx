import Navbar from '../../components/landing/Navbar'
import Hero from '../../components/landing/Hero'
import HowItWorks from '../../components/landing/HowItWorks'
import Features from '../../components/landing/Features'
import WhoItsFor from '../../components/landing/WhoItsFor'
import Footer from '../../components/landing/Footer'

function Landing() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <WhoItsFor />
      <Footer />
    </div>
  )
}

export default Landing