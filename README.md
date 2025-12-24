# 🚀 TrackHub

**TrackHub** is a full-stack **MERN-based progress tracking application** built to help developers stay consistent while learning, building projects, and managing daily tasks.  
It serves as a centralized hub to track progress, goals, and productivity.

---

## 🧠 Why TrackHub?

Developers often struggle to manage:
- Daily tasks
- Learning goals (DSA, MERN, etc.)
- Multiple projects

TrackHub solves this by providing a **single dashboard** to monitor everything in one place.

---

## ✨ Features

- 📊 Dashboard overview (daily & weekly progress)
- ✅ Task and activity tracking
- 📚 Learning progress tracker
- 🗂 Project management
- 🔐 User authentication (JWT)
- 📈 Progress analytics *(planned)*

---

## 🛠 Tech Stack

### Frontend
- React
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

### Tools
- Git & GitHub
- Postman
- VS Code

## 📂 Project Structure

```text
TrackHub/
│
├── frontend/        # React frontend
├── backend/        # Node + Express backend
│
├── README.md
└── package.json
```

## 🚧 Project Status

🟡 **Currently in Development**

- Backend APIs: In progress
- Frontend UI: Planned
- Analytics & streaks: Upcoming

---

## 🌱 Future Enhancements

- 📅 Calendar-based task tracking
- 🔔 Notifications & reminders
- 🌙 Dark / Light mode
- 📱 Fully responsive UI
- 🧠 AI-powered insights *(future scope)*

---

## ▶️ Run Locally

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally on port 27017 or use MongoDB Atlas)
- npm or yarn

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Make sure MongoDB is running
# The app expects MongoDB at: mongodb://localhost:27017/trackhub

# Start the backend server
npm run dev
# Backend will run on http://localhost:5000
```

### Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev
# Frontend will run on http://localhost:5173
```

### Environment Variables

**Backend (.env)**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/trackhub
JWT_SECRET=my-super-secret-jwt-key-2024-trackhub-app-xyz123
NODE_ENV=development
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000/api
```

### Testing the Connection

1. Start MongoDB service
2. Start the backend server (it should connect to MongoDB)
3. Start the frontend server
4. Navigate to http://localhost:5173
5. Try signing up with a new account
6. The registration should succeed and redirect you to the dashboard

---

## 🎯 Project Goal

Practice and master the MERN stack

Build a real-world full-stack application

Create a strong resume project

👤 Author

Vansh
Computer Science Student
Full Stack Developer

Abhijeet 
Computer Science Student
Full Stack Developer 


