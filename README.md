# K&N Import & Export — Wholesale Request Platform

Production-ready, mobile-first lead-gen + request management app for Caribbean produce distribution.

## At a glance
- Public-facing React site with pages for home, quality standards, availability, restock requests, contact, and thank-you flow.
- Admin React route for managing inventory/media and reviewing incoming wholesale requests.
- Express API with public/admin routes and Firebase-backed data access.
- Firestore collections power inventory, media assets, and wholesale requests.
- Containerized deployment flow targeting Google Cloud Run.

## Stack
- **Frontend:** React + Vite + Tailwind + Framer Motion + Lucide
- **Backend:** Node.js + Express + Firebase (Auth + Firestore)
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
      firebase.js
    utils/

  Dockerfile
  .dockerignore
  package.json
  README.md
```

## Environment Variables

### Server
- `FIREBASE_PROJECT_ID`
- `FIREBASE_SERVICE_ACCOUNT_KEY` (optional JSON string for local/dev; Cloud Run should prefer service-account ADC/Workload Identity)
- `ADMIN_EMAIL_ALLOWLIST` (optional comma-separated)
- `PORT` (Cloud Run provides this)

> Cloud Run startup tip: the app can boot without Firebase config, but Firebase-backed endpoints require either Workload Identity + a service account with Firestore/Auth access, or `FIREBASE_SERVICE_ACCOUNT_KEY`.

### Client (Vite)
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## Scripts
- `npm install`
- `npm run dev` — runs API + frontend
- `npm run build` — builds Vite app
- `npm start` — serves API + built frontend from Express

## Firebase setup
1. Create a Firebase project with Authentication + Firestore enabled.
2. Create admin users in Firebase Authentication.
3. Optionally set `ADMIN_EMAIL_ALLOWLIST` for admin API gating.
4. Create Firestore collections: `inventory_items`, `media_assets`, `requests`.


## Firestore starter collections
- `inventory_items`: public catalog entries (`is_active`, `status`, product metadata).
- `media_assets`: home-page media wall assets (`type`, `url`, `tag`, `featured`).
- `requests`: wholesale submissions including `request_items` array and pipeline `status`.

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
gcloud run deploy knimport-export \
  --image gcr.io/PROJECT_ID/knimport-export:COMMIT_SHA \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
```
