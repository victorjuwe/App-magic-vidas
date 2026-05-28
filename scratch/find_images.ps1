Get-ChildItem -Path "c:\TRABAJOS IA\MAGIC THE GATHERING\contador" -Filter "*.png" -Recurse -ErrorAction SilentlyContinue | Select-Object FullName, Length
Get-ChildItem -Path "c:\TRABAJOS IA\MAGIC THE GATHERING\contador" -Filter "*.jpg" -Recurse -ErrorAction SilentlyContinue | Select-Object FullName, Length
