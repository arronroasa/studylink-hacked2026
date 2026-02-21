# StudyLink - HackED 2026 Submission

**StudyLink** is a real-time study session marketplace designed for university students. It connects students looking to study together based on course, location, and availability.

## Features

- **Real-time Session Discovery**: Browse active study sessions happening around you.
- **Session Creation**: Create and publish your own study sessions with details like course, topic, and capacity.
- **Join Sessions**: Request to join sessions and coordinate with other students.
- **User Profiles**: Manage your profile and view your study history.
- **Responsive Design**: Built with Tailwind CSS for a seamless experience on desktop and mobile.

## Tech Stack

### Frontend
- **Framework**: [React](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Build Tool**: [Vite](https://vitejs.dev/)

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Language**: [Python](https://www.python.org/)
- **Database**: [SQLite](https://www.sqlite.org/index.html) (In-memory for demo)
- **ORM**: [SQLAlchemy](https://www.sqlalchemy.org/)

## Project Structure

```
studylink-hacked2026/
├── client/          # React Frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Main application pages
│   │   ├── services/    # API interaction logic
│   │   └── App.tsx      # Root component
│   └── package.json
├── server/          # FastAPI Backend
│   ├── api/           # API routes and endpoints
│   ├── models/        # Database models (SQLAlchemy)
│   ├── schemas/       # Pydantic validation schemas
│   ├── main.py        # Application entry point
│   └── requirements.txt
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+) and npm
- Python (v3.8+)

### 1. Backend Setup

```bash
# Navigate to the server directory
cd server

# Install dependencies
pip install -r requirements.txt

# Run the development server
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

### 2. Frontend Setup

```bash
# Navigate to the client directory
cd client

# Install dependencies
npm install

# Run the development server
npm run dev
```

The application will be available at `http://localhost:5173`.

## 🔌 API Endpoints

### Sessions
- `GET /api/sessions`: List all active study sessions
- `POST /api/sessions`: Create a new study session
- `GET /api/sessions/{id}`: Get session details
- `POST /api/sessions/{id}/join`: Join a session

### Users
- `POST /api/users/register`: Register a new user
- `POST /api/users/login`: Login and get JWT token
- `GET /api/users/me`: Get current user profile

## 🤝 Contributing

Contributions are welcome! This is an open-source project for HackED 2026.

## 📄 License

MIT License - HackED 2026
