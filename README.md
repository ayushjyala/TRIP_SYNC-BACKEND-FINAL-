# 🌌 Trip Sync – Hyper‑Aesthetic India Travel Guide

**Trip Sync** is a futuristic, visually immersive travel guide for exploring incredible destinations across **India**.  
With a real-time 3D cursor-interactive background, glassmorphism design, and a full‑stack architecture, it delivers everything a modern traveler needs – from nearby restaurants and hotels to a persistent trip checklist.

> **India only. Hyper-aesthetic. Data‑driven.**

![Trip Sync Screenshot](screenshot.png) <!-- Add your screenshot later -->

---

## ✨ Features

- 🖱️ **Cursor-controlled 3D background** – dynamic particles, shaded gradients, and a glowing mouse trail powered by Three.js  
- 💎 **Glassmorphism UI** – neon accents, smooth animations, and a responsive, mobile‑first design  
- 🗺️ **Destination Explorer** – real Indian destinations with rich details (Goa, Jaipur, Kerala, Varanasi, Ladakh, and more)  
- 📍 **Interactive Maps** – Leaflet.js maps with markers for the city centre and nearby attractions  
- 🍽️ **Nearby Places** – restaurants, hotels, hostels pulled from static + live OpenStreetMap data  
- 🔎 **Smart Search** – filter destinations by name, activities, or nearby places in real time  
- ✅ **Trip Checklist** – persistent to-do list saved to MongoDB via API (add, toggle, delete)  
- 📬 **Contact Modal** – sleek glassmorphism form (frontend only)  
- 🚀 **Fully responsive** – works beautifully on desktop, tablet, and mobile  

---

## 🧰 Tech Stack

| Layer       | Technology                                      |
|-------------|-------------------------------------------------|
| **Frontend**| HTML5, CSS3, JavaScript, Three.js, Leaflet.js, AOS |
| **Backend** | Node.js, Express                                |
| **Database**| MongoDB (Mongoose ODM)                          |
| **APIs**    | OpenStreetMap Overpass API (nearby places)      |
| **Styling** | CSS Variables, Glassmorphism, Neon aesthetics   |

---

## 📦 Getting Started

Follow these steps to run Trip Sync locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/atlas/database) (local or Atlas cluster)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/trip-sync.git
cd trip-sync

# Install dependencies
npm install
Environment Variables
Create a .env file in the root and add:

env
MONGODB_URI=your_mongodb_connection_string
PORT=3000
Seed the Database
Populate MongoDB with 8 Indian destinations and realistic data:

bash
npm run seed
Run the Application
bash
npm start
Open http://localhost:3000 – the site is served directly by Express.

🗂️ Project Structure
text
trip-sync/
├── models/
│   ├── Destination.js    # Mongoose schema for destinations
│   └── Checklist.js      # Schema for the persistent trip checklist
├── public/               # Frontend (static files served by Express)
│   ├── index.html
│   ├── style.css
│   └── script.js
├── seed.js               # Seed script for initial data
├── server.js             # Express server & API routes
├── .env.example          # Example environment file
├── package.json
└── README.md
🚀 Deployment
The backend serves the frontend, so you only need to deploy one service.

Option 1: Render / Cyclic
Push your code to GitHub.

On Render/Cyclic, create a new Web Service.

Set Build Command: npm install

Set Start Command: node server.js

Add the environment variable MONGODB_URI (and PORT) in the dashboard.

After deployment, run the seed script once via a shell (if available) or locally pointing to your cloud DB, then restart the service.

Option 2: Local / VPS
Just run npm start after setting up your .env and seeding.

🤖 Built with AI Assistance
This project was crafted using a structured, multi‑session approach with Claude AI to maximize creativity and efficiency. The entire codebase was developed incrementally, with each step carefully planned to preserve the hyper‑aesthetic design while integrating a full‑stack backend.

📸 Screenshots
(Add a few screenshots of the homepage, modal, checklist, and 3D background – your repo will look stunning!)

📝 License
This project is open source and available under the MIT License.

Made with ❤️ and a lot of aesthetic ambition.
Welcome to the future of travel guides.
