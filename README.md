# GPCET CampusIQ

GPCET CampusIQ is an AI-powered student learning platform specifically tailored for G. Pullaiah College of Engineering and Technology (GPCET), Kurnool.

## Features
- **Notes Vault**: Regulation-filtered study materials for all GPCET students
- **Meera AI**: An AI exam preparation bot powered by Groq, built specifically for GPCET's syllabus.

## Installation & Setup

1. **Clone the repository**
2. **Install Server Dependencies:**
   ```bash
   cd server
   npm install
   ```
3. **Install Client Dependencies:**
   ```bash
   cd client
   npm install
   ```
4. **Environment Variables:**
   Copy `.env.example` to `.env` in the server folder (or root, based on setup) and fill in the required keys.
5. **Database Seeding (Optional):**
   ```bash
   cd server
   npm run seed
   ```
6. **Start Application:**
   Start backend:
   ```bash
   cd server
   npm run dev
   ```
   Start frontend:
   ```bash
   cd client
   npm run dev
   ```

## Login Credentials (Seed data)
* Student: student@gpcet.ac.in / password123
* Admin: admin@gpcet.ac.in / admin123
