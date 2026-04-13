@echo off
echo 🛡️ QA Sentinel: ACTIVANDO WORKFLOWS...
echo.
git add .github/workflows/qa.yml
git commit -m "ci: enable staff-level automated quality gates"
git push origin master
echo.
echo ✅ TODO LISTO! GitHub Actions esta ahora activo.
echo.
pause
