import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import WhatsAppButton from './components/WhatsAppButton/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import HomePage from './pages/Home/HomePage';
import AboutPage from './pages/About/AboutPage';
import ProductsPage from './pages/Products/ProductsPage';


import PurchaseOrderPage from './pages/PurchaseOrder/PurchaseOrderPage';
import UpdatePasswordPage from './pages/UpdatePassword/UpdatePasswordPage';

function ScrollToTopOnNav() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

function AppLayout() {
  return (
    <>
      <ScrollToTopOnNav />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/order" element={<PurchaseOrderPage />} />

          <Route path="/update-password" element={<UpdatePasswordPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
