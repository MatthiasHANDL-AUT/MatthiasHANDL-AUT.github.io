$root = [IO.Path]::GetFullPath((Get-Location).Path).TrimEnd('\', '/')
$rootPrefix = $root + [IO.Path]::DirectorySeparatorChar
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:8080/")
$listener.Start()
Write-Output "Serving $root on http://localhost:8080"
$mime = @{
  '.html'='text/html; charset=utf-8'; '.css'='text/css'; '.js'='application/javascript'
  '.png'='image/png'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'; '.ico'='image/x-icon'; '.svg'='image/svg+xml'
}
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  try {
    $path = $ctx.Request.Url.LocalPath
    if ($path -eq '/') { $path = '/index.html' }
    if ($path.Contains('..') -or $path.Contains('\') -or $path.Contains(':')) {
      $ctx.Response.StatusCode = 403
      $ctx.Response.Close()
      continue
    }
    $local = [IO.Path]::GetFullPath((Join-Path $root ($path.TrimStart('/') -replace '/','\')))
    if (Test-Path -LiteralPath $local -PathType Container) { $local = Join-Path $local 'index.html' }
    if (-not $local.StartsWith($rootPrefix, [StringComparison]::OrdinalIgnoreCase)) {
      $ctx.Response.StatusCode = 403
    } elseif (Test-Path -LiteralPath $local -PathType Leaf) {
      $bytes = [IO.File]::ReadAllBytes($local)
      $ext = [IO.Path]::GetExtension($local).ToLower()
      if ($mime.ContainsKey($ext)) { $ctx.Response.ContentType = $mime[$ext] } else { $ctx.Response.ContentType = 'application/octet-stream' }
      $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $ctx.Response.StatusCode = 404
    }
  } catch { $ctx.Response.StatusCode = 500 }
  $ctx.Response.Close()
}
