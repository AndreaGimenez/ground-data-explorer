.PHONY: help run install test clean dev

# Default target
help:
	@echo "Available commands:"
	@echo "  make run      - Start the development server"
	@echo "  make dev      - Same as run"
	@echo "  make install  - Install dependencies"
	@echo "  make test     - Run tests"
	@echo "  make clean    - Clean cache files"

# Run development server
run: dev

dev:
	@echo "🚀 Starting server..."
	@source venv/bin/activate && uvicorn app.main:app --reload --port 8000

# Install dependencies
install:
	@echo "📥 Installing dependencies..."
	@pip install -r requirements.txt

# Run tests
test:
	@echo "🧪 Running tests..."
	@pytest -v

# Clean cache
clean:
	@echo "🧹 Cleaning cache files..."
	@find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	@find . -type f -name "*.pyc" -delete
	@echo "✅ Clean complete"