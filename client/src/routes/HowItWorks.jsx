import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, CheckCircle, Package, Truck } from 'lucide-react';

const steps = [
  { 
    num: '01', 
    icon: FileText,
    title: 'Request Your Produce', 
    detail: 'Submit reserve or restock needs from the availability board or request forms. Select items, quantities, and your preferred delivery timeline.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  { 
    num: '02', 
    icon: CheckCircle,
    title: 'We Confirm Sourcing & Availability', 
    detail: 'K&N validates supply windows, quality standards, and handling path. Our team reviews your request and confirms what we can fulfill.',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10'
  },
  { 
    num: '03', 
    icon: Package,
    title: 'Secure Your Allocation', 
    detail: 'Finalize your reserved quantities and receive offline payment instructions. Deposit secures your spot in the next container shipment.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  },
  { 
    num: '04', 
    icon: Truck,
    title: 'Receive Fresh Shipment', 
    detail: 'Container or urgent air freight is coordinated to your required timeline. Quality-checked produce delivered fresh to your business.',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  }
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Process</span>
          <h1 className="text-4xl md:text-6xl font-bold mt-4">How It Works</h1>
          <p className="text-zinc-400 mt-6 text-lg leading-relaxed">
            A predictable ordering system for wholesale businesses that need consistent Caribbean produce supply. 
            No shopping cart, no checkout — just reliable partnership.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto space-y-8 mb-20">
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-start"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="flex items-center gap-4 md:flex-col md:items-start">
                <div className={`w-16 h-16 rounded-2xl ${step.bgColor} flex items-center justify-center`}>
                  <step.icon className={step.color} size={32} />
                </div>
                <span className="text-5xl font-bold text-white/10 font-serif hidden md:block">{step.num}</span>
              </div>
              
              <div className="card-interactive">
                <div className="flex items-center gap-3 mb-3 md:hidden">
                  <span className="text-2xl font-bold text-primary/50 font-serif">{step.num}</span>
                </div>
                <h3 className="text-2xl font-semibold font-serif mb-3">{step.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{step.detail}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-zinc-500 mb-6">Ready to get started?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/reserve" className="btn-primary inline-flex items-center gap-2">
              Reserve Next Shipment <ArrowRight size={16} />
            </Link>
            <Link to="/availability" className="btn-secondary inline-flex items-center gap-2">
              Browse Availability
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
