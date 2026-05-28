$filePath = "service-worker.js"
if (Test-Path $filePath) {
    # Read with UTF-8 encoding to preserve characters like em-dash and accents
    $content = Get-Content -Path $filePath -Raw -Encoding UTF8
    if ($content -match "const CACHE = 'magic-bo3-v(\d+)';") {
        $oldVer = $Matches[1]
        $newVer = [int]$oldVer + 1
        $content = $content -replace "const CACHE = 'magic-bo3-v\d+';", "const CACHE = 'magic-bo3-v$newVer';"
        
        # Write back as clean UTF-8 without BOM
        $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
        [System.IO.File]::WriteAllText((Resolve-Path $filePath), $content, $utf8NoBom)
        Write-Output "BUMPED: Service Worker cache version updated from v$oldVer to v$newVer"
    } else {
        Write-Warning "Could not find CACHE version pattern in service-worker.js"
    }
} else {
    Write-Error "service-worker.js not found!"
}
