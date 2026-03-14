# K&N Import Export - PRD

## Overview
Caribbean wholesale produce distribution platform with admin portal for inventory and media management.

## Architecture
- **Backend**: Node.js/Express on port 8001
- **Frontend**: React/Vite (built to static, served on port 3000)
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage (bucket: `kn-media`)
- **Auth**: Hardcoded admin credentials in .env file (JWT tokens)

## Admin Accounts (in /app/.env)
| Username | Password | Role |
|----------|----------|------|
| admin1 | KnAdmin2026! | Admin (full access) |
| admin2 | KnAdmin2026! | Admin (full access) |
| masteradmin | KnMaster2026!Dev | Master Admin (dev use) |

*Change passwords by editing `/app/.env` file*

## What's Been Implemented (2026-01-14)

### Admin Portal Revamp ✅
- **Clean Layout**: Admin routes separated from main site (no navbar/footer)
- **Professional Design**: Dark theme with amber/green accent colors
- **Dashboard Overview**: Stats cards, recent requests, quick navigation
- **Request Pipeline**: Kanban-style board with status columns (new, contacted, quoted, confirmed, fulfilled, archived)
- **Inventory Manager**: Add/delete products with status badges
- **Media Library**: Drag-drop upload zone with category selector

### Simplified Authentication ✅
- 3 hardcoded admin accounts in .env file
- JWT-based token authentication (24hr expiry)
- No external auth dependency
- Clean login page with user icon

### UI Features ✅
- Notification toasts for success/error messages
- User info displayed in sidebar with role badge
- Category filter buttons with counts
- Responsive stat cards with color coding
- Delete confirmations for destructive actions

### Cloudinary to Supabase Migration ✅
- Removed Cloudinary dependency
- Supabase Storage integration for uploads
- Media assets stored with category cataloging

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
- React 18, Vite 6, React Router
- Express 4, Node.js
- Supabase JS v2
- Tailwind CSS, Framer Motion
- Multer (file uploads)
- Lucide React (icons)

## Testing Results (2026-01-14)
- Backend: 100% (all endpoints working)
- Frontend: 95% (all features functional)

## Backlog / Future
- P1: Image optimization/compression on upload
- P1: Edit inventory items inline
- P2: Drag-drop reorder for hero images
- P2: Bulk media upload progress indicator
- P3: Analytics dashboard with charts
