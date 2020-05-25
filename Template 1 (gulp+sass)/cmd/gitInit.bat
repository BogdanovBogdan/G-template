cd..
rd .git /s /q

gulp clear

git init
git add .
git commit -m "init commit"
:: git remote add origin *URL* <--- WRITE URL <---
git push -u origin master

:: that cmd did not close after executing commands
pause
REM CMD /Q /K