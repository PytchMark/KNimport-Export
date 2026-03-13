import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Truck, Shield, Leaf, Phone, Package, Clock, Sparkles } from 'lucide-react';
import { api } from '../api/client';
import MotionWall from '../components/MotionWall';
import HeroSlideshow from '../components/HeroSlideshow';

const trustPoints = [
  { icon: Leaf, text: 'Authentic Caribbean Produce' },
  { icon: Shield, text: 'Quality Control Managed' },
  { icon: Truck, text: 'Reliable Supply Partner' },
  { icon: Package, text: 'Wholesale Distribution' }
];

const steps = [
  { num: '01', title: 'Request Your Produce', desc: 'Submit reserve or restock needs from our availability board.' },
  { num: '02', title: 'Confirmation & Sourcing', desc: 'We validate supply windows, quality, and handling path.' },
  { num: '03', title: 'Secure Your Allocation', desc: 'Finalize quantities and receive offline payment instructions.' },
  { num: '04', title: 'Receive Fresh Shipment', desc: 'Container or urgent freight coordinated to your timeline.' }
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [media, setMedia] = useState([]);
  const [heroImages, setHeroImages] = useState([]);

  useEffect(() => {
    // Fetch all data in parallel
    Promise.all([
      api.inventory().catch(() => ({ items: [] })),
      api.media().catch(() => ({ assets: [] })),
      api.heroImages().catch(() => ({ images: [] }))
    ]).then(([invData, mediaData, heroData]) => {
      setInventory(invData.items || []);
      setMedia(mediaData.assets || []);
      setHeroImages(heroData.images || []);
    });
  }, []);

  const featuredItems = useMemo(() => inventory.slice(0, 4), [inventory]);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Slideshow */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 hero-glow" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
        
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div 
              className="lg:col-span-7 space-y-8"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="text-primary" size={16} />
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                  Premium Caribbean <span className="text-secondary">Wholesale</span>
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
                Fresh <span className="text-secondary">Caribbean</span>
                <span className="block text-primary">Produce.</span>
                <span className="block text-zinc-400 text-4xl md:text-5xl mt-2"><span className="text-secondary">Quality Controlled.</span> Wholesale Ready.</span>
              </h1>
              <p className="text-lg text-zinc-400 max-w-xl leading-relaxed">
                Reliable shipments of authentic Caribbean fruits, vegetables, herbs, and specialty foods — 
                sourced with strict <span className="text-secondary">Quality Control Management</span>.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/reserve" className="btn-primary inline-flex items-center gap-3" data-testid="hero-reserve-btn">
                  Reserve Next Shipment <ArrowRight size={18} />
                </Link>
                <Link to="/restock" className="btn-secondary inline-flex items-center gap-3" data-testid="hero-restock-btn">
                  Quick Restock Request
                </Link>
              </div>
            </motion.div>

            <motion.div 
              className="lg:col-span-5 relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative aspect-square glow-primary">
                <HeroSlideshow 
                  images={heroImages} 
                  autoPlayInterval={5000}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="border-y border-border bg-background-paper/50">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustPoints.map(({ icon: Icon, text }, idx) => (
              <motion.div 
                key={text}
                className="flex items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="text-primary" size={24} />
                </div>
                <span className="text-sm font-medium text-zinc-300">{text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Showcase - New Section */}
      {media.filter(m => m.category === 'quality' || m.tag === 'fresh_closeup').length > 0 && (
        <section className="py-24">
          <div className="container mx-auto px-6">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Quality First</span>
              <h2 className="text-4xl md:text-5xl font-semibold mt-4">Premium <span className="text-secondary">Quality</span> Products</h2>
              <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
                Every shipment is inspected and verified to meet our strict quality standards.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {media
                .filter(m => m.category === 'quality' || m.tag === 'fresh_closeup')
                .slice(0, 8)
                .map((asset, idx) => (
                  <motion.div
                    key={asset.id}
                    className="relative aspect-square rounded-2xl overflow-hidden group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <img 
                      src={asset.url} 
                      alt="Quality produce"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                ))
              }
            </div>
          </div>
        </section>
      )}

      {/* Motion Wall / Proof Section */}
      <section className="py-24 bg-background-paper/30">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Our Track Record</span>
            <h2 className="text-4xl md:text-5xl font-semibold mt-4">Proof of <span className="text-secondary">Supply</span>. Proof of <span className="text-secondary">Quality</span>.</h2>
          </motion.div>
          
          <MotionWall assets={media} />
          
          <div className="text-center mt-12">
            <Link to="/proof-wall" className="btn-secondary inline-flex items-center gap-2">
              View Full Gallery <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Process</span>
            <h2 className="text-4xl md:text-5xl font-semibold mt-4">How It Works</h2>
            <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
              A predictable ordering system for wholesale businesses that need consistent Caribbean produce supply.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <motion.div
                key={step.num}
                className="card-interactive"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <span className="text-6xl font-bold text-primary/20 font-serif">{step.num}</span>
                <h3 className="text-xl font-semibold mt-4 font-serif">{step.title}</h3>
                <p className="text-zinc-400 text-sm mt-2 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/how-it-works" className="btn-ghost inline-flex items-center gap-2">
              Learn More <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Availability Preview */}
      <section className="py-24 bg-background-paper/30">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Inventory</span>
              <h2 className="text-4xl md:text-5xl font-semibold mt-4">Availability Board</h2>
            </div>
            <Link to="/availability" className="btn-ghost hidden md:inline-flex items-center gap-2">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="glass-strong rounded-2xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 text-xs font-mono uppercase tracking-wider text-zinc-500">
              <div className="col-span-4">Product</div>
              <div className="col-span-3">Status</div>
              <div className="col-span-3">Quality</div>
              <div className="col-span-2">Action</div>
            </div>
            {featuredItems.length > 0 ? featuredItems.map((item, idx) => (
              <motion.div
                key={item.id}
                className="grid grid-cols-12 gap-4 px-6 py-5 border-b border-white/5 hover:bg-white/[0.02] transition-colors items-center"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="col-span-4 font-medium">{item.name}</div>
                <div className="col-span-3">
                  <span className={
                    item.status === 'available_now' ? 'badge-available' :
                    item.status === 'next_container' ? 'badge-coming' : 'badge-limited'
                  }>
                    {item.status === 'available_now' ? 'Available' :
                     item.status === 'next_container' ? 'Coming' : 'Limited'}
                  </span>
                </div>
                <div className="col-span-3 text-sm text-zinc-400">{item.quality_note || 'QCM Verified'}</div>
                <div className="col-span-2">
                  <Link to="/availability" className="text-primary text-sm hover:underline">Request</Link>
                </div>
              </motion.div>
            )) : (
              <div className="px-6 py-12 text-center text-zinc-500">
                No inventory items yet. Check back soon!
              </div>
            )}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Link to="/availability" className="btn-secondary inline-flex items-center gap-2">
              View All Availability <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Supply Guarantee Program */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Partnership</span>
              <h2 className="text-4xl md:text-5xl font-semibold mt-4">Never Run Out of <span className="text-secondary">Stock</span> Again</h2>
              <p className="text-zinc-400 mt-6 leading-relaxed">
                Businesses that reserve produce before shipment arrival receive priority allocation, 
                lower rates, and guaranteed sourcing. Join our <span className="text-secondary">Supply Guarantee Program</span>.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  'Priority allocation on upcoming containers',
                  'Lower rates for predictable recurring demand',
                  'Guaranteed sourcing planning for key items'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle className="text-secondary mt-0.5 flex-shrink-0" size={20} />
                    <span className="text-zinc-300">{item}</span>
                  </li>
                ))}
              </ul>
              <Link to="/supply-guarantee" className="btn-primary inline-flex items-center gap-3 mt-10">
                Join the Program <ArrowRight size={18} />
              </Link>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden glow-secondary">
                {media.filter(m => m.category === 'delivery' || m.tag === 'delivery').length > 0 ? (
                  <img 
                    src={media.filter(m => m.category === 'delivery' || m.tag === 'delivery')[0].url}
                    alt="Delivery operations"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1768796373344-c7d7935b2aa9?w=600&q=80" 
                    alt="Modern warehouse operations"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quality Control Preview */}
      <section className="py-24 bg-background-paper/30">
        <div className="container mx-auto px-6">
          <div className="glass-strong rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Standards</span>
                <h2 className="text-4xl md:text-5xl font-semibold mt-4">Quality Control Management</h2>
                <p className="text-zinc-400 mt-6 leading-relaxed">
                  Inspected sourcing, careful packing, spoilage prevention, and strict freshness standards. 
                  If we can't meet quality, we don't ship it.
                </p>
                <Link to="/quality" className="btn-secondary inline-flex items-center gap-2 mt-8">
                  See Our Standards <ArrowRight size={16} />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {['Sourcing', 'Handling', 'Inspection', 'Distribution'].map((item, idx) => (
                  <motion.div 
                    key={item} 
                    className="bg-white/5 rounded-xl p-5 hover:bg-white/10 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Shield className="text-primary mb-3" size={24} />
                    <h4 className="font-semibold">{item}</h4>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-semibold">Secure Your Produce Supply Today</h2>
            <p className="text-zinc-400 mt-4 max-w-xl mx-auto">
              Start building a reliable supply chain for your business with K&N Import & Export.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <Link to="/reserve" className="btn-primary inline-flex items-center gap-3" data-testid="cta-reserve-btn">
                Reserve Shipment <ArrowRight size={18} />
              </Link>
              <Link to="/restock" className="btn-secondary inline-flex items-center gap-3">
                Quick Restock
              </Link>
              <a href="https://wa.me/17728009570" className="btn-secondary inline-flex items-center gap-3">
                <Phone size={18} /> WhatsApp
              </a>
              <Link to="/farmers" className="btn-secondary inline-flex items-center gap-3">
                Become a Vetted Supplier
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
