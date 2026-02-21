-- 1. Locations
CREATE TABLE locations (
    lid INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
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

-- 3. Courses
CREATE TABLE courses (
    cid INTEGER PRIMARY KEY AUTOINCREMENT,
    course_name VARCHAR(100) NOT NULL,
    course_code VARCHAR(10) UNIQUE,
    description TEXT
);

-- 4. Enrollments
CREATE TABLE enrollments (
    uid INTEGER,
    cid INTEGER,
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (uid, cid),
    FOREIGN KEY(uid) REFERENCES users(uid) ON DELETE CASCADE,
    FOREIGN KEY(cid) REFERENCES courses(cid) ON DELETE CASCADE
);

-- 5. Study Events
CREATE TABLE events (
    eid INTEGER PRIMARY KEY AUTOINCREMENT,
    organizer_id INTEGER,
    course_id INTEGER,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    location_id INTEGER,
    start_time DATETIME,
    FOREIGN KEY (organizer_id) REFERENCES users(uid) ON DELETE SET NULL,
    FOREIGN KEY (location_id) REFERENCES locations(lid),
    FOREIGN KEY (course_id) REFERENCES courses(cid) ON DELETE CASCADE
);

-- 6. Event Attendees
CREATE TABLE attendees (
    eid INTEGER,
    uid INTEGER,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (eid, uid),
    FOREIGN KEY (eid) REFERENCES events(eid) ON DELETE CASCADE,
    FOREIGN KEY (uid) REFERENCES users(uid) ON DELETE CASCADE
);

-- 7. Roles & Search
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