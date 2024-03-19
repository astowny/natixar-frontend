@REM echo  Fetching updates...
@REM git fetch
@REM echo Done

@REM echo Upgrading sources...
@REM git checkout origin/main
@REM echo Done

IF NOT EXIST ".env" (
    echo Setting up configuration
    copy .env.example .env
    echo Done
)

echo Installing dependencies...
npm ci
echo Done

echo Code is updated and ready to start
pause