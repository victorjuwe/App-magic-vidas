Select-String -Path "c:\TRABAJOS IA\MAGIC THE GATHERING\contador\style.css" -Pattern "theme-frame" -Context 2,5
Select-String -Path "c:\TRABAJOS IA\MAGIC THE GATHERING\contador\style.css" -Pattern "data-theme" -Context 0,4 | Select-Object -First 30
