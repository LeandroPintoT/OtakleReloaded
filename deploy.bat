:: build
call npm run build

pause

:: navigate into the build output directory
cd dist

:: if you are deploying to a custom domain
:: echo 'www.example.com' > CNAME

call git init
call git add -A
call git commit -m 'deploy'

:: if you are deploying to https://<USERNAME>.github.io
:: "C:\Program Files\Git\bin\git.exe" push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

:: if you are deploying to https://<USERNAME>.github.io/<REPO>
call git push -f https://github.com/LeandroPintoT/Otakle.git master

pause