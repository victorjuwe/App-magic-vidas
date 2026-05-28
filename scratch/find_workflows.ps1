Get-ChildItem -Path "C:\IA\Data" -Filter "*.json" -Recurse -ErrorAction SilentlyContinue | Where-Object { $_.FullName -like "*workflow*" } | Select-Object FullName, Length | Select-Object -First 20
