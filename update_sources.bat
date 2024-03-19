echo  Fetching updates...
git fetch
echo Done

echo Upgrading sources...
git checkout origin/main
echo Done

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