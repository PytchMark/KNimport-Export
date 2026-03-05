import { motion } from 'framer-motion';
import { Phone, Mail, Clock, MapPin, MessageCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const contactMethods = [
  { icon: MessageCircle, label: 'WhatsApp', value: '+1 (876) 000-0000', href: 'https://wa.me/18760000000', color: 'text-green-500' },
  { icon: Phone, label: 'Phone', value: '+1 (876) 000-0000', href: 'tel:+18760000000', color: 'text-blue-500' },
  { icon: Mail, label: 'Email', value: 'orders@knimportexport.com', href: 'mailto:orders@knimportexport.com', color: 'text-primary' }
];

export default function Contact() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Get in Touch</span>
            <h1 className="text-4xl md:text-5xl font-bold mt-4">Contact K&N</h1>
            <p className="text-zinc-400 mt-4 max-w-xl mx-auto">
              Tell us what you need and we'll route you to reserve allocation or urgent restock support.
            </p>
          </motion.div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {contactMethods.map((method, idx) => (
              <motion.a
                key={method.label}
                href={method.href}
                className="card-interactive text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                data-testid={`contact-${method.label.toLowerCase()}`}
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <method.icon className={method.color} size={28} />
                </div>
                <p className="font-mono text-xs uppercase tracking-wider text-zinc-500 mb-2">{method.label}</p>
                <p className="font-medium">{method.value}</p>
              </motion.a>
            ))}
          </div>

          {/* Info Section */}
          <motion.div 
            className="glass-strong rounded-2xl p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="text-primary" size={20} />
                  <h3 className="font-semibold">Business Hours</h3>
                </div>
                <div className="space-y-2 text-zinc-400 text-sm">
                  <p>Monday - Saturday: 8:00 AM - 6:00 PM</p>
                  <p>Sunday: Closed</p>
                  <p className="text-xs text-zinc-500 mt-4">* WhatsApp messages monitored 24/7</p>
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="text-primary" size={20} />
                  <h3 className="font-semibold">Location</h3>
                </div>
                <p className="text-zinc-400 text-sm">
                  Serving businesses across Jamaica and international markets. 
                  Contact us for shipping arrangements to your location.
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-zinc-500 mb-6">Ready to place an order?</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/reserve" className="btn-primary inline-flex items-center gap-2">
                Reserve Shipment <ArrowRight size={16} />
              </Link>
              <Link to="/restock" className="btn-secondary inline-flex items-center gap-2">
                Quick Restock Request
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
