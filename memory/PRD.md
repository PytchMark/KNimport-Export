# K&N Import Export - PRD

## Overview
Caribbean wholesale produce distribution platform with admin portal for inventory and media management.

## Architecture
- **Backend**: Node.js/Express on port 8001
- **Frontend**: React/Vite (built to static, served on port 3000)
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage (bucket: `kn-media`)
- **Auth**: Supabase Auth (email/password)

## Core Requirements
1. Public website showcasing produce inventory and quality
2. Admin portal for managing requests, inventory, and media
3. Media storage in Supabase buckets (migrated from Cloudinary)
4. Hero slideshow displaying uploaded images from Supabase

## What's Been Implemented (2026-01-13)

### Cloudinary to Supabase Migration
- ✅ Removed Cloudinary dependency from package.json
- ✅ Created `/app/server/services/storage.js` for Supabase storage uploads
- ✅ Updated admin routes to support file uploads to Supabase bucket
- ✅ Admin portal now uploads directly to Supabase storage

### Admin Portal Enhancements
- ✅ Added signup flow with email/password confirmation
- ✅ Media management with category-based organization
- ✅ Categories: hero, inventory, delivery, quality, gallery
- ✅ File upload to Supabase storage with proper cataloging

### Hero Section Slideshow
- ✅ New `HeroSlideshow` component with auto-play
- ✅ Navigation controls (prev/next, dots, play/pause)
- ✅ Progress bar indicator
- ✅ Falls back to quality images if no hero images uploaded

### API Endpoints
- `GET /api/health` - Health check
- `GET /api/hero-images` - Hero section images
- `GET /api/gallery` - All gallery assets
- `GET /api/inventory` - Public inventory
- `GET /api/media` - All media assets
- `POST /api/requests` - Create order request
- `POST /api/admin/media/upload` - Upload media (auth required)

## Supabase Setup Required

### 1. Create Storage Bucket
In Supabase Dashboard → Storage:
1. Create bucket named `kn-media`
2. Set bucket to **Public** (for image display)
3. Enable image transformations (optional)

### 2. Apply Database Migration  
Run this SQL in Supabase SQL Editor to add category column:
```sql
ALTER TABLE media_assets 
ADD COLUMN IF NOT EXISTS category text 
CHECK (category IN ('hero','inventory','delivery','quality','gallery')) 
DEFAULT 'gallery';

ALTER TABLE media_assets 
ADD COLUMN IF NOT EXISTS storage_path text;

ALTER TABLE media_assets 
ADD COLUMN IF NOT EXISTS original_filename text;
```

### 3. Enable Email Auth
In Supabase Dashboard → Authentication → Providers:
- Enable Email provider
- Configure email templates if desired

## Tech Stack
- React 18, Vite 6
- Express 4, Node.js
- Supabase JS v2
- Tailwind CSS, Framer Motion
- Multer (file uploads)

## Backlog / Future
- P1: Image optimization/compression
- P1: Video support in slideshow
- P2: Drag-drop reorder for hero images
- P2: Inventory image uploads
- P3: Analytics dashboard
