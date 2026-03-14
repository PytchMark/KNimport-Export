import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import Navbar from './components/Navbar';
import Home from './routes/Home';
import Reserve from './routes/Reserve';
import Restock from './routes/Restock';
import Availability from './routes/Availability';
import Quality from './routes/Quality';
import Contact from './routes/Contact';
import Thanks from './routes/Thanks';
import HowItWorks from './routes/HowItWorks';
import SupplyGuarantee from './routes/SupplyGuarantee';
import ProofWall from './routes/ProofWall';
import Products from './routes/Products';
import Farmers from './routes/Farmers';
import { AdminDashboard, AdminLogin } from './routes/Admin';

const logoUrl = 'https://res.cloudinary.com/dd8pjjxsm/image/upload/v1772750565/IMG-20260224-WA0029_z9koiq.jpg';

const Protected = ({ children }) => (
  localStorage.getItem('admin_token') ? children : <Navigate to="/admin" replace />
);

function Footer() {
  return (
    <footer className="border-t border-border bg-background-paper/50 py-12 mt-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={logoUrl}
                alt="K&N logo"
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div>
                <span className="font-serif font-semibold text-lg">K&N Import & Export</span>
              </div>
            </div>
            <p className="text-zinc-500 text-sm max-w-sm">
              Premium Caribbean produce wholesale distribution. Fresh fruits, vegetables, herbs, 
              and specialty foods for businesses.
            </p>
          </div>
          
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-500 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><a href="/availability" className="hover:text-white transition-colors">Availability</a></li>
              <li><a href="/reserve" className="hover:text-white transition-colors">Reserve Shipment</a></li>
              <li><a href="/restock" className="hover:text-white transition-colors">Quick Restock</a></li>
              <li><a href="/quality" className="hover:text-white transition-colors">Quality Control</a></li>
              <li><a href="/products" className="hover:text-white transition-colors">K&N Products</a></li>
              <li><a href="/farmers" className="hover:text-white transition-colors">Farmers Sign Up</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-500 mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>WhatsApp: +1 (772) 800-9570</li>
              <li>Email: orders@knimportexport.com</li>
              <li>Mon-Sat: 8:00 AM - 6:00 PM</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} K&N Import & Export. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-zinc-600">
            <a href="/quality" className="hover:text-zinc-400">Quality Standards</a>
            <a href="/supply-guarantee" className="hover:text-zinc-400">Supply Program</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Main site layout with navbar and footer
function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col app-shell">
      <Navbar />
      <a 
        href="https://wa.me/17728009570" 
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 
                   text-white font-semibold px-5 py-3 rounded-full shadow-lg shadow-green-500/25 
                   transition-all hover:scale-105 group"
        data-testid="whatsapp-floating-btn"
      >
        <MessageCircle size={22} fill="white" />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  // Admin routes - no navbar/footer
  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Protected><AdminDashboard /></Protected>} />
      </Routes>
    );
  }

  // Main site routes
  return (
    <>
      {loading && (
        <div className="loading-screen" role="status" aria-live="polite">
          <div className="loading-spinner" />
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-green-300">Loading Fresh Supply</p>
        </div>
      )}
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reserve" element={<Reserve />} />
          <Route path="/restock" element={<Restock />} />
          <Route path="/availability" element={<Availability />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/quality" element={<Quality />} />
          <Route path="/supply-guarantee" element={<SupplyGuarantee />} />
          <Route path="/proof-wall" element={<ProofWall />} />
          <Route path="/products" element={<Products />} />
          <Route path="/farmers" element={<Farmers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/thanks/:referenceId" element={<Thanks />} />
        </Routes>
      </MainLayout>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
