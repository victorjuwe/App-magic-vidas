@echo off
chcp 65001 > nul
echo =======================================================
echo        MTG COUNTER - SUBIR CAMBIOS A GITHUB
echo =======================================================
echo.

:: 1. Añadir archivos al área de preparación
echo [1/3] Añadiendo cambios a Git...
git add .
if %errorlevel% neq 0 (
    echo.
    echo ❌ Error al añadir cambios. Asegúrate de estar en el directorio correcto.
    pause
    exit /b
)

:: 2. Preguntar por el mensaje del commit
echo.
set /p msg="Introduce el mensaje del cambio (ej. 'arreglo de interfaz' o pulsa Enter para automático): "

:: Si el mensaje está vacío, usar uno por defecto
if "%msg%"=="" set msg=Actualización automática de la aplicación

:: Crear el commit
echo.
echo [2/3] Creando commit...
git commit -m "%msg%"
if %errorlevel% neq 0 (
    echo.
    echo ⚠️ No hay cambios nuevos detectados para subir.
    pause
    exit /b
)

:: 3. Subir cambios a GitHub
echo.
echo [3/3] Subiendo cambios a GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo.
    echo ❌ Error al subir cambios a GitHub. Comprueba tu conexión o credenciales.
    pause
    exit /b
)

echo.
echo =======================================================
echo ✅ ¡CAMBIOS SUBIDOS CON ÉXITO A GITHUB!
echo =======================================================
echo.
pause
