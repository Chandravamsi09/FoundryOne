@echo off
echo ========================================================
echo Starting FoundryOne Enterprise Stack (No Docker Required)
echo ========================================================

echo.
echo [1/3] Setting up Python Backend...
cd backend
if not exist "venv\Scripts\activate.bat" (
    echo Creating Python virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat
echo Installing backend dependencies...
pip install -r requirements.txt
pip install aiosqlite
echo Downgrading bcrypt to fix passlib bug...
pip install bcrypt==3.2.2

echo.
echo [2/3] Seeding Local Database...
set PYTHONPATH=.
python scripts\seed_database.py

echo.
echo [3/3] Starting Servers...
echo Starting Backend Server on Port 8000...
start cmd /k "title FoundryOne Backend && call venv\Scripts\activate.bat && set PYTHONPATH=. && uvicorn app.main:app --host 0.0.0.0 --port 8000"

cd ..\frontend
echo Starting Frontend Server on Port 5173...
start cmd /k "title FoundryOne Frontend && npm install && npm run dev"

echo.
echo ========================================================
echo Servers are booting up in separate windows!
echo Please wait about 10 seconds for them to fully start.
echo.
echo Your Frontend will be available at: http://localhost:5173
echo Login with: admin@foundryone.com / password123
echo ========================================================
pause
