import { Menu, X, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  ['Availability', '/availability'],
  ['Reserve', '/reserve'],
  ['Quick Restock', '/restock'],
  ['Quality', '/quality'],
  ['K&N Products', '/products'],
  ['Proof Wall', '/proof-wall'],
  ['Contact', '/contact']
];

const logoUrl = 'https://res.cloudinary.com/dd8pjjxsm/image/upload/v1772750565/IMG-20260224-WA0029_z9koiq.jpg';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location]);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-background/80 backdrop-blur-xl border-b border-border' : ''
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" data-testid="nav-logo">
            <img
              src={logoUrl}
              alt="K&N logo"
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div className="hidden sm:block">
              <span className="font-serif font-semibold text-lg">K&N Import</span>
              <span className="font-mono text-xs text-zinc-500 block tracking-wider">& EXPORT</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map(([label, href]) => (
              <Link 
                key={href} 
                to={href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === href 
                    ? 'text-primary bg-primary/10' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
                data-testid={`nav-link-${label.toLowerCase().replace(' ', '-')}`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link 
              to="/reserve" 
              className="btn-primary !py-3 !px-6 text-xs"
              data-testid="nav-reserve-btn"
            >
              Reserve Shipment
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 -mr-2 text-zinc-400 hover:text-white"
            onClick={() => setOpen(!open)}
            data-testid="mobile-menu-toggle"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background-paper border-b border-border overflow-hidden"
          >
            <div className="container mx-auto px-6 py-6 space-y-2">
              {links.map(([label, href]) => (
                <Link 
                  key={href} 
                  to={href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                    location.pathname === href 
                      ? 'text-primary bg-primary/10' 
                      : 'text-zinc-300 hover:bg-white/5'
                  }`}
                >
                  <span className="font-medium">{label}</span>
                  <ChevronRight size={18} className="text-zinc-500" />
                </Link>
              ))}
              <div className="pt-4 border-t border-border mt-4">
                <Link 
                  to="/reserve" 
                  className="btn-primary w-full text-center"
                >
                  Reserve Shipment
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
