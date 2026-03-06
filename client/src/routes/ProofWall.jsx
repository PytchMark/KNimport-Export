import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api/client';
import { X, Play } from 'lucide-react';

const tags = [
  { key: 'all', label: 'All' },
  { key: 'groundfoods', label: 'Groundfoods' },
  { key: 'logo', label: 'Logo' },
  { key: 'qcm', label: 'QCM' },
  { key: 'products1', label: 'Products 1' },
  { key: 'products2', label: 'Products 2' }
];

const fallbackImages = [
  { id: 1, url: 'https://images.unsplash.com/photo-1591793654079-f2a25f4635ba?w=600&q=80', tag: 'groundfoods', type: 'image' },
  { id: 2, url: 'https://images.unsplash.com/photo-1764154727059-8320ad2052f4?w=600&q=80', tag: 'qcm', type: 'image' },
  { id: 3, url: 'https://images.unsplash.com/photo-1769538515151-161dbf13a274?w=600&q=80', tag: 'products1', type: 'image' },
  { id: 4, url: 'https://images.unsplash.com/photo-1764143914716-3524db64940e?w=600&q=80', tag: 'products2', type: 'image' }
];

export default function ProofWall() {
  const [assets, setAssets] = useState([]);
  const [tag, setTag] = useState('all');
  const [lightbox, setLightbox] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const cloudinaryAssets = await api.gallery(['groundfoods', 'logo', 'qcm', 'products1', 'products2']);
        if ((cloudinaryAssets.assets || []).length > 0) {
          setAssets(cloudinaryAssets.assets);
          return;
        }

        const mediaAssets = await api.media();
        setAssets((mediaAssets.assets || []).length > 0 ? mediaAssets.assets : fallbackImages);
      } catch (_error) {
        setAssets(fallbackImages);
      } finally {
        setLoading(false);
      }
    };

    loadGallery();
  }, []);

  const filtered = useMemo(
    () => (tag === 'all' ? assets : assets.filter((asset) => asset.tag === tag || asset.tags?.includes(tag))),
    [assets, tag]
  );

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Gallery</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-4">Proof Wall</h1>
          <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
            Browse our visual story by tag — from groundfoods and QCM inspections to branded materials and product rollouts.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {tags.map((t) => (
            <button
              key={t.key}
              onClick={() => setTag(t.key)}
              className={`px-4 py-2 rounded-full text-sm transition-colors border ${
                tag === t.key
                  ? 'bg-green-500/20 text-green-300 border-green-500/50'
                  : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-zinc-500">Loading gallery...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">No assets found in this tag yet.</div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((asset, idx) => (
              <motion.button
                key={asset.id || asset.public_id || `${asset.url}-${idx}`}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                onClick={() => setLightbox(asset)}
                className="card-interactive text-left"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                  {asset.type === 'video' ? (
                    <>
                      <video src={asset.url} className="w-full h-full object-cover" muted />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play className="text-white" size={30} />
                      </div>
                    </>
                  ) : (
                    <img src={asset.url} alt={asset.tag || 'Gallery'} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="pt-4 text-sm text-zinc-300 uppercase tracking-wider">{asset.tag || 'gallery'}</div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>

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
                <video src={lightbox.url} className="max-w-full max-h-[90vh] rounded-lg" controls autoPlay />
              ) : (
                <img src={lightbox.url} alt={lightbox.tag || 'Gallery'} className="max-w-full max-h-[90vh] object-contain rounded-lg" />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
