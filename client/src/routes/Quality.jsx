import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Leaf, Package, Truck, CheckCircle, ArrowRight } from 'lucide-react';

const qcmSteps = [
  { 
    icon: Leaf, 
    title: 'Sourcing', 
    desc: 'Direct Caribbean supplier relationships with quality-first lot selection. We work with trusted farms and suppliers who share our commitment to freshness.',
    color: 'text-green-500'
  },
  { 
    icon: Package, 
    title: 'Handling', 
    desc: 'Fresh packing and handling procedures designed to preserve shelf life. Temperature-controlled storage and careful processing at every step.',
    color: 'text-blue-500'
  },
  { 
    icon: Shield, 
    title: 'Inspection', 
    desc: 'Quality checks are applied before shipment release and fulfillment confirmation. If we cannot meet our standards, we do not ship it.',
    color: 'text-primary'
  },
  { 
    icon: Truck, 
    title: 'Distribution', 
    desc: 'Balanced allocation and routing reduce spoilage and stock volatility. Smart logistics ensure your produce arrives fresh.',
    color: 'text-purple-500'
  }
];

const standards = [
  'Freshness verified at source',
  'Temperature monitoring',
  'Damage inspection',
  'Proper packaging verified',
  'Delivery timeline adherence',
  'Spoilage prevention protocols'
];

export default function Quality() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Hero */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Standards</span>
          <h1 className="text-4xl md:text-6xl font-bold mt-4">Quality Control Management</h1>
          <p className="text-zinc-400 mt-6 text-lg leading-relaxed">
            Every shipment meets strict freshness, handling, and sourcing standards before reaching its destination. 
            Our QCM process ensures you receive only the best Caribbean produce.
          </p>
        </motion.div>

        {/* QCM Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {qcmSteps.map((step, idx) => (
            <motion.div
              key={step.title}
              className="card-interactive"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6`}>
                <step.icon className={step.color} size={28} />
              </div>
              <h3 className="text-2xl font-semibold font-serif mb-3">{step.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Standards Checklist */}
        <motion.div 
          className="glass-strong rounded-3xl p-8 md:p-12 mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold font-serif mb-6">Our Quality Standards</h2>
              <p className="text-zinc-400 leading-relaxed">
                Before any produce leaves our facility, it passes through our comprehensive quality checklist. 
                This ensures consistent quality for every order, every time.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {standards.map((item, idx) => (
                <motion.div 
                  key={idx}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <CheckCircle className="text-secondary flex-shrink-0" size={20} />
                  <span className="text-sm">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Promise Section */}
        <motion.div 
          className="text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-semibold font-serif mb-4">Our Promise</h2>
          <p className="text-xl text-zinc-400 italic">
            "If we can't meet quality, we don't ship it."
          </p>
          <Link to="/reserve" className="btn-primary inline-flex items-center gap-3 mt-10">
            Reserve Your Produce Supply <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
