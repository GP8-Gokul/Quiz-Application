# Quiz Application

🔗 **Live Demo**: [https://quiz-application-one-lyart.vercel.app/](https://quiz-application-one-lyart.vercel.app/)

A real-time interactive quiz application built with React and Node.js that allows users to create, host, and participate in live quiz sessions with real-time leaderboards and scoring.

## ✨ Features

### For Quiz Creators
- **User Authentication** - Secure signup/signin system
- **Quiz Creation** - Create custom quizzes with multiple-choice questions
- **Real-time Administration** - Host live quiz sessions with admin controls
- **Live Monitoring** - Track participant answers and responses in real-time
- **Dynamic Leaderboards** - View live scoring and rankings

### For Participants
- **Easy Join** - Join quizzes using simple room codes
- **Real-time Participation** - Answer questions in live quiz sessions
- **Instant Feedback** - See results and scores immediately
- **Responsive Design** - Works seamlessly on desktop and mobile devices

### Real-time Features
- **WebSocket Communication** - Real-time updates for all participants
- **Live Scoring** - Dynamic score calculation with time bonuses
- **Synchronized Sessions** - All participants see questions simultaneously
- **Animated Results** - Beautiful score animations and confetti effects

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks and context
- **Vite** - Fast build tool and development server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations and transitions
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **WebSocket (ws)** - Real-time communication
- **PostgreSQL** - Database for persistent storage
- **Prisma** - Modern database toolkit and ORM
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

### Additional Libraries
- **Matter.js** - Physics engine for interactive elements
- **Lodash** - Utility functions
- **React Confetti** - Celebration animations
- **Nanoid** - Unique ID generation

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Quiz-Application
```

2. **Backend Setup**
```bash
cd backend
npm install
```

3. **Environment Variables**
Create a `.env` file in the backend directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/quiz_db"
JWT_SECRET="your-secret-key"
PORT=3000
```

4. **Database Setup**
```bash
npx prisma migrate dev
npx prisma generate
```

5. **Frontend Setup**
```bash
cd ../frontend/Quiz-App
npm install
```

6. **Frontend Environment Variables**
Create a `.env` file in the frontend directory:
```env
VITE_BASE_HTTP_URL=http://localhost:3000
VITE_BASE_WS_URL=ws://localhost:3000
```

### Running the Application

1. **Start the Backend Server**
```bash
cd backend
npm start
```

2. **Start the Frontend Development Server**
```bash
cd frontend/Quiz-App
npm run dev
```

3. **Access the Application**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`

## 📁 Project Structure

```
Quiz-Application/
├── backend/
│   ├── db/
│   │   └── queries.js          # Database queries
│   ├── middleware/
│   │   └── auth.js             # Authentication middleware
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── migrations/         # Database migrations
│   ├── routes/
│   │   ├── authentication.js  # Auth routes
│   │   └── quiz.js            # Quiz routes
│   ├── utils/
│   │   ├── slugify.js         # Text slugification
│   │   └── uniqueId.js        # ID generation
│   ├── websocket/
│   │   ├── handlers.js        # WebSocket event handlers
│   │   ├── helpers.js         # WebSocket utilities
│   │   ├── room.js           # Room management
│   │   └── ws.js             # WebSocket server setup
│   └── server.js             # Main server file
├── frontend/Quiz-App/
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── contexts/          # React contexts (Socket)
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Page components
│   │   ├── constants/         # App constants and routes
│   │   └── App.jsx           # Main App component
│   ├── vite.config.js        # Vite configuration
│   └── package.json          # Frontend dependencies
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/signin` - User login

### Quiz Management
- `POST /quiz/create` - Create a new quiz
- `GET /quiz/my-quizzes` - Get user's quizzes
- `GET /quiz/:slug` - Get quiz details by slug

### WebSocket Events
- `create-room` - Create a new quiz room
- `join-room` - Join an existing room
- `next-question` - Send next question to participants
- `submit-answer` - Submit participant answer
- `end-question` - End current question
- `end-quiz` - End the entire quiz session

## 🎮 How to Use

### Creating a Quiz
1. Sign up or log in to your account
2. Navigate to "Create Quiz" page
3. Add quiz title and questions with multiple choice options
4. Mark the correct answer for each question
5. Submit the quiz

### Hosting a Quiz Session
1. Go to "My Quizzes" and select a quiz
2. Click "Create Room" to start a live session
3. Share the 8-digit room code with participants
4. Control the quiz flow with admin panel
5. Monitor real-time responses and leaderboard

### Participating in a Quiz
1. Enter the 8-digit room code on the landing page
2. Provide your name (max 10 characters)
3. Wait for the host to start the quiz
4. Answer questions within the time limit
5. View your final score and ranking

## 🎨 Features in Detail

### Real-time Communication
The application uses WebSockets for real-time communication between the quiz host and participants. This enables:
- Synchronized question delivery
- Live answer submission
- Real-time leaderboard updates
- Instant feedback and results

### Scoring System
- Base score: 500 points per correct answer
- Time bonus: Additional points based on response speed
- Real-time score calculation and leaderboard updates

### Responsive Design
- Mobile-first approach with TailwindCSS
- Optimized for various screen sizes
- Touch-friendly interface for mobile devices

## 🚀 Deployment

### Frontend (Vercel)
The frontend is configured for Vercel deployment with proper routing:
- Uses `vercel.json` for SPA routing configuration
- Environment variables configured in Vercel dashboard

### Backend
The backend is deployed on render:
- DATABASE_URL points to production database (hosted on neondb)
- Set proper CORS origins for production frontend URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- **Live Application**: [https://quiz-application-2idfqf3ma-gokuls-projects-f31147e3.vercel.app/](https://quiz-application-2idfqf3ma-gokuls-projects-f31147e3.vercel.app/)
- **Repository**: [GitHub Repository Link]

---
