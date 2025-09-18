@echo off
:: =============================================
:: Deploy Angular App to XAMPP - One-Click Script
:: =============================================
setlocal

echo  Syncing PHP files to XAMPP htdocs...

:: ============ CONFIGURE THESE PATHS ============
set "SOURCE_DIR=api\"
set "DEST_DIR=C:\xampp\htdocs\api"
:: =============================================

:: Check if source directory exists
if not exist "%SOURCE_DIR%" (
    echo  Source folder not found: %SOURCE_DIR%
    echo    Please check the path in the script.
    pause
    exit /b 1
)

if exist "%DEST_DIR%" (
    rd /s /q "%DEST_DIR%"
    if %errorlevel% neq 0 (
        echo  Failed to delete old folder. Do you have it open in another program?
        pause
        exit /b %errorlevel%
    )
)

:: Create destination folder if it doesn't exist
if not exist "%DEST_DIR%" (
    echo Creating destination folder: %DEST_DIR%
    mkdir "%DEST_DIR%"
    if %errorlevel% neq 0 (
        echo  Failed to create folder!
        pause
        exit /b %errorlevel%
    )
)



:: Copy all .php and related files
echo Copying PHP files...
xcopy "%SOURCE_DIR%\*.php" "%DEST_DIR%" /Y /D /F >nul
@REM xcopy "%SOURCE_DIR%\*.json" "%DEST_DIR%" /Y /D /F >nul
@REM xcopy "%SOURCE_DIR%\*.txt" "%DEST_DIR%" /Y /D /F >nul
@REM xcopy "%SOURCE_DIR%\helpers" "%DEST_DIR%\helpers\" /E /Y /D /F >nul

if %errorlevel% leq 1 (
    echo  Files copied successfully!
) else (
    echo  Error during copy!
    pause
    exit /b %errorlevel%
)

:: Optional: Show what was updated
echo.
echo   Sync complete:
echo    From: %SOURCE_DIR%
echo    To:   %DEST_DIR%
echo.

echo Building Angular app for production...
call ng build 

if %errorlevel% neq 0 (
    echo.
    echo  Build failed! Check for errors above.
    pause
    exit /b %errorlevel%
)

echo.
echo Cleaning and copying files to XAMPP htdocs...
set "XAMPP_DIR=C:\xampp\htdocs\technews"

:: Remove old files if they exist
if exist "%XAMPP_DIR%" (
    rd /s /q "%XAMPP_DIR%"
    if %errorlevel% neq 0 (
        echo  Failed to delete old folder. Do you have it open in another program?
        pause
        exit /b %errorlevel%
    )
)

:: Create new directory
md "%XAMPP_DIR%"

:: Copy dist files (adjust path based on your output)
:: Assumes: dist/TechNewsApp/*  OR  dist/browser/*
set "DIST_DIR=dist\TechNewsApp\browser"
if not exist "%DIST_DIR%" set "DIST_DIR=dist\browser"

xcopy "%DIST_DIR%" "%XAMPP_DIR%" /e /y /i >nul

if %errorlevel% neq 0 (
    echo  Failed to copy files!
    pause
    exit /b %errorlevel%
)

echo.
echo Creating .htaccess file for routing...
(
echo.^<IfModule mod_rewrite.c^>
echo.  RewriteEngine On
echo.  RewriteBase /technews/
echo.  RewriteRule ^index\.html$ - [L]
echo.  RewriteCond %%{REQUEST_FILENAME} !-f
echo.  RewriteCond %%{REQUEST_FILENAME} !-d
echo.  RewriteRule . /technews/index.html [L]
echo.^</IfModule^>
) > "%XAMPP_DIR%\.htaccess"

echo.
echo Deployment successful! 
:: echo Starting Apache (if not already running)...

:: Optional: Start Apache via XAMPP (only if xampp_start is available)
:: Uncomment next lines if you want to auto-start Apache
:: start "" "C:\xampp\xampp_start.exe"
:: timeout /t 5 >nul

echo.
echo Opening http://localhost/technews in your browser...
start http://localhost/technews/

echo.
echo Done!