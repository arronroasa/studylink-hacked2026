import sqlite3
import os

def init_db():
    with sqlite3.connect("database.db") as conn:
        with open("/database/database.sql", "r") as f:
            conn.executescript(f.read())
    print("Database initialized successfully")