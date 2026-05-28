Get-ChildItem -Path "C:\IA\Data\Packages\ComfyUI" | Select-Object Name, Attributes
if (Test-Path "C:\IA\Data\Packages\ComfyUI\venv") {
    Write-Output "--- Venv bin/Scripts ---"
    Get-ChildItem -Path "C:\IA\Data\Packages\ComfyUI\venv" | Select-Object Name, Attributes
}
