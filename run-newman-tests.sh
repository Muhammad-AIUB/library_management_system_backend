#!/bin/bash

# Check if Newman is installed globally
if ! command -v newman &> /dev/null
then
    echo "Newman is not installed. Installing newman and newman-reporter-htmlextra..."
    npm install -g newman newman-reporter-htmlextra
fi

# Create reports directory if it doesn't exist
mkdir -p newman-reports

# Run Newman with the collection and environment
echo "🚀 Running API tests with Newman..."

newman run ./postman/Library_Management_System.postman_collection.json \
  -e ./postman/environment.json \
  -r cli,htmlextra \
  --reporter-htmlextra-export "./newman-reports/report-$(date +%Y-%m-%d).html" \
  --reporter-htmlextra-title "Library Management System API Test Report" \
  --reporter-htmlextra-browserTitle "LMS API Tests" \
  --reporter-htmlextra-titleSize 4 \
  --reporter-htmlextra-omitHeaders \
  --reporter-htmlextra-skipSensitiveData \
  --reporter-htmlextra-showEnvironmentData

# Check exit status
if [ $? -eq 0 ]; then
  echo "🎉 All tests passed!"
else
  echo "❌ Some tests failed!"
  exit 1
fi 