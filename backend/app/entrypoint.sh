#!/bin/bash
set -e

echo "🔍 Waiting for database..."

# Wait for database to be ready
until python -c "import psycopg2; psycopg2.connect('$DATABASE_URL')" 2>/dev/null; do
  echo "⏳ Database not ready yet..."
  sleep 2
done

echo "✅ Database is ready!"

# Initialize database (create tables)
echo "🔧 Initializing database..."
python init_db.py

# Start the server
echo "🚀 Starting FastAPI server..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload