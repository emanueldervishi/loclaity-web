@echo off
setlocal EnableExtensions EnableDelayedExpansion

set "ZIPFILE="
set "DESTDIR="

:parse
if "%~1"=="" goto run
if /I "%~1"=="-d" (
  set "DESTDIR=%~2"
  shift
  shift
  goto parse
)
if "%~1"=="-q" (
  shift
  goto parse
)
if "%~1"=="-o" (
  shift
  goto parse
)
if "%~1"=="-qo" (
  shift
  goto parse
)
if "%~1"=="-oq" (
  shift
  goto parse
)
if not defined ZIPFILE set "ZIPFILE=%~1"
shift
goto parse

:run
if not defined ZIPFILE exit /b 1
if not defined DESTDIR set "DESTDIR=."
powershell -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -LiteralPath '%ZIPFILE%' -DestinationPath '%DESTDIR%' -Force"
exit /b %ERRORLEVEL%
