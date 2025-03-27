import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ExteriorPainting from './pages/services/ExteriorPainting';
import InteriorPainting from './pages/services/InteriorPainting';
import CommercialPainting from './pages/services/CommercialPainting';
import DeckStaining from './pages/services/DeckStaining';
import PowerWashing from './pages/services/PowerWashing';
import Testimonials from './pages/Testimonials';
import Gallery from './pages/Gallery';
import Licensing from './pages/Licensing';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/exterior" element={<ExteriorPainting />} />
          <Route path="/services/interior" element={<InteriorPainting />} />
          <Route path="/services/commercial" element={<CommercialPainting />} />
          <Route path="/services/deck" element={<DeckStaining />} />
          <Route path="/services/power-washing" element={<PowerWashing />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/licensing" element={<Licensing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;