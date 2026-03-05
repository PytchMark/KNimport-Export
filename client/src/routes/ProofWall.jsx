import { useEffect, useMemo, useState } from 'react';
import MotionWall from '../components/MotionWall';
import { api } from '../api/client';

const tags = ['all', 'delivery', 'shelf_stock', 'fresh_closeup', 'container_day'];

export default function ProofWall() {
  const [assets, setAssets] = useState([]);
  const [tag, setTag] = useState('all');

  useEffect(() => {
    api.media().then((d) => setAssets(d.assets || []));
  }, []);

  const filtered = useMemo(() => (tag === 'all' ? assets : assets.filter((x) => x.tag === tag)), [assets, tag]);

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">Proof Wall</h1>
      <p className="text-sm text-slate-300">Proof of Supply. Proof of Quality.</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <button key={t} className={`rounded-full px-3 py-1 text-sm ${tag === t ? 'bg-emerald-500' : 'glass'}`} onClick={() => setTag(t)}>
            {t}
          </button>
        ))}
      </div>
      <MotionWall assets={filtered} />
    </div>
  );
}
