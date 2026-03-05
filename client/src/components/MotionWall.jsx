import { motion } from 'framer-motion';

export default function MotionWall({ assets = [] }) {
  // Use placeholder images if no assets
  const defaultImages = [
    { id: 1, url: 'https://images.unsplash.com/photo-1591793654079-f2a25f4635ba?w=400&q=80', tag: 'fresh_closeup' },
    { id: 2, url: 'https://images.unsplash.com/photo-1764154727059-8320ad2052f4?w=400&q=80', tag: 'product' },
    { id: 3, url: 'https://images.unsplash.com/photo-1769538515151-161dbf13a274?w=400&q=80', tag: 'product' },
    { id: 4, url: 'https://images.unsplash.com/photo-1764143914716-3524db64940e?w=400&q=80', tag: 'product' },
    { id: 5, url: 'https://images.unsplash.com/photo-1768796373344-c7d7935b2aa9?w=400&q=80', tag: 'logistics' },
    { id: 6, url: 'https://images.unsplash.com/photo-1772541224848-fe94ba571376?w=400&q=80', tag: 'logistics' }
  ];

  const displayAssets = assets.length > 0 ? assets : defaultImages;
  const doubled = [...displayAssets, ...displayAssets];

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      <motion.div 
        className="flex gap-4 py-4"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ 
          duration: 30, 
          repeat: Infinity, 
          ease: 'linear',
          repeatType: 'loop'
        }}
      >
        {doubled.map((asset, idx) => (
          <div 
            key={`${asset.id || idx}-${idx}`} 
            className="relative h-48 w-72 flex-shrink-0 overflow-hidden rounded-xl group"
          >
            <img 
              src={asset.url} 
              alt={asset.tag || 'Produce'} 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            {asset.tag && (
              <span className="absolute bottom-3 left-3 font-mono text-xs uppercase tracking-wider text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                {asset.tag.replace('_', ' ')}
              </span>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
