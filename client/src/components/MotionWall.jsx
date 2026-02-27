import { motion } from 'framer-motion';

export default function MotionWall({ assets = [] }) {
  const doubled = [...assets, ...assets];
  return (
    <div className="overflow-hidden rounded-3xl border border-white/20 p-3">
      <motion.div className="flex gap-4" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
        {doubled.map((asset, idx) => (
          <div key={`${asset.id || idx}-${idx}`} className="h-28 w-40 shrink-0 overflow-hidden rounded-xl bg-slate-800">
            <img src={asset.url} alt={asset.tag} className="h-full w-full object-cover" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
