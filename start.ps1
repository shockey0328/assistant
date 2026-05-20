# 一键启动本地服务并打开浏览器
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

function Find-PythonExe {
    $candidates = @(
        (Get-Command python -ErrorAction SilentlyContinue)?.Source,
        (Get-Command py -ErrorAction SilentlyContinue)?.Source,
        "$env:USERPROFILE\miniforge3\python.exe",
        "$env:USERPROFILE\miniconda3\python.exe",
        "$env:USERPROFILE\anaconda3\python.exe",
        "$env:USERPROFILE\miniforge3\envs\xq-lesson-4\python.exe",
        "$env:USERPROFILE\miniforge3\envs\feedback-assistant\python.exe"
    ) | Where-Object { $_ -and (Test-Path $_) }

    if ($candidates.Count -gt 0) { return $candidates[0] }
    return $null
}

$py = Find-PythonExe
if (-not $py) {
    Write-Host "[错误] 未找到 Python 3。请安装 Python 或 Conda（Miniforge）。" -ForegroundColor Red
    Read-Host "按 Enter 退出"
    exit 1
}

Write-Host "正在启动橙子学反馈分析助手..."
Write-Host "使用 Python: $py"
Write-Host "http://localhost:8080/index.html"
Start-Process "http://localhost:8080/index.html"

if ((Split-Path -Leaf $py) -eq "py.exe") {
    & py -3 -m http.server 8080
} else {
    & $py -m http.server 8080
}
