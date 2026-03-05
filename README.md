# K&N Import & Export — Wholesale Request Platform

Production-ready, mobile-first lead-gen + request management app for Caribbean produce distribution.

## Stack
- **Frontend:** React + Vite + Tailwind + Framer Motion + Lucide
- **Backend:** Node.js + Express + Supabase
- **Media:** Cloudinary URLs (MVP supports URL entry)
- **Deploy:** Docker + Cloud Run

## Project structure
```
/
  client/
    index.html
    src/
      main.jsx
      App.jsx
      routes/
      components/
      styles/
      lib/
      api/
    tailwind.config.js
    postcss.config.js
    vite.config.js

  server/
    server.js
    routes/
    middleware/
    services/
      supabase.js
    utils/

  supabase/
    migrations/
      001_init.sql

  Dockerfile
  .dockerignore
  package.json
  README.md
```

## Environment Variables

### Server
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CLOUDINARY_CLOUD_NAME` (optional)
- `CLOUDINARY_API_KEY` (optional)
- `CLOUDINARY_API_SECRET` (optional)
- `ADMIN_EMAIL_ALLOWLIST` (optional comma-separated)
- `PORT` (Cloud Run provides this)

### Client (Vite)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Scripts
- `npm install`
- `npm run dev` — runs API + frontend
- `npm run build` — builds Vite app
- `npm start` — serves API + built frontend from Express

## Supabase setup
1. Run migration in `supabase/migrations/001_init.sql`.
2. Create admin users via Supabase Auth.
3. Optionally set `ADMIN_EMAIL_ALLOWLIST` for admin API gating.

## Seed SQL (12 inventory + 12 media)
```sql
insert into inventory_items (name, category, status, quality_note, unit_label, featured, image_url)
values
('Mango East Indian', 'fruits', 'available_now', 'Bright skin, export sorted', 'per box', true, 'https://picsum.photos/seed/mango/600/400'),
('Soursop', 'fruits', 'available_now', 'Firm flesh, low bruising', 'per lb', false, 'https://picsum.photos/seed/soursop/600/400'),
('Pineapple MD2', 'fruits', 'next_container', 'Brix tested lot', 'per box', true, 'https://picsum.photos/seed/pineapple/600/400'),
('Green Banana', 'fruits', 'next_container', 'Chef grade size sorting', 'per case', false, 'https://picsum.photos/seed/banana/600/400'),
('Callaloo', 'veg', 'available_now', 'Cold chain packed', 'per bundle', false, 'https://picsum.photos/seed/callaloo/600/400'),
('Cho Cho', 'veg', 'seasonal_limited', 'Limited hillside crop', 'per crate', false, 'https://picsum.photos/seed/chocho/600/400'),
('Scotch Bonnet', 'spices', 'available_now', 'Heat consistency scored', 'per lb', true, 'https://picsum.photos/seed/scotch/600/400'),
('Pimento', 'spices', 'next_container', 'Aroma-forward batch', 'per bag', false, 'https://picsum.photos/seed/pimento/600/400'),
('Thyme', 'herbs', 'available_now', 'Fresh cut same-day chill', 'per bunch', false, 'https://picsum.photos/seed/thyme/600/400'),
('Ginger', 'spices', 'next_container', 'Hand-selected maturity', 'per lb', false, 'https://picsum.photos/seed/ginger/600/400'),
('Turmeric', 'spices', 'seasonal_limited', 'Deep color rhizomes', 'per lb', false, 'https://picsum.photos/seed/turmeric/600/400'),
('Breadfruit', 'fruits', 'seasonal_limited', 'Request-only allocation', 'per crate', true, 'https://picsum.photos/seed/breadfruit/600/400');

insert into media_assets (type, url, tag, featured)
values
('image','https://picsum.photos/seed/delivery1/800/600','delivery',true),
('image','https://picsum.photos/seed/delivery2/800/600','delivery',false),
('image','https://picsum.photos/seed/shelf1/800/600','shelf_stock',true),
('image','https://picsum.photos/seed/shelf2/800/600','shelf_stock',false),
('image','https://picsum.photos/seed/fresh1/800/600','fresh_closeup',true),
('image','https://picsum.photos/seed/fresh2/800/600','fresh_closeup',false),
('image','https://picsum.photos/seed/container1/800/600','container_day',true),
('image','https://picsum.photos/seed/container2/800/600','container_day',false),
('video','https://samplelib.com/lib/preview/mp4/sample-5s.mp4','delivery',false),
('video','https://samplelib.com/lib/preview/mp4/sample-5s.mp4','shelf_stock',false),
('video','https://samplelib.com/lib/preview/mp4/sample-5s.mp4','fresh_closeup',false),
('video','https://samplelib.com/lib/preview/mp4/sample-5s.mp4','container_day',false);
```

## Cloud Run deploy
```bash
docker build -t knimport-export .
docker run -p 8080:8080 --env-file .env knimport-export
```

Or with Cloud Build:
```bash
gcloud builds submit --config cloudbuild.yaml
gcloud run deploy knimport-export --image gcr.io/PROJECT_ID/knimport-export:COMMIT_SHA --region us-central1 --allow-unauthenticated
```
