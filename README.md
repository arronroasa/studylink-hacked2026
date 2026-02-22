# StudyLink - HackED 2026 Submission

**StudyLink** is a real-time study session marketplace designed for university students. It connects students looking to study together based on course, location, and availability.

## Features

- **Real-time Session Discovery**: Browse active study sessions happening around you.
- **Session Creation**: Create and publish your own study sessions with details like course, topic, and capacity.
- **Join Sessions**: Request to join sessions and coordinate with other students.
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

## Project Structure

```
studylink-hacked2026/
├── client/                 # Vite + React (TypeScript) Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Main application pages
│   │   ├── services/       # API interaction logic (Axios/Fetch)
│   │   ├── App.tsx         # Root component
│   │   └── main.tsx        # Entry point
│   ├── public/             # Static assets
│   ├── Dockerfile          # Frontend containerization
│   ├── vite.config.ts      # Vite configuration
│   ├── tsconfig.json       # TypeScript configuration
│   └── package.json        # Frontend dependencies
├── server/                 # FastAPI (Python) Backend
│   ├── api/                # API routes and logic
│   │   └── routes.py       # Route definitions
│   ├── database/           # Data storage
│   │   ├── database.db     # SQLite database file
│   │   └── database.sql    # SQL initialization scripts
│   ├── schemas/            # Pydantic validation schemas
│   ├── main.py             # FastAPI entry point
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile          # Backend containerization
├── docker-compose.yaml     # Orchestrates client and server
├── .gitignore              # Git exclusion rules
└── README.md               # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v18+) and npm
- Python (v3.8+)
- Docker Desktop (Alternative)

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

### Alternative - Docker Setup
Simply run Docker Desktop and run the command:
```bash
docker-compose up --build -d
```
to build the frontend and backend.

The appliation will be avaiable at `http://localhost:3000`.

## 🔌 API Endpoints

## 📅 Sessions & Groups (`/items`)
These endpoints manage the creation, discovery, and membership of study groups.

### List / Search Groups
* **Endpoint:** `GET /items/groups/`
* **Query Parameters:**
    * `user_id` (int): **Required**. The ID of the person making the request.
    * `is_search` (bool): If `true`, returns all groups. If `false`, returns only groups the user has joined.
    * `course_code` (string): **Optional**. Filter results by course (e.g., "CS101").
* **Response:** List of group objects including `group_id`, `owner_id`, `building`, and `members` count.

### Get Group Details
* **Endpoint:** `GET /items/{item_id}`
* **Path Parameter:** `item_id` (int) - The unique ID (`eid`) of the session.

### Create Group
* **Endpoint:** `POST /items/create/`
* **Body (`ItemCreate`):**
```json
{
  "owner_id": 1,
  "name": "Midterm Prep",
  "building": "Main Library",
  "room": "302",
  "course_code": "CS101",
  "meeting_day": "Monday",
  "meeting_time": "14:00",
  "max_members": 5,
  "next_meeting": "2026-03-01"
}
```
## 🤝 Contributing

Contributions are welcome! This is an open-source project for HackED 2026.

## 📄 License

MIT License - HackED 2026
