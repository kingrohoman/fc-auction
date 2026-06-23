$ErrorActionPreference = 'Stop'

$runtimeRoot = Join-Path $env:LOCALAPPDATA 'NexusDev\fc-auction-runtime'
New-Item -ItemType Directory -Force -Path $runtimeRoot | Out-Null

Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'package.json') -Destination $runtimeRoot -Force
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'index.html') -Destination $runtimeRoot -Force
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'src') -Destination $runtimeRoot -Recurse -Force

Push-Location $runtimeRoot
try {
  if (-not (Test-Path -LiteralPath (Join-Path $runtimeRoot 'node_modules'))) {
    npm install --no-audit --no-fund
  }
  npm run dev
}
finally {
  Pop-Location
}
