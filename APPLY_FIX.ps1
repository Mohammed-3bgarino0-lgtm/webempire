$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "WEB EMPIRE - Catalog Fetch Hotfix" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

$projectRoot = (Get-Location).Path
$packageJson = Join-Path $projectRoot "package.json"
$target = Join-Path $projectRoot "src\repositories\catalog.ts"
$source = Join-Path $PSScriptRoot "hotfix\catalog.ts"
$backup = Join-Path $projectRoot "src\repositories\catalog.ts.before-hotfix"

if (-not (Test-Path $packageJson)) {
    throw "شغّل الملف من جذر مشروع Web Empire، حيث يوجد package.json."
}

if (-not (Test-Path $target)) {
    throw "لم يتم العثور على src\repositories\catalog.ts داخل المشروع."
}

if (-not (Test-Path $source)) {
    throw "ملف الإصلاح hotfix\catalog.ts غير موجود."
}

Copy-Item $target $backup -Force
Copy-Item $source $target -Force

Remove-Item (Join-Path $projectRoot ".next") -Recurse -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "تم استبدال catalog.ts وإنشاء نسخة احتياطية:" -ForegroundColor Green
Write-Host $backup
Write-Host ""
Write-Host "تشغيل فحص TypeScript..." -ForegroundColor Yellow

npm run typecheck
if ($LASTEXITCODE -ne 0) {
    throw "فشل فحص TypeScript. أعد الملف الاحتياطي عند الحاجة."
}

Write-Host ""
Write-Host "الإصلاح نجح. شغّل الآن:" -ForegroundColor Green
Write-Host "npm run dev" -ForegroundColor White
