Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("c:\TRABAJOS IA\MAGIC THE GATHERING\contador\themes\streetfighter\top.jpg")
Write-Output "Streetfighter top: $($img.Width)x$($img.Height)"
$img.Dispose()

$img2 = [System.Drawing.Image]::FromFile("c:\TRABAJOS IA\MAGIC THE GATHERING\contador\themes\streetfighter\bottom.jpg")
Write-Output "Streetfighter bottom: $($img2.Width)x$($img2.Height)"
$img2.Dispose()
