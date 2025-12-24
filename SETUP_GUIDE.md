# TrackHub Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

## Quick Start

### 1. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Check if MongoDB is running
mongosh
# Or start MongoDB service (Windows)
net start MongoDB
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the backend server
npm run dev

# You should see:
# "MongoDB connected"
# "Server running on http://localhost:5000"
```

### 3. Frontend Setup
```bash
# Open a new terminal
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm run dev

# You should see:
# "Local: http://localhost:5173"
```

### 4. Test the Application
1. Open your browser and go to `http://localhost:5173`
2. Click "Sign Up" to create a new account
3. Fill in the registration form
4. After successful registration, you'll be redirected to the dashboard
5. Try logging out and logging back in

## Environment Variables

### Backend `.env` file
Located at: `backend/.env`
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/trackhub
JWT_SECRET=my-super-secret-jwt-key-2024-trackhub-app-xyz123
NODE_ENV=development
```

### Frontend `.env` file
Located at: `frontend/.env`
```env
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Todos
- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create new todo
- `GET /api/todos/:id` - Get todo by ID
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

### Time Entries
- `GET /api/time-entries` - Get all time entries
- `POST /api/time-entries` - Create new time entry
- `GET /api/time-entries/:id` - Get time entry by ID
- `PUT /api/time-entries/:id` - Update time entry
- `DELETE /api/time-entries/:id` - Delete time entry

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Troubleshooting

### Issue: Backend won't start
**Error: MongoDB connection error**
- Make sure MongoDB is running
- Check if the connection string in `.env` is correct
- Try connecting to MongoDB using mongosh: `mongosh mongodb://localhost:27017/trackhub`

### Issue: Frontend API calls failing
**Error: Network Error or CORS error**
- Make sure backend is running on port 5000
- Check browser console for errors
- Verify that CORS is configured correctly in `backend/src/app.js`
- Check that proxy is configured in `frontend/vite.config.js`

### Issue: Authentication not working
**Error: Token issues**
- Check if JWT_SECRET is set in backend `.env`
- Clear browser localStorage and try again
- Check browser console for authentication errors

### Issue: Port already in use
**Error: Port 5000 or 5173 is already in use**
- Close the application using that port
- Or change the port in `.env` (backend) or `vite.config.js` (frontend)

### Issue: Module not found errors
**Error: Cannot find module**
- Delete `node_modules` folder
- Delete `package-lock.json`
- Run `npm install` again

## Development Tips

### Recommended VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- MongoDB for VS Code
- REST Client

### Testing with Postman
1. Import the API endpoints into Postman
2. Test registration: POST `http://localhost:5000/api/auth/register`
3. Test login: POST `http://localhost:5000/api/auth/login`
4. Copy the token from the response
5. Use the token in Authorization header for protected routes

### Database Management
- Use MongoDB Compass to view your database
- Connection string: `mongodb://localhost:27017`
- Database name: `trackhub`

## Project Structure

```
TrackHub/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── dashboardController.js
│   │   │   ├── projectsController.js
│   │   │   ├── tasksController.js
│   │   │   ├── timeEntriesController.js
│   │   │   └── todosController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── models/
│   │   │   ├── Project.js
│   │   │   ├── Task.js
│   │   │   ├── TimeEntry.js
│   │   │   ├── todo.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── dashboard.js
│   │   │   ├── projects.js
│   │   │   ├── tasks.js
│   │   │   ├── timeEntries.js
│   │   │   └── todos.js
│   │   ├── app.js
│   │   └── index.js
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── assets/
    │   ├── components/
    │   │   ├── ProtectedRoute.jsx
    │   │   └── Sidebar.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── ProjectTracker.jsx
    │   │   ├── SignIn.jsx
    │   │   ├── SignUp.jsx
    │   │   ├── TimeTable.jsx
    │   │   └── ToDo.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── .env
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

## Next Steps

1. Implement Dashboard data fetching from API
2. Create forms for adding projects, tasks, and todos
3. Add update and delete functionality for all resources
4. Implement the Time Table functionality
5. Add data visualization for tracking progress
6. Implement user profile management
7. Add password reset functionality
8. Deploy to production (Vercel for frontend, Render/Railway for backend)

## Need Help?

- Check the console logs in both frontend and backend
- Review the API responses in browser DevTools Network tab
- Test API endpoints directly using Postman
- Make sure all environment variables are set correctly
- Ensure MongoDB is running and accessible
