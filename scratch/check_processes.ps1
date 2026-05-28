Get-Process | Where-Object { $_.Name -like "*stability*" -or $_.Name -like "*comfy*" -or $_.Name -like "*python*" } | Select-Object Name, Id, Path
Get-NetTCPConnection -State Listen | Where-Object { $_.LocalPort -eq 8188 -or $_.LocalPort -eq 7860 -or $_.LocalPort -eq 5000 } | Select-Object LocalAddress, LocalPort, State
