Get-ChildItem -Path "C:\IA\Data" | Select-Object Name, Attributes
if (Test-Path "C:\IA\Data\Packages") {
    Write-Output "--- Packages ---"
    Get-ChildItem -Path "C:\IA\Data\Packages" | Select-Object Name, Attributes
}
