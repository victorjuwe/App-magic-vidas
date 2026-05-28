Select-String -Path "c:\TRABAJOS IA\MAGIC THE GATHERING\contador\style.css" -Pattern "transform" -Context 0,2 | Select-Object -First 30
Select-String -Path "c:\TRABAJOS IA\MAGIC THE GATHERING\contador\style.css" -Pattern "#p1" -Context 0,5 | Select-Object -First 10
