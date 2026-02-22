-- Locations
CREATE TABLE locations (
    lid INTEGER PRIMARY KEY AUTOINCREMENT,
    building VARCHAR(100) NOT NULL,
    room VARCHAR(8) NOT NULL
);

-- Users
CREATE TABLE users (
    uid INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_login DATETIME
);

-- Study Events
CREATE TABLE events (
    eid INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id INTEGER,
    name VARCHAR(100) NOT NULL,
    course_code VARCHAR(12) NOT NULL,
    description TEXT,
    max_members INTEGER NOT NULL,
    meeting_day VARCHAR(8),
    meeting_time VARCHAR(8),
    building VARCHAR(32),
    room VARCHAR(8),
    next_meeting VARCHAR(32),
    FOREIGN KEY (owner_id) REFERENCES users(uid) ON DELETE SET NULL
);

-- Event Attendees
CREATE TABLE attendees (
    eid INTEGER,
    uid INTEGER,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (eid, uid),
    FOREIGN KEY (eid) REFERENCES events(eid) ON DELETE CASCADE,
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE
);

-- Roles
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

-- Search
CREATE TABLE search_history (
    search_id INTEGER PRIMARY KEY AUTOINCREMENT,
    uid INTEGER,
    search_query VARCHAR(255),
    results_count INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES users(uid)
);

INSERT INTO users (uid, username, email, password_hash) VALUES (5, 'testuser', 'test@test.com', 'testhash');