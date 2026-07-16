$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "WEB EMPIRE - Media Tools Pack" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

$projectRoot = (Get-Location).Path
$packageJson = Join-Path $projectRoot "package.json"
$patchRoot = Join-Path $PSScriptRoot "patch"

if (-not [System.IO.File]::Exists($packageJson)) {
    throw "Run this script from the Web Empire project root where package.json exists."
}

if (-not [System.IO.Directory]::Exists($patchRoot)) {
    throw "The patch folder was not found next to this script."
}

$targets = @(
    "src\components\media-tools\media-tool-workbench.tsx",
    "src\components\media-tools\media-tool-workbench.module.css",
    "src\app\(public)\[locale]\tools\[slug]\page.tsx",
    "supabase\migrations\202607141600_media_tools_pack.sql"
)

$backupRoot = Join-Path $projectRoot ("backup-media-tools-" + (Get-Date -Format "yyyyMMdd-HHmmss"))
[System.IO.Directory]::CreateDirectory($backupRoot) | Out-Null

foreach ($relativePath in $targets) {
    $source = Join-Path $patchRoot $relativePath
    $target = Join-Path $projectRoot $relativePath

    if (-not [System.IO.File]::Exists($source)) {
        throw "Patch file not found: $relativePath"
    }

    if ([System.IO.File]::Exists($target)) {
        $backup = Join-Path $backupRoot $relativePath
        $backupDirectory = [System.IO.Path]::GetDirectoryName($backup)
        [System.IO.Directory]::CreateDirectory($backupDirectory) | Out-Null
        [System.IO.File]::Copy($target, $backup, $true)
    }

    $targetDirectory = [System.IO.Path]::GetDirectoryName($target)
    [System.IO.Directory]::CreateDirectory($targetDirectory) | Out-Null
    [System.IO.File]::Copy($source, $target, $true)

    Write-Host "Applied: $relativePath" -ForegroundColor Green
}

$nextPath = Join-Path $projectRoot ".next"
if ([System.IO.Directory]::Exists($nextPath)) {
    Remove-Item -LiteralPath $nextPath -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "Running TypeScript validation..." -ForegroundColor Yellow

$npm = Get-Command npm.cmd -ErrorAction SilentlyContinue
if (-not $npm) {
    $npm = Get-Command npm -ErrorAction Stop
}

& $npm.Source run typecheck
if ($LASTEXITCODE -ne 0) {
    throw "TypeScript validation failed. Backup: $backupRoot"
}

Write-Host ""
Write-Host "Media tools files installed successfully." -ForegroundColor Green
Write-Host "Backup: $backupRoot"
Write-Host ""
Write-Host "Next step:" -ForegroundColor Yellow
Write-Host "Run this SQL file in Supabase SQL Editor:"
Write-Host "supabase\migrations\202607141600_media_tools_pack.sql" -ForegroundColor White
Write-Host ""
Write-Host "Then run: npm run dev" -ForegroundColor White
