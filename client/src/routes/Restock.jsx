import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import StepForm from '../components/StepForm';
import { Zap } from 'lucide-react';

export default function Restock() {
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
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <Zap className="text-accent" size={32} />
            </div>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Urgent</span>
            <h1 className="text-4xl md:text-5xl font-bold mt-2">Quick Restock Request</h1>
            <p className="text-zinc-400 mt-4 max-w-xl mx-auto">
              Need produce quickly? Send your urgent requirements and we'll coordinate 
              the fastest route to restock your inventory.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StepForm type="restock" initialItems={state?.prefillItems || []} />
          </motion.div>

          <motion.p 
            className="text-center text-zinc-500 text-sm mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            For immediate assistance, call us directly or use WhatsApp for faster response.
          </motion.p>
        </div>
      </div>
    </div>
  );
}
