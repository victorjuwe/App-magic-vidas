Add-Type -AssemblyName System.Drawing
function Get-ImageDetails($path) {
    if (Test-Path $path) {
        $img = [System.Drawing.Image]::FromFile($path)
        Write-Output "$($path): $($img.Width)x$($img.Height)"
        $img.Dispose()
    } else {
        Write-Output "$($path) not found"
    }
}
Get-ImageDetails "c:\TRABAJOS IA\MAGIC THE GATHERING\contador\themes\rickmorty\frame.png"
Get-ImageDetails "c:\TRABAJOS IA\MAGIC THE GATHERING\contador\themes\rickmorty\top.png"
Get-ImageDetails "c:\TRABAJOS IA\MAGIC THE GATHERING\contador\themes\rickmorty\bottom.png"
