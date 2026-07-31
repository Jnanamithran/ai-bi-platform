import Navbar from './Navbar'
import Hero from './Hero'
import HowItWorks from './HowItWorks'
import Features from './Features'
import Pricing from './WhoItsFor'
import Footer from './Footer'

function Landing() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Pricing />
      <Footer />
    </div>
  )
}

export default Landing