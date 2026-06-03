<div align="center">
  <h1>🚀 GPCET CampusIQ</h1>
  <p><strong>The Intelligent Academic Hub & Next-Gen AI Study Companion</strong></p>
</div>

<br/>

## 🌟 About the Project

**GPCET CampusIQ** is a full-stack, AI-integrated educational platform designed to modernize the academic experience for engineering students. Built with scalability, security, and user experience in mind, this platform solves real-world challenges in curriculum management and exam preparation.

This project goes beyond standard CRUD operations. It features a highly resilient architecture, dynamic data rendering, role-based access control, and an integrated AI tutor capable of contextual awareness.

> **For Recruiters:** This project demonstrates proficiency in modern React (Vite), Node.js/Express backend architecture, complex MongoDB schema relationships, JWT-based secure authentication flows, third-party API integration (Groq LLM, Cloudinary, Nodemailer), and advanced security implementations (Rate limiting, NoSQL injection prevention, XSS protection).

---

## 🔥 Key Product Features

### 📚 The Notes Vault
A highly organized, dynamic study material repository.
- **Context-Aware Filtering:** Automatically filters and serves study materials based on the logged-in student's Branch, Year, Semester, and Academic Regulation.
- **Admin Dashboard:** Secure portal for administrators to manage curriculum, create subjects, and upload PDF materials directly to cloud storage (Cloudinary).
- **Responsive UI:** A premium, glassmorphism-inspired interface with skeleton loading states and dynamic layout adjustments.

### 🤖 Meera AI - The Smart Companion
An advanced, real-time streaming AI tutor engineered specifically for the college syllabus.
- **Contextual Intelligence:** Automatically understands the student's academic background and tailors explanations to their specific regulation and semester.
- **Multi-Mode Assistance:** Features distinct conversation modes including "Exam Emergency", "Concept Explainer", "Practice Viva", and "General Chat".
- **Resilient Streaming:** Uses Server-Sent Events (SSE) to stream AI responses in real-time, complete with connection-loss handling and graceful fallbacks.
- **Safe Response Handling:** Built with robust system guardrails to prevent AI hallucinations regarding sensitive administrative data.

### 🛡️ Enterprise-Grade Security
Built for production deployment with stringent security measures.
- **Authentication:** Stateless JWT architecture with automated, silent token refreshing via Axios interceptors.
- **Threat Protection:** Implements `express-rate-limit` to prevent brute-force attacks and API quota exhaustion.
- **Payload Safety:** Secures endpoints against NoSQL injections (`express-mongo-sanitize`), HTTP Parameter Pollution (`hpp`), and malicious payloads.
- **Automated Communication:** Asynchronous email dispatch system for user onboarding using Nodemailer.

---

## 💻 Technology Stack

**Frontend:**
- React 18 (Vite)
- Tailwind CSS (Custom Design System & Animations)
- Axios (with advanced interceptor logic)
- Lucide React (Iconography)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (Access & Refresh token flow)
- Cloudinary (Cloud Object Storage)
- Groq SDK (Llama-3 LLM Integration)
- Nodemailer

---

## 🚀 Future Scope
- Implementation of RAG (Retrieval-Augmented Generation) allowing the AI to read directly from uploaded PDF materials.
- Real-time community forums via WebSockets.
- Gamified learning progress tracking and analytics.

---

## 🛠️ Quick Start (Local Development)

*Note: Environment variables (.env) are required to run this project. They are kept private for security.*

**1. Clone the repository**
```bash
git clone https://github.com/Prashanthgoud15/gpcet-campusiq.git
```

**2. Start the Backend**
```bash
cd server
npm install
npm run dev
```

**3. Start the Frontend**
```bash
cd client
npm install
npm run dev
```

---

## 👨‍💻 Author

**G. Prashanth Goud**  
*CSE-B, 2027 Batch*  
*G. Pullaiah College of Engineering and Technology, Kurnool*  

- **GitHub:** [github.com/Prashanthgoud15](https://github.com/Prashanthgoud15)
- **LinkedIn:** [linkedin.com/in/prashanth-goud-372485294](https://www.linkedin.com/in/prashanth-goud-372485294/)
- **Email:** goudprashanth691@gmail.com

---

## ⚖️ Copyright & License

**© 2026 G. Prashanth Goud. All rights reserved.**

This project is the original intellectual property of G. Prashanth Goud. It is built strictly for educational, portfolio, and demonstration purposes. 

**WARNING:** You are strictly prohibited from copying, renaming, redistributing, deploying, or claiming this project (or any of its UI/UX designs, architecture, or features) as your own work without explicit written permission from the author. 

Please respect the effort and code. Thank you!
