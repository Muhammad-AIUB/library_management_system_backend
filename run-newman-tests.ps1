# PowerShell script to run Newman tests

# Check if Newman is installed globally
try {
    $newmanVersion = newman --version
    Write-Host "Newman version: $newmanVersion"
} catch {
    Write-Host "Newman is not installed. Installing newman and newman-reporter-htmlextra..."
    npm install -g newman newman-reporter-htmlextra
}

# Create reports directory if it doesn't exist
if (!(Test-Path -Path "newman-reports")) {
    New-Item -ItemType Directory -Path "newman-reports"
}

# Get current date for report name
$date = Get-Date -Format "yyyy-MM-dd"
$reportPath = "newman-reports\report-$date.html"

# Run Newman with the collection and environment
Write-Host "🚀 Running API tests with Newman..."

newman run ".\postman\Library_Management_System.postman_collection.json" `
  -e ".\postman\environment.json" `
  -r cli,htmlextra `
  --reporter-htmlextra-export $reportPath `
  --reporter-htmlextra-title "Library Management System API Test Report" `
  --reporter-htmlextra-browserTitle "LMS API Tests" `
  --reporter-htmlextra-titleSize 4 `
  --reporter-htmlextra-omitHeaders `
  --reporter-htmlextra-skipSensitiveData `
  --reporter-htmlextra-showEnvironmentData

# Check exit status
if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 All tests passed!"
} else {
    Write-Host "❌ Some tests failed!"
    exit 1
} 