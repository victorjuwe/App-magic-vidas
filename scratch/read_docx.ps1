Add-Type -AssemblyName System.IO.Compression.FileSystem
$docxPath = "c:\TRABAJOS IA\MAGIC THE GATHERING\contador\por si viene bien conflui.docx"
$zip = [System.IO.Compression.ZipFile]::OpenRead($docxPath)
$entry = $zip.GetEntry("word/document.xml")
$stream = $entry.Open()
$reader = [System.IO.StreamReader]::new($stream)
$xmlText = $reader.ReadToEnd()
$reader.Close()
$stream.Close()
$zip.Dispose()

[xml]$xml = $xmlText
# Extract namespace manager to deal with w: namespace
$ns = [System.Xml.XmlNamespaceManager]::new($xml.NameTable)
$ns.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
$paragraphs = $xml.SelectNodes("//w:p", $ns)

foreach ($p in $paragraphs) {
    $text = ""
    $runs = $p.SelectNodes(".//w:t", $ns)
    foreach ($r in $runs) {
        $text += $r.InnerText
    }
    if ($text) {
        Write-Output $text
    }
}
