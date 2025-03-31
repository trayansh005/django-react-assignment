# User Portal Application

## Project Structure
```
.
├── backend/         # Django REST API (port 8000)
├── frontend/        # ReactJS Frontend (port 5173)
└── README.md
```

## Prerequisites
- Node.js v18+
- Python 3.10+
- npm v9+

## Setup Instructions

### Backend Setup (Django)
1. Create virtual environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # Linux/MacOS
   # OR
   .\venv\Scripts\activate  # Windows
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run migrations:
   ```bash
   python manage.py migrate
   ```
4. Start server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup (ReactJS)
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```

## Running the Application
1. Start both servers in separate terminals:
   - Backend: `python manage.py runserver` (http://localhost:8000)
   - Frontend: `npm run dev` (http://localhost:5173)
2. Access application at http://localhost:5173

## Configuration Details

### Database Configuration
Neon DB is already configured in `settings.py`:
```python
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "python-app",
        "USER": "python-app_owner",
        "PASSWORD": "npg_NquS6vOD0WYc",
        "HOST": "ep-solitary-leaf-a1yafgio-pooler.ap-southeast-1.aws.neon.tech",
        "PORT": "5432",
        "OPTIONS": {"sslmode": "require"}
    }
}
```

### Security Note
🔒 **Important Security Considerations**:
- Remove credentials before making repository public
- Consider using environment variables for sensitive data
- Rotate credentials regularly through Neon dashboard

## Tech Stack
- **Frontend**: React + Vite (port 5173)
- **Backend**: Django 4.2 + PostgreSQL (Neon)
- **Authentication**: Session-based
- **API Communication**: Direct Axios calls to http://localhost:8000

## Troubleshooting
- If getting connection errors:
  - Verify Neon DB connection status
  - Check firewall settings for port 5432
- CORS errors: Add to `settings.py`:
  ```python
  CORS_ALLOWED_ORIGINS = [
      "http://localhost:5173",
      "http://127.0.0.1:5173"
  ]
  ```
- Port conflicts: Ensure no other services using ports 5173/8000
