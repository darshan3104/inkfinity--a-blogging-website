# 🖋️ Inkfinity — A Modern Blogging Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.2.2-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8.3-010101?style=for-the-badge&logo=socket.io)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

**Inkfinity** is an ultra-premium, high-performance blogging platform designed for creators who demand excellence. Built with a modern full-stack architecture, it combines a sleek, distraction-free writing experience with powerful real-time features and enterprise-grade security.

---

## ✨ Key Features

- **🚀 High-Performance Rendering**: Built on Next.js 16 for blazing-fast page loads and SEO optimization.
- **🎨 Ultra-Premium UI**: Beautifully crafted glassmorphic design, smooth animations (Framer Motion), and dark/light mode support.
- **📝 Distraction-Free Editor**: A clean, powerful editor using `react-quill-new` for a seamless writing experience.
- **⚡ Real-time Interactions**: Live comments and notifications powered by Socket.io.
- **🔒 Secure Authentication**: Robust JWT-based authentication system with bcrypt password hashing.
- **📊 Rich Analytics**: Track engagement, views, and audience growth with deep metric insights.
- **🌍 Global Edge Delivery**: Optimized for global distribution and high availability.
- **📱 Fully Responsive**: Flawless experience across mobile, tablet, and desktop devices.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4, Framer Motion (Animations)
- **Icons**: Lucide React
- **State Management**: React Context API
- **UI Components**: Radix UI, Shadcn UI (patterns)

### Backend
- **Server**: Express.js
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.io
- **Security**: JWT, Cookie-parser, Bcryptjs
- **FileUpload**: Multer
- **Email**: Nodemailer

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/darshan3104/inkfinity--a-blogging-website.git
cd inkfinity--a-blogging-website
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add the following:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
CLIENT_URL=http://localhost:3000
```

### 4. Run the application
```bash
# Start the server (includes backend and Next.js prepare)
npm start
```
The server will be running on [http://localhost:5000](http://localhost:5000).

---

## 📁 Project Structure

```bash
├── app/              # Next.js App Router (Frontend)
├── backend/          # Express API logic
│   └── src/
│       ├── routes/   # API endpoints
│       └── models/   # Mongoose schemas
├── components/       # Shared UI components
├── context/          # React Context providers
├── lib/              # API helpers and utilities
├── public/           # Static assets
└── app.js            # Main entry point (Full-stack orchestrator)
```

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` (if exists) for more information.

---

<p align="center">
  Built with ❤️ by the Inkfinity Team
</p>
