-- 1. Locations: Added UNIQUE constraint for your INSERT OR IGNORE logic
CREATE TABLE locations (
    lid INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE, 
    latitude REAL,
    longitude REAL
);

-- 2. Users
CREATE TABLE users (
    uid INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
);

-- 3. Events: Added course_code, room, meeting_day, and max_members
-- These match your ItemCreate and ItemResponse schemas
CREATE TABLE events (
    eid INTEGER PRIMARY KEY AUTOINCREMENT,
    organizer_id INTEGER,
    name VARCHAR(100) NOT NULL,
    course_code VARCHAR(12),
    description TEXT,
    location_id INTEGER,
    room VARCHAR(20),
    meeting_day VARCHAR(20),
    meeting_time VARCHAR(20),
    max_members INTEGER DEFAULT 10,
    start_time DATETIME,
    FOREIGN KEY (organizer_id) REFERENCES users(uid) ON DELETE SET NULL,
    FOREIGN KEY (location_id) REFERENCES locations(lid)
);

-- 4. Attendees
CREATE TABLE attendees (
    eid INTEGER,
    uid INTEGER,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (eid, uid),
    FOREIGN KEY (eid) REFERENCES events(eid) ON DELETE CASCADE,
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE
);

-- 5. Roles & Search History (Keep these as is)
CREATE TABLE roles (
    rid INTEGER PRIMARY KEY AUTOINCREMENT,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE user_roles (
    uid INTEGER,
    rid INTEGER,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (uid, rid),
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE,
    FOREIGN KEY (rid) REFERENCES roles(rid) ON DELETE CASCADE
);

CREATE TABLE search_history (
    search_id INTEGER PRIMARY KEY AUTOINCREMENT,
    uid INTEGER,
    search_query VARCHAR(255),
    results_count INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES users(uid)
);

-- 6. Indexes for Performance
CREATE INDEX idx_course_code ON events(course_code);
CREATE INDEX idx_location_name ON locations(name);

INSERT INTO users (username, email, password_hash) 
VALUES ('testuser', 'test@example.com', 'hashed_password');

INSERT INTO users (username, email, password_hash) 
VALUES ('testuser2', 'test2@example.com', 'hashed_password2');

SELECT * FROM users