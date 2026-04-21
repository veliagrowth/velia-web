@echo off
SET FFMPEG=C:\Users\JPR\AppData\Local\Programs\Stremio\ffmpeg.exe
SET TMP=%~dp0tmp
SET OUT=%~dp0

echo Comprimiendo reel-01...
"%FFMPEG%" -y -i "%TMP%\reel-01-orig.mp4" -vf "scale=720:-2" -c:v libx264 -crf 27 -preset fast -an -movflags +faststart "%OUT%reel-01.mp4"

echo Comprimiendo reel-05...
"%FFMPEG%" -y -i "%TMP%\reel-05-orig.mp4" -vf "scale=720:-2" -c:v libx264 -crf 27 -preset fast -an -movflags +faststart "%OUT%reel-05.mp4"

echo Listo. Archivos generados:
dir /b "%OUT%reel-01.mp4" "%OUT%reel-05.mp4" 2>nul
pause
