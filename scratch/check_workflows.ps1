if (Test-Path "C:\IA\Data\Workflows") {
    Get-ChildItem -Path "C:\IA\Data\Workflows" -Filter "*.json" | Select-Object Name, Length
} else {
    Write-Output "C:\IA\Data\Workflows does not exist."
}
if (Test-Path "c:\TRABAJOS IA\MAGIC THE GATHERING\contador\scratch") {
    Get-ChildItem -Path "c:\TRABAJOS IA\MAGIC THE GATHERING\contador\scratch" -Filter "*.json" | Select-Object Name, Length
}
