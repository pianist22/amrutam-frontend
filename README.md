# Amrutam - Ayurveda Ingredients Management Platform

Welcome to **Amrutam**, a modern and comprehensive platform for managing Ayurvedic ingredients, formulations, and related wellness data. This application enables users to create, view, search, and manage detailed information about Ayurvedic ingredients with a clean and intuitive multi-step form experience.

---

## 🚀 Live Demo
[Access the Amrutam live application here](https://amrutam-frontend-one.vercel.app/)  
_Backend API hosted on Render

---

## 🔗 GitHub Repositories

- **Frontend:** [https://github.com/pianist22/amrutam-frontend](https://github.com/pianist22/amrutam-frontend)  
  Production-ready Next.js app with Clerk authentication, multi-step ingredient creation wizard, and clean user interface.

- **Backend:** [https://github.com/pianist22/amrutam-backend](https://github.com/pianist22/amrutam-backend)  
  Node.js/Express REST API handling ingredient data storage, user registration, and authentication integration with Clerk.

---

## 📋 Features

- **User Authentication:** Powered by [Clerk.dev](https://clerk.dev/) for seamless sign-in/sign-up flows.
- **Multi-Step Ingredient Creation:**  
  - Step 1: General Information (including image upload via Cloudinary)  
  - Step 2: Benefits (dynamic list with emoji picker)  
  - Step 3: Ayurvedic Properties and Formulations  
  - Step 4: Additional Information such as Plant Parts and Geographic Location  
  - Step 5: Overview with in-place editing and final submission
- **Search and List:** Comprehensive ingredient listing with search, pagination, and CSV export.
- **Detail View:** Rich ingredient detail pages with editable sections, status management, and deletion.
- **Responsive UI:** Fully mobile-friendly layouts using modern React and Tailwind CSS.
- **Toast Notifications:** Contextual user feedback for actions and errors.
- **Secure API:** Backend routes protected and validated; compliant with best practices.

---

## 🛠️ Technology Stack

- **Frontend:**  
  - Next.js (App Directory) with React 18  
  - TypeScript (optional)  
  - Clerk for Authentication  
  - Tailwind CSS for styling  
  - ShadCN UI components (or custom UI kit)  
  - React Hooks and Context for state management  

- **Backend:**  
  - Node.js with Express.js  
  - MongoDB via Mongoose ODM  
  - Clerk SDK for user management  
  - Cloudinary for image hosting  
  - Hosted on Render for scalability and uptime  

---

## 🧑‍💻 Getting Started

### Prerequisites

- Node.js >= 16  
- MongoDB instance (Atlas or local)  
- Clerk.dev API keys  
- Cloudinary API credentials  

### Installation

Clone the repos:

git clone https://github.com/pianist22/amrutam-frontend.git
git clone https://github.com/pianist22/amrutam-backend.git

Configure environment variables in `.env.local` (frontend) and `.env` (backend):
*Frontend*
-NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
-NEXT_PUBLIC_SERVER_URL=https://your-backend.onrender.com

*Backend*
-CLERK_API_KEY=sk_test_xxx
-MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/database
-CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name

### Run Locally

**Backend:**
-cd amrutam-backend
-npm install
-npm start # or node server.js

**Frontend:**
-cd amrutam-frontend
-npm install
-npm run dev

Open [http://localhost:3000](http://localhost:3000) to view the app.
---


## 📞 Contact

For support or inquiries, reach out at [priyanshusaha944@gmail.com].

---
*Thank you for exploring Amrutam! May your journey into Ayurveda be rewarding and fulfilling.*  
