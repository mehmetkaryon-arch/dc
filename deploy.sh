#!/bin/bash

# 🚀 Railway 7/24 Deployment Script
# Bu script botunuzu Railway'e otomatik deploy eder

echo "🚀 Discord Bot Railway Deployment Script"
echo "=========================================="
echo ""
echo "⚡ Bu script Railway'e otomatik deployment hazırlayacak"

# GitHub CLI kontrolü
if ! command -v gh &> /dev/null; then
    echo "📦 GitHub CLI kuruluyor..."
    curl -fsSL https://cli.github.com/install.sh | sudo bash
fi

# Railway CLI kontrolü
if ! command -v railway &> /dev/null; then
    echo "📦 Railway CLI kuruluyor..."
    npm install -g @railway/cli
fi

echo ""
echo "⚠️  Sonraki adımlar için bu komutu çalıştır:"
echo ""
echo "ADIM 1: GitHub'da secrets ekle:"
echo "  gh secret set DISCORD_TOKEN -b'$DISCORD_TOKEN'"
echo "  gh secret set CLIENT_ID -b'1474549608968622130'"
echo "  gh secret set GUILD_ID -b'YOUR_GUILD_ID'"
echo ""
echo "ADIM 2: Railway token al:"
echo "  1. https://railway.app git"
echo "  2. 'My Tokens' → 'New Token' tıkla"
echo "  3. Token'ı kopyala"
echo ""
echo "ADIM 3: Railway token'ı GitHub'a ekle:"
echo "  gh secret set RAILWAY_TOKEN -b'YOUR_RAILWAY_TOKEN'"
echo ""
echo "ADIM 4: Repo push et (otomatik deploy başlayacak):"
echo "  git add -A && git commit -m 'Auto deploy' && git push origin main"
echo ""
echo "✅ Her şey hazır! Railway'e giderek monitoring yapabilirsin:"
echo "   https://railway.app"
