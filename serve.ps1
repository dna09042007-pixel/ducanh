$prefix = "http://127.0.0.1:8000/"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()
Write-Output "Serving $PWD at $prefix. Press Ctrl+C to stop."
while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
    } catch {
        break
    }
    $request = $context.Request
    $response = $context.Response
    $path = $request.Url.AbsolutePath
    if ($path -eq "/" -or $path -eq "") { $path = "/index.html" }
    $localPath = Join-Path (Get-Location) ($path.TrimStart("/"))
    if (Test-Path $localPath) {
        $bytes = [System.IO.File]::ReadAllBytes($localPath)
        $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
        switch ($ext) {
            ".html" { $ctype="text/html" }
            ".css" { $ctype="text/css" }
            ".js" { $ctype="application/javascript" }
            ".png" { $ctype="image/png" }
            ".jpg" { $ctype="image/jpeg" }
            ".jpeg" { $ctype="image/jpeg" }
            ".gif" { $ctype="image/gif" }
            default { $ctype="application/octet-stream" }
        }
        $response.ContentType = $ctype
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes,0,$bytes.Length)
    } else {
        $response.StatusCode = 404
        $msg = "Not Found"
        $buf = [System.Text.Encoding]::UTF8.GetBytes($msg)
        $response.ContentType = 'text/plain'
        $response.ContentLength64 = $buf.Length
        $response.OutputStream.Write($buf,0,$buf.Length)
    }
    $response.Close()
}
$listener.Stop()
$listener.Close()
Write-Output "Server stopped."