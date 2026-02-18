#!/usr/bin/env python3
"""
Initialize the database: create tables and seed data.
Run this once to set up your database.
"""
from app.database import init_db, seed_initial_data, SessionLocal

if __name__ == "__main__":
    print("🔧 Initializing database...")
    
    # Create tables
    init_db()
    
    # Seed data
    db = SessionLocal()
    try:
        seed_initial_data(db)
    finally:
        db.close()
    
    print("✅ Database initialization complete!")