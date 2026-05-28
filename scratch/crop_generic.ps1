param (
    [string]$SrcPath,
    [string]$DestPath
)

Add-Type -AssemblyName System.Drawing
Write-Host "Cropping source: $SrcPath"
Write-Host "Saving destination: $DestPath"

$srcImg = [System.Drawing.Image]::FromFile($SrcPath)
$srcWidth = $srcImg.Width
$srcHeight = $srcImg.Height

$newWidth = [int]($srcHeight * 9 / 16)
$xOffset = [int](($srcWidth - $newWidth) / 2)

$bmp = New-Object System.Drawing.Bitmap $newWidth, $srcHeight
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.DrawImage($srcImg, (New-Object System.Drawing.Rectangle 0, 0, $newWidth, $srcHeight), (New-Object System.Drawing.Rectangle $xOffset, 0, $newWidth, $srcHeight), [System.Drawing.GraphicsUnit]::Pixel)

$srcImg.Dispose()
$g.Dispose()

$bmp.Save($DestPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Host "Image successfully cropped to 9:16 vertical ratio!"
