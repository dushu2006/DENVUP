@echo off
setlocal
python "%~dp0validate_pack.py"
if errorlevel 1 (
  echo.
  echo Validation failed. Review the messages above.
  exit /b 1
)
echo.
echo Skill pack validation passed.
