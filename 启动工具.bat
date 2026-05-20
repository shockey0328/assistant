@echo off
chcp 65001 >nul
cd /d "%~dp0"

set "PYTHON_EXE="

REM 1) PATH 中的 python / py
where python >nul 2>&1 && set "PYTHON_EXE=python"
if not defined PYTHON_EXE where py >nul 2>&1 && set "PYTHON_EXE=py -3"

REM 2) Miniforge / Anaconda 默认安装路径
if not defined PYTHON_EXE if exist "%USERPROFILE%\miniforge3\python.exe" set "PYTHON_EXE=%USERPROFILE%\miniforge3\python.exe"
if not defined PYTHON_EXE if exist "%USERPROFILE%\miniconda3\python.exe" set "PYTHON_EXE=%USERPROFILE%\miniconda3\python.exe"
if not defined PYTHON_EXE if exist "%USERPROFILE%\anaconda3\python.exe" set "PYTHON_EXE=%USERPROFILE%\anaconda3\python.exe"

REM 3) 常见 Conda 虚拟环境（按优先级）
if not defined PYTHON_EXE if exist "%USERPROFILE%\miniforge3\envs\xq-lesson-4\python.exe" set "PYTHON_EXE=%USERPROFILE%\miniforge3\envs\xq-lesson-4\python.exe"
if not defined PYTHON_EXE if exist "%USERPROFILE%\miniforge3\envs\feedback-assistant\python.exe" set "PYTHON_EXE=%USERPROFILE%\miniforge3\envs\feedback-assistant\python.exe"
if not defined PYTHON_EXE if exist "%USERPROFILE%\miniconda3\envs\xq-lesson-4\python.exe" set "PYTHON_EXE=%USERPROFILE%\miniconda3\envs\xq-lesson-4\python.exe"

if not defined PYTHON_EXE (
    echo.
    echo [错误] 未找到 Python 3。
    echo   - 若已安装 Conda，请确认存在: %USERPROFILE%\miniforge3\python.exe
    echo   - 或安装 Python 3 并勾选「Add to PATH」
    echo   - 也可在终端执行: py -3 -m http.server 8080
    echo.
    pause
    exit /b 1
)

echo 正在启动橙子学反馈分析助手...
echo 使用 Python: %PYTHON_EXE%
echo 浏览器将打开 http://localhost:8080/index.html
echo 关闭本窗口即可停止服务。
echo.

start "" "http://localhost:8080/index.html"

if /i "%PYTHON_EXE%"=="py -3" (
    py -3 -m http.server 8080
) else (
    "%PYTHON_EXE%" -m http.server 8080
)

if errorlevel 1 (
    echo.
    echo [错误] 启动本地服务失败。
    pause
)
