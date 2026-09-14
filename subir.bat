@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul 2>&1
echo =======================================================
echo        MTG COUNTER - SUBIR CAMBIOS A GITHUB
echo =======================================================
echo.

cd /d "%~dp0"

:: ---------------------------------------------------------
:: 1. Ver que hay que hacer
:: ---------------------------------------------------------
::    a) cambios sin commitear  -> bump + commit + push
::    b) sin cambios pero con commits sin subir -> solo push
::    c) nada de nada -> salir
:: ---------------------------------------------------------

:: Refrescamos la referencia del remoto para que la comprobacion de commits
:: pendientes sea fiable aunque haga tiempo que no se hace fetch.
git fetch origin main --quiet >nul 2>&1

set "hay_cambios="
for /f "tokens=*" %%i in ('git status --porcelain 2^>nul') do set "hay_cambios=1"

set "hay_commits="
for /f "tokens=*" %%i in ('git log --oneline origin/main..HEAD 2^>nul') do set "hay_commits=1"

if not defined hay_cambios if not defined hay_commits (
    echo [INFO] Todo esta subido. No hay nada que hacer.
    echo.
    pause
    exit /b
)

if not defined hay_cambios (
    echo [INFO] No hay archivos modificados, pero SI hay commits sin subir.
    echo        Salto directo al push.
    echo.
    goto :sincronizar
)

:: ---------------------------------------------------------
:: 2. Subir la version del Service Worker
::    Sin esto, los moviles con la PWA instalada siguen viendo
::    la version vieja desde cache.
:: ---------------------------------------------------------
echo [1/5] Actualizando version de cache del Service Worker...
powershell -NoProfile -ExecutionPolicy Bypass -File "herramientas\bump_cache.ps1"
if !errorlevel! neq 0 (
    echo.
    echo [ERROR] Fallo al subir la version de cache. Se aborta.
    echo         Los moviles no verian los cambios sin este paso.
    pause
    exit /b 1
)
echo.

:: ---------------------------------------------------------
:: 3. Anadir cambios
:: ---------------------------------------------------------
echo [2/5] Anadiendo cambios a Git...
git add .
if !errorlevel! neq 0 (
    echo.
    echo [ERROR] Error al anadir cambios. Comprueba que Git esta instalado.
    pause
    exit /b 1
)

:: ---------------------------------------------------------
:: 4. Commit
:: ---------------------------------------------------------
set "msg="
echo.
set /p msg="Mensaje del cambio (Enter para automatico): "
if not defined msg set msg=Actualizacion automatica de la aplicacion

echo.
echo [3/5] Creando commit...
git commit -m "!msg!"
if !errorlevel! neq 0 (
    echo.
    echo [ERROR] Error al crear el commit.
    pause
    exit /b 1
)

:sincronizar
:: ---------------------------------------------------------
:: 5. Pull + Push
:: ---------------------------------------------------------
echo.
echo [4/5] Sincronizando con GitHub (pull --rebase)...
git pull --rebase origin main
if !errorlevel! neq 0 (
    echo.
    echo [ERROR] Error al sincronizar. Resuelve los conflictos a mano.
    pause
    exit /b 1
)

echo.
echo [5/5] Subiendo a GitHub (push)...
git push origin main
if !errorlevel! neq 0 (
    echo.
    echo [ERROR] Error al subir los cambios a GitHub.
    pause
    exit /b 1
)

echo.
echo =======================================================
echo [OK] CAMBIOS SUBIDOS CON EXITO
echo =======================================================
echo.
echo  GitHub Pages tarda 1-2 minutos en publicar.
echo.
echo  En el movil: abre la app, cierrala del todo (desliza
echo  hacia arriba en el selector de apps) y vuelve a abrirla.
echo  Deberia recargarse sola con la version nueva.
echo.
pause
