import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api/client';
import { X, Play } from 'lucide-react';

const tags = [
  { key: 'all', label: 'All' },
  { key: 'delivery', label: 'Delivery' },
  { key: 'shelf_stock', label: 'Shelf Stock' },
  { key: 'fresh_closeup', label: 'Fresh Produce' },
  { key: 'container_day', label: 'Container Day' }
];

const defaultImages = [
  { id: 1, url: 'https://images.unsplash.com/photo-1591793654079-f2a25f4635ba?w=600&q=80', tag: 'fresh_closeup', type: 'image' },
  { id: 2, url: 'https://images.unsplash.com/photo-1764154727059-8320ad2052f4?w=600&q=80', tag: 'fresh_closeup', type: 'image' },
  { id: 3, url: 'https://images.unsplash.com/photo-1769538515151-161dbf13a274?w=600&q=80', tag: 'fresh_closeup', type: 'image' },
  { id: 4, url: 'https://images.unsplash.com/photo-1764143914716-3524db64940e?w=600&q=80', tag: 'fresh_closeup', type: 'image' },
  { id: 5, url: 'https://images.unsplash.com/photo-1768796373344-c7d7935b2aa9?w=600&q=80', tag: 'delivery', type: 'image' },
  { id: 6, url: 'https://images.unsplash.com/photo-1772541224848-fe94ba571376?w=600&q=80', tag: 'container_day', type: 'image' },
  { id: 7, url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80', tag: 'shelf_stock', type: 'image' },
  { id: 8, url: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=600&q=80', tag: 'fresh_closeup', type: 'image' }
];

export default function ProofWall() {
  const [assets, setAssets] = useState([]);
  const [tag, setTag] = useState('all');
  const [lightbox, setLightbox] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.media().then((d) => {
      const mediaAssets = d.assets || [];
      setAssets(mediaAssets.length > 0 ? mediaAssets : defaultImages);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => 
    tag === 'all' ? assets : assets.filter((x) => x.tag === tag), 
    [assets, tag]
  );

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Gallery</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-4">Proof Wall</h1>
          <p className="text-zinc-400 mt-4">
            Proof of Supply. Proof of Quality. Real deliveries, real produce, real results.
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {tags.map((t) => (
            <button
              key={t.key}
              onClick={() => setTag(t.key)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                tag === t.key 
                  ? 'bg-primary text-black' 
                  : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
              }`}
              data-testid={`filter-${t.key}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <motion.div 
          className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((asset, idx) => (
              <motion.div
                key={asset.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.03 }}
                className="relative break-inside-avoid group cursor-pointer"
                onClick={() => setLightbox(asset)}
              >
                <div className="overflow-hidden rounded-2xl">
                  {asset.type === 'video' ? (
                    <div className="relative aspect-video bg-zinc-900">
                      <video 
                        src={asset.url} 
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Play className="text-white" size={24} fill="white" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img 
                      src={asset.url} 
                      alt={asset.tag || 'Produce'} 
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="font-mono text-xs uppercase tracking-wider text-white/80">
                      {asset.tag?.replace('_', ' ') || 'Produce'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && !loading && (
          <div className="text-center py-20">
            <p className="text-zinc-500">No images in this category yet.</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6"
            onClick={() => setLightbox(null)}
          >
            <button 
              className="absolute top-6 right-6 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
              onClick={() => setLightbox(null)}
            >
              <X size={24} />
            </button>
            
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-5xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {lightbox.type === 'video' ? (
                <video 
                  src={lightbox.url} 
                  className="max-w-full max-h-[90vh] rounded-lg"
                  controls
                  autoPlay
                />
              ) : (
                <img 
                  src={lightbox.url} 
                  alt={lightbox.tag || 'Produce'} 
                  className="max-w-full max-h-[90vh] object-contain rounded-lg"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
