# ---------------------------------------------------------------
#  bump_cache.ps1  -  Sube la version de cache del Service Worker
# ---------------------------------------------------------------
#  Incrementa magic-bo3-vNN en service-worker.js y, a la vez, los
#  ?v=NN de style.css y engine.js en contador.html, para que los
#  moviles que ya tienen la PWA instalada se traigan los archivos
#  nuevos en vez de servir los viejos desde cache.
#
#  Los tres numeros DEBEN ir sincronizados.
#
#  Vivia en scratch/, que esta en .gitignore: por eso se perdio y
#  subir.bat llevaba tiempo fallando en silencio en este paso.
# ---------------------------------------------------------------

$ErrorActionPreference = 'Stop'

# La raiz del proyecto es la carpeta padre de herramientas/
$raiz = Split-Path -Parent $PSScriptRoot
$sw   = Join-Path $raiz 'service-worker.js'
$html = Join-Path $raiz 'contador.html'

foreach ($f in @($sw, $html)) {
    if (-not (Test-Path $f)) {
        Write-Host "[ERROR] No encuentro $f" -ForegroundColor Red
        exit 1
    }
}

# --- Leer la version actual del Service Worker ---
$swTexto = Get-Content $sw -Raw -Encoding UTF8
if ($swTexto -notmatch "magic-bo3-v(\d+)") {
    Write-Host "[ERROR] No encuentro 'magic-bo3-vNN' en service-worker.js" -ForegroundColor Red
    exit 1
}

$actual  = [int]$Matches[1]
$nueva   = $actual + 1

Write-Host "[*] Cache del Service Worker: v$actual -> v$nueva"

# --- service-worker.js ---
$swTexto = $swTexto -replace "magic-bo3-v\d+", "magic-bo3-v$nueva"
# El comentario de cabecera tambien lleva la version
$swTexto = $swTexto -replace "Estrategia \(v\d+\)", "Estrategia (v$nueva)"
$swTexto = $swTexto -replace "style\.css\?v=\d+", "style.css?v=$nueva"
[System.IO.File]::WriteAllText($sw, $swTexto, (New-Object System.Text.UTF8Encoding $false))

# --- contador.html ---
$htmlTexto = Get-Content $html -Raw -Encoding UTF8
$htmlTexto = $htmlTexto -replace "style\.css\?v=\d+",  "style.css?v=$nueva"
$htmlTexto = $htmlTexto -replace "engine\.js\?v=\d+",  "engine.js?v=$nueva"
[System.IO.File]::WriteAllText($html, $htmlTexto, (New-Object System.Text.UTF8Encoding $false))

# --- Comprobacion: los tres numeros deben coincidir ---
$comprobar = (Get-Content $sw -Raw -Encoding UTF8), (Get-Content $html -Raw -Encoding UTF8)
$versiones = @()
if ($comprobar[0] -match "magic-bo3-v(\d+)")  { $versiones += $Matches[1] }
if ($comprobar[1] -match "style\.css\?v=(\d+)") { $versiones += $Matches[1] }
if ($comprobar[1] -match "engine\.js\?v=(\d+)") { $versiones += $Matches[1] }

if (($versiones | Select-Object -Unique).Count -ne 1) {
    Write-Host "[ERROR] Las versiones no han quedado sincronizadas: $($versiones -join ', ')" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] service-worker.js y contador.html actualizados a v$nueva" -ForegroundColor Green
exit 0
