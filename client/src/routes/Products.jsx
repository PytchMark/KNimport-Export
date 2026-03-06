import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { api } from '../api/client';

const productTags = ['products1', 'products2'];

const productCopy = {
  products1: {
    title: 'Roasted Breadfruit Slices',
    description: 'Crisp, roasted breadfruit slices crafted for retail and food service channels.',
    badge: 'K&N Product Line'
  },
  products2: {
    title: 'Cocktail Bammy',
    description: 'Our own cocktail bammy line designed for convenience, consistency, and authentic taste.',
    badge: 'Now Rolling Out'
  }
};

export default function Products() {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    api.gallery(productTags)
      .then((data) => setAssets(data.assets || []))
      .catch(() => setAssets([]));
  }, []);

  const groupedAssets = useMemo(() => {
    return productTags.reduce((acc, tag) => {
      acc[tag] = assets.filter((asset) => asset.tag === tag || asset.tags?.includes(tag));
      return acc;
    }, {});
  }, [assets]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">K&N Products</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-4">Our Branded <span className="text-secondary">Product Line</span></h1>
          <p className="text-zinc-400 mt-5 leading-relaxed">
            We are expanding with our own K&N products. Current launch focus includes <span className="text-secondary">cocktail bammy</span> and <span className="text-secondary">roasted breadfruit slices</span>, with more to come.
          </p>
        </div>

        <div className="mt-12 space-y-14">
          {productTags.map((tag) => {
            const copy = productCopy[tag];
            const images = groupedAssets[tag] || [];

            return (
              <section key={tag} className="card">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <p className="inline-flex rounded-full border border-green-500/40 bg-green-500/10 text-green-300 px-3 py-1 text-xs uppercase tracking-[0.2em]">
                      {copy.badge}
                    </p>
                    <h2 className="text-2xl md:text-3xl font-semibold mt-4">{copy.title}</h2>
                    <p className="text-zinc-400 mt-3 max-w-2xl">{copy.description}</p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.3em] text-zinc-500">Tag: {tag}</span>
                </div>

                {images.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.map((asset) => (
                      <div key={asset.id || asset.public_id || asset.url} className="overflow-hidden rounded-2xl border border-green-500/20">
                        <img src={asset.url} alt={copy.title} className="w-full h-56 object-cover" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-green-500/30 bg-green-500/5 p-8 text-zinc-400">
                    Product visuals for <strong>{tag}</strong> will appear here as your tagged Cloudinary gallery grows.
                  </div>
                )}
              </section>
            );
          })}
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link to="/reserve" className="btn-primary inline-flex items-center gap-2">
            Reserve Upcoming Products <ArrowRight size={16} />
          </Link>
          <Link to="/proof-wall" className="btn-secondary inline-flex items-center gap-2">
            View Full Gallery
          </Link>
        </div>
      </div>
    </div>
  );
}
