import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, MessageCircle, ArrowRight, Phone } from 'lucide-react';

export default function Thanks() {
  const { referenceId } = useParams();
  const whatsappMsg = encodeURIComponent(`Hi K&N, I just submitted request ${referenceId}. Looking forward to your confirmation.`);

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center">
      <div className="container mx-auto px-6">
        <motion.div 
          className="max-w-xl mx-auto text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <CheckCircle className="text-secondary" size={40} />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold">Thank You!</h1>
          <p className="text-xl text-zinc-300 mt-4">Your request has been received.</p>
          
          <motion.div 
            className="glass-strong rounded-2xl p-6 mt-10 text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-zinc-400 text-sm">Reference ID</span>
              <span className="font-mono text-primary font-bold text-lg">{referenceId}</span>
            </div>
            <p className="text-zinc-400 text-sm">
              Our team will confirm availability and send next steps within <strong className="text-white">24 hours</strong>.
            </p>
          </motion.div>

          <motion.div 
            className="mt-8 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-zinc-500 text-sm mb-4">Want faster confirmation?</p>
            <a 
              href={`https://wa.me/18760000000?text=${whatsappMsg}`}
              className="btn-secondary w-full flex items-center justify-center gap-3"
              data-testid="whatsapp-followup-btn"
            >
              <MessageCircle size={20} /> Send WhatsApp with Reference
            </a>
            <a 
              href="tel:+18760000000"
              className="btn-ghost w-full flex items-center justify-center gap-3"
            >
              <Phone size={18} /> Call Us Directly
            </a>
          </motion.div>

          <motion.div 
            className="mt-12 pt-8 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link to="/" className="btn-ghost inline-flex items-center gap-2">
              Back to Home <ArrowRight size={16} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
