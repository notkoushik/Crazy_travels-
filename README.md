# Crazy Tours & Travels ✈️

> **Enterprise Travel Management & Handcrafted Indian Journeys**  
> A high-performance, modern fullstack travel experience built with **React 19**, **Vite**, **Tailwind CSS v4**, **Node.js/Express**, and **PostgreSQL (Supabase)**.

---

## 🌟 Key Features

### 1. Signature Hero Airplane-to-Logo Motion
- Custom mathematical 1.8-second flight animation where an airplane dynamically traces the authentic Crazy Tours "CT" monogram across 6 cinematic stages.
- Smooth aerodynamic banking (`atan2`), engine exhaust flare, luminous contrails, and spring-ease settle.
- 100% sub-pixel faithful to the master brand identity.

### 2. Deep 18-Dimension Tourism Logistics & Cultural Explorer
- Comprehensive destination profiles beyond simple photos:
  - **Transport Logistics**: Nearest Airport with IATA code & distance, Nearest Railway Junction.
  - **Weather & Season**: Recommended stay duration, peak travel months, average temperatures.
  - **Permits & Regulations**: Inner Line Permits (ILP), Protected Area Permits (PAP), border advisories.
  - **Culture & Clothing**: Seasonal attire guides, cultural modesty notes, regional culinary specialties.
  - **Connectivity**: Live cellular network coverage (Jio, Airtel 5G availability).

### 3. Native Google Maps & Rating Integration (100% Free / Zero API Cost)
- Real Google Maps review badges (e.g. `4.9 ★ (1,420 Google Reviews)`).
- Direct Google Maps deep-links for instant navigation and verified location view.

### 4. Admin Operations Console
- Executive analytics dashboard with real-time PostgreSQL metrics.
- Destinations management with fort-arch image cards and live preview.
- Tour Packages, Stays & Havelis inventory.
- Booking & Voucher pipeline management.
- Custom Trip Inquiry CRM with status workflow (`New`, `Contacted`, `Quote Sent`, `Closed`).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4 (`@tailwindcss/vite`), Vite 8, Inter & Inter Tight typography.
- **Backend**: Node.js, Express 5, Multer, `pg` (node-postgres).
- **Database**: PostgreSQL 15 / 16 (Compatible with Supabase and Neon).
- **Hosting / Production**: Vercel (Frontend & SPA edge routing), Supabase (Database & Storage).

---

## 🚀 Quick Start (Development)

### 1. Clone the repository
```bash
git clone https://github.com/notkoushik/Crazy_travels-.git
cd Crazy_travels-
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment
Copy the example environment file:
```bash
cp .env.example .env
```
Configure your PostgreSQL credentials or paste your Supabase connection string into `DATABASE_URL`.

### 4. Seed Database (Optional)
```bash
node server/seed.js
node server/migrate_tourism_and_media.js
```

### 5. Run the servers
Start the Express API:
```bash
node server/index.js
```
In a separate terminal, start the Vite dev server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ☁️ Production Deployment (Vercel + Supabase)

1. **Database**: Open [Supabase](https://supabase.com), create a new project, go to **SQL Editor**, and run `server/supabase_schema_and_seed.sql`.
2. **Frontend on Vercel**: Import this GitHub repository into Vercel. Vercel automatically detects the Vite configuration.
3. **Environment Variables**: Add `DATABASE_URL` in your production environment settings.

---

## 📄 License
Private & Proprietary — © Crazy Tours & Travels. All Rights Reserved.
