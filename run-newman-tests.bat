@echo off
echo Running API tests with Newman...

if not exist "newman-reports" mkdir newman-reports

:: Run Newman with the collection and environment
newman run .\postman\Library_Management_System.postman_collection.json ^
  -e .\postman\environment.json ^
  -r cli,htmlextra ^
  --reporter-htmlextra-export ".\newman-reports\report-%date:~-4,4%-%date:~-7,2%-%date:~-10,2%.html" ^
  --reporter-htmlextra-title "Library Management System API Test Report" ^
  --reporter-htmlextra-browserTitle "LMS API Tests"

:: Check exit status
if %ERRORLEVEL% EQU 0 (
  echo All tests passed!
) else (
  echo Some tests failed!
  exit /b 1
) 