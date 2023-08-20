@echo off

REM Start wss.js for the server
start cmd /k node backend/wss.js

REM Start main.py for the bot
start cmd /k python main.py