# Start a local web server for the synth app
Write-Host "Starting local web server..." -ForegroundColor Cyan

# Try Python first
$pythonExists = Get-Command python -ErrorAction SilentlyContinue
if ($pythonExists) {
    Write-Host "Using Python HTTP server on http://localhost:8000" -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    Start-Process "http://localhost:8000"
    python -m http.server 8000
    exit
}

# Try Node.js with npx http-server
$nodeExists = Get-Command node -ErrorAction SilentlyContinue
if ($nodeExists) {
    Write-Host "Using Node.js http-server on http://localhost:8080" -ForegroundColor Green
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    Start-Process "http://localhost:8080"
    npx -y http-server -p 8080
    exit
}

# Neither available
Write-Host "Error: Neither Python nor Node.js found!" -ForegroundColor Red
Write-Host "Please install Python or Node.js to run the local server." -ForegroundColor Yellow
pause
