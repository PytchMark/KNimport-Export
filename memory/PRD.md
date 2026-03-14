# K&N Import Export - PRD

## Overview
Caribbean wholesale produce distribution platform with admin portal for inventory and media management.

## Architecture
- **Backend**: Node.js/Express on port 8001
- **Frontend**: React/Vite (built to static, served on port 3000)
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage (bucket: `kn-media`)
- **Auth**: Hardcoded admin credentials in .env file (JWT tokens)

## Admin Accounts (in .env file)
| Username | Password | Role |
|----------|----------|------|
| admin1 | KnAdmin2026! | admin |
| admin2 | KnAdmin2026! | admin |
| masteradmin | KnMaster2026!Dev | masteradmin |

*Change passwords by editing `/app/.env` file*

## Core Requirements
1. Public website showcasing produce inventory and quality
2. Admin portal for managing requests, inventory, and media
3. Media storage in Supabase buckets (migrated from Cloudinary)
4. Hero slideshow displaying uploaded images from Supabase

## What's Been Implemented (2026-01-13)

### Cloudinary to Supabase Migration ✅
- Removed Cloudinary dependency from package.json
- Created `/app/server/services/storage.js` for Supabase storage uploads
- Updated admin routes to support file uploads to Supabase bucket
- Admin portal now uploads directly to Supabase storage

### Simplified Admin Authentication ✅
- 3 hardcoded admin accounts in .env file
- 2 admin accounts (admin1, admin2) for regular use
- 1 master admin account (masteradmin) for developers
- JWT-based token authentication (24hr expiry)
- No external auth dependency

### Admin Portal ✅
- Login with username/password
- Dashboard with request pipeline stats
- Inventory management (add/delete items)
- Media management with category-based organization
- Categories: hero, inventory, delivery, quality, gallery
- User info displayed in sidebar with role badge

### Hero Section Slideshow ✅
- HeroSlideshow component with auto-play (5 sec interval)
- Navigation controls (prev/next, dots, play/pause)
- Progress bar indicator
- Falls back to quality images if no hero images uploaded

## API Endpoints
### Public
- `GET /api/health` - Health check
- `GET /api/hero-images` - Hero section images
- `GET /api/gallery` - All gallery assets
- `GET /api/inventory` - Public inventory
- `GET /api/media` - All media assets
- `POST /api/requests` - Create order request

### Admin (requires Bearer token)
- `POST /api/admin/login` - Authenticate admin
- `GET /api/admin/requests` - Get all requests
- `PATCH /api/admin/requests/:id` - Update request status
- `GET /api/admin/inventory` - Get all inventory
- `POST /api/admin/inventory` - Add inventory item
- `DELETE /api/admin/inventory/:id` - Remove item
- `POST /api/admin/media/upload` - Upload media file
- `DELETE /api/admin/media/:id` - Delete media

## Supabase Setup Required

### 1. Create Storage Bucket
In Supabase Dashboard → Storage:
1. Create bucket named `kn-media`
2. Set bucket to **Public** (for image display)

### 2. Apply Database Migration  
Run this SQL in Supabase SQL Editor:
```sql
ALTER TABLE media_assets 
ADD COLUMN IF NOT EXISTS category text 
CHECK (category IN ('hero','inventory','delivery','quality','gallery')) 
DEFAULT 'gallery';

ALTER TABLE media_assets ADD COLUMN IF NOT EXISTS storage_path text;
ALTER TABLE media_assets ADD COLUMN IF NOT EXISTS original_filename text;
```

## Tech Stack
- React 18, Vite 6
- Express 4, Node.js
- Supabase JS v2
- Tailwind CSS, Framer Motion
- Multer (file uploads)

## Testing Results (2026-01-13)
- Backend: 100% (15/15 tests passed)
- Frontend: 100% (all functionality working)

## Backlog / Future
- P1: Image optimization/compression
- P1: Video support in slideshow
- P2: Drag-drop reorder for hero images
- P2: Inventory image uploads
- P3: Analytics dashboard
