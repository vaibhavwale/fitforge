@echo off
echo ========================================
echo   FitForge - Fitness Tracking App
echo ========================================
echo.

REM Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Java is not installed or not in PATH
    echo Please install Java 21 or higher
    pause
    exit /b 1
)

echo [INFO] Java detected
echo.

REM Check if MySQL is accessible
echo [INFO] Checking MySQL connection...
mysql -u fituser -pFitForge@123 -e "USE fitforge;" >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Cannot connect to MySQL database
    echo Please ensure:
    echo   1. MySQL is running
    echo   2. Database 'fitforge' exists
    echo   3. User 'fituser' has access
    echo.
    echo Run this SQL to setup:
    echo   CREATE DATABASE fitforge;
    echo   CREATE USER 'fituser'@'localhost' IDENTIFIED BY 'FitForge@123';
    echo   GRANT ALL PRIVILEGES ON fitforge.* TO 'fituser'@'localhost';
    echo.
    set /p continue="Continue anyway? (y/n): "
    if /i not "%continue%"=="y" exit /b 1
)

echo.
echo [INFO] Building application...
call mvnw.cmd clean package -DskipTests

if %errorlevel% neq 0 (
    echo [ERROR] Build failed
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Build completed successfully!
echo.
echo [INFO] Starting FitForge application...
echo [INFO] Access the app at: http://localhost:8080
echo.
echo Press Ctrl+C to stop the server
echo.

call mvnw.cmd spring-boot:run
