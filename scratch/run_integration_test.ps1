# Wait for server to boot
Start-Sleep -Seconds 2

$body = @{
    theme_id = "bleach_local"
    theme_name = "Bleach Local"
    prompt = "Anime Shinigami soul energy border frame for a mobile game interface, vertical 9:16 layout, symmetrical composition split in the center by a dark black line. Two clean, rectangular dark hollow areas in the upper-middle and lower-middle for UI text. Epic black sword katana silhouettes, glowing neon purple and bright orange spiritual energy fire flames (reiatsu) on the left and right borders. Shinto shrines runes, dark moody atmosphere, highly detailed anime vector style, cinematic lighting"
    negative_prompt = "blurry, low quality, distorted, out of focus, bad proportions, watermark"
    dmg = @("¡Bankai!", "Siente el reiatsu...", "¡Kurosaki-kun!", "Dispersión, Senbonzakura", "¿Te parece que esto es poder?", "Colapso espiritual", "¡Ruge, Zabimaru!", "¿Acaso puedes seguir mi ritmo?")
    heal = @("Getsuga Tensho", "Máxima energía espiritual", "Control del Hollow", "Barrera de los seis escudos", "Poder reconstituido", "Llanto del alma", "Kido de curación", "Reiatsu restaurado")
} | ConvertTo-Json -Depth 4

Write-Output "Sending generate request..."
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/api/generate" -Method Post -Body $body -ContentType "application/json"
    Write-Output "Response: $($response | Out-String)"
} catch {
    Write-Error "Failed to send generation request: $_"
    exit 1
}

# Polling loop
Write-Output "Starting polling loop..."
$generating = $true
while ($generating) {
    Start-Sleep -Seconds 3
    try {
        $status = Invoke-RestMethod -Uri "http://localhost:8000/api/status" -Method Get
        Write-Output "Status: $($status.generation_status) | Progress: $($status.progress)% | Msg: $($status.status_text)"
        if ($status.generation_status -ne "generating") {
            $generating = $false
            Write-Output "Finished. Final Status: $($status.generation_status)"
        }
    } catch {
        Write-Warning "Error polling status: $_"
    }
}
