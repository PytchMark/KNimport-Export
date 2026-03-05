import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import StepForm from '../components/StepForm';
import { Package } from 'lucide-react';

export default function Reserve() {
  const { state } = useLocation();
  
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Package className="text-primary" size={32} />
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Pre-Order</span>
            <h1 className="text-4xl md:text-5xl font-bold mt-2">Reserve Your Shipment</h1>
            <p className="text-zinc-400 mt-4 max-w-xl mx-auto">
              Secure fresh Caribbean produce before it arrives. Guaranteed allocation for businesses 
              that plan ahead.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StepForm type="reserve" initialItems={state?.prefillItems || []} />
          </motion.div>

          <motion.p 
            className="text-center text-zinc-500 text-sm mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            After submission, our team will confirm availability and send next steps within 24 hours.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
