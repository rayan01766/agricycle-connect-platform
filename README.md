# AgriCycle Connect

A full-stack waste management application connecting farmers with companies.

## Tech Stack
- **Frontend**: Next.js 15, TailwindCSS, TypeScript
- **Backend**: Node.js, Express.js, PostgreSQL
- **Auth**: JWT, bcryptjs

## Setup Instructions

### Backend
1. Navigate to `backend/`
2. Install dependencies: `npm install`
3. Create `.env` file based on `.env.example`
4. Run migrations from `../schema.sql` in your PostgreSQL database
5. Start server: `npm run dev`

### Frontend
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Create `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
4. Start dev server: `npm run dev`

## API Documentation

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Waste Listings
- `GET /api/waste` - Get approved listings (Public/Company)
  - Query `?all=true` - Get all listings (Admin/Debug)
- `POST /api/waste` - Create listing (Farmer only, form-data with 'image')
- `GET /api/waste/my` - Get my listings (Farmer only)
- `GET /api/waste/:id` - Get specific listing
- `PATCH /api/waste/:id/status` - Update status (Admin only)
- `DELETE /api/waste/:id` - Delete listing (Farmer/Admin)

## Test Accounts
Create these manually or via Signup:
- **Admin**: Sign up with role 'admin' (or update DB manually if UI restricts)
- **Farmer**: Sign up with role 'farmer'
- **Company**: Sign up with role 'company'
