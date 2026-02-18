#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Ground Data Explorer API...${NC}"

# Check if venv exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}⚠️  Virtual environment not found${NC}"
    echo -e "${BLUE}📦 Creating virtual environment...${NC}"
    python3 -m venv venv
    source venv/bin/activate
    echo -e "${BLUE}📥 Installing dependencies...${NC}"
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

echo -e "${GREEN}✅ Virtual environment activated${NC}"
echo -e "${BLUE}🌐 Server will start at http://localhost:8000${NC}"
echo -e "${BLUE}📚 API docs available at http://localhost:8000/docs${NC}"
echo -e "${YELLOW}Press CTRL+C to stop the server${NC}\n"

# Run the server
uvicorn app.main:app --reload --port 8000