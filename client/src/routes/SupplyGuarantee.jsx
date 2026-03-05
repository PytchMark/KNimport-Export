import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Shield, TrendingDown, Calendar, Star } from 'lucide-react';

const benefits = [
  { 
    icon: Calendar, 
    title: 'Priority Allocation', 
    desc: 'Reserved space on upcoming containers means your order ships first.' 
  },
  { 
    icon: TrendingDown, 
    title: 'Lower Rates', 
    desc: 'Predictable, recurring orders qualify for wholesale partnership pricing.' 
  },
  { 
    icon: Shield, 
    title: 'Guaranteed Sourcing', 
    desc: 'We plan your key items into our sourcing calendar ahead of time.' 
  },
  { 
    icon: Star, 
    title: 'VIP Support', 
    desc: 'Dedicated account support and priority response for program members.' 
  }
];

const process = [
  'Submit your regular produce needs',
  'We analyze your demand pattern',
  'Lock in recurring allocation',
  'Receive consistent shipments'
];

export default function SupplyGuarantee() {
  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Hero */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-secondary">Partnership Program</span>
          <h1 className="text-4xl md:text-6xl font-bold mt-4">Supply Guarantee Program</h1>
          <p className="text-zinc-400 mt-6 text-lg leading-relaxed">
            Never run out of stock again. Reserve before shipment arrival and operate with predictable 
            inventory confidence. Built for businesses that plan ahead.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {benefits.map((benefit, idx) => (
            <motion.div
              key={benefit.title}
              className="card-interactive"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
                <benefit.icon className="text-secondary" size={28} />
              </div>
              <h3 className="text-xl font-semibold font-serif mb-3">{benefit.title}</h3>
              <p className="text-zinc-400">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* How to Join */}
        <motion.div 
          className="glass-strong rounded-3xl p-8 md:p-12 mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold font-serif mb-6">How to Join</h2>
              <p className="text-zinc-400 leading-relaxed mb-8">
                Joining the Supply Guarantee Program is simple. Start by submitting a reserve request 
                and indicate your interest in recurring orders. Our team will reach out to discuss 
                your needs and set up your allocation schedule.
              </p>
              <Link to="/reserve" className="btn-primary inline-flex items-center gap-2">
                Start Reserve Request <ArrowRight size={16} />
              </Link>
            </div>
            
            <div className="space-y-4">
              {process.map((step, idx) => (
                <motion.div 
                  key={idx}
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-secondary font-bold">{idx + 1}</span>
                  </div>
                  <span className="text-zinc-300">{step}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Testimonial / Social Proof */}
        <motion.div 
          className="text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="glass-strong rounded-2xl p-8">
            <p className="text-xl italic text-zinc-300 leading-relaxed">
              "Since joining the Supply Guarantee Program, we haven't missed a single delivery. 
              Our inventory planning has never been easier."
            </p>
            <p className="text-zinc-500 mt-4 text-sm">— Wholesale Partner, Kingston</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
