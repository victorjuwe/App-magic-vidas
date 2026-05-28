@echo off
setlocal enabledelayedexpansion
echo =======================================================
echo        MTG COUNTER - SUBIR CAMBIOS A GITHUB
echo =======================================================
echo.

:: 1. Comprobar si hay cambios locales
set "has_changes="
for /f "tokens=*" %%i in ('git status --porcelain') do set "has_changes=1"

if not defined has_changes (
    echo [INFO] No se detectaron cambios locales para subir.
    echo.
    pause
    exit /b
)

:: 2. Incrementar version del Service Worker para forzar actualizacion en clientes
echo [*] Actualizando cache del Service Worker...
powershell -ExecutionPolicy Bypass -File scratch/bump_cache.ps1
echo.

:: 3. Anadir todos los cambios
echo [1/4] Anadiendo cambios a Git...
git add .
if !errorlevel! neq 0 (
    echo.
    echo [ERROR] Error al anadir cambios. Asegurese de que Git esta instalado.
    pause
    exit /b
)

:: Limpiar variable por seguridad antes del prompt
set "msg="

:: 4. Preguntar por el mensaje del commit
echo.
set /p msg="Introduce el mensaje del cambio (o pulsa Enter para automatico): "

:: Usar "if not defined" para evitar que el script se cierre si el usuario escribe comillas o caracteres especiales
if not defined msg (
    set msg=Actualizacion automatica de la aplicacion
)

:: Crear el commit
echo.
echo [2/4] Creando commit...
git commit -m "!msg!"
if !errorlevel! neq 0 (
    echo.
    echo [ERROR] Error al crear el commit.
    pause
    exit /b
)

:: 5. Sincronizar con cambios remotos (Pull)
echo.
echo [3/4] Sincronizando con cambios remotos en GitHub (Pull)...
git pull --rebase origin main
if !errorlevel! neq 0 (
    echo.
    echo [ERROR] Error al sincronizar con el servidor. Resuelva conflictos manualmente.
    pause
    exit /b
)

:: 6. Subir a GitHub (Push)
echo.
echo [4/4] Subiendo cambios a GitHub (Push)...
git push origin main
if !errorlevel! neq 0 (
    echo.
    echo [ERROR] Error al subir cambios a GitHub.
    pause
    exit /b
)

echo.
echo =======================================================
echo [OK] CAMBIOS SUBIDOS CON EXITO A GITHUB
echo =======================================================
echo.
pause
