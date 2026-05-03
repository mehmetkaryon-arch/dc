#!/bin/bash

# 🚀 TAMAMEN OTOMATIK DEPLOYMENT SCRIPT
# Bu script tüm kurulumu yapacak!

set -e

echo "============================================"
echo "🚀 Discord Bot Railway 7/24 Kurulumu"
echo "============================================"
echo ""

# Renk kodları
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# TOKEN'ı parametreden al
DISCORD_TOKEN="${1:-}"

if [ -z "$DISCORD_TOKEN" ]; then
    echo -e "${YELLOW}❌ Discord Token parametresinde gelmedi!${NC}"
    echo ""
    echo "Kullanım:"
    echo "  bash auto-deploy.sh YOUR_DISCORD_TOKEN"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ Discord Token alındı${NC}"
echo ""

# GitHub CLI kontrol et
echo -e "${BLUE}📦 GitHub CLI kontrol ediliyor...${NC}"
if ! command -v gh &> /dev/null; then
    echo "GitHub CLI yükleniyor..."
    curl -fsSL https://cli.github.com/install.sh | sudo bash
fi
echo -e "${GREEN}✅ GitHub CLI ready${NC}"
echo ""

# GitHub authentication kontrol et
echo -e "${BLUE}🔐 GitHub Authentication kontrol ediliyor...${NC}"
if ! gh auth status &> /dev/null; then
    echo "GitHub'a login gerekli..."
    gh auth login --web
fi
echo -e "${GREEN}✅ GitHub authenticated${NC}"
echo ""

# Repo bilgisi al
echo -e "${BLUE}📋 Repo bilgisi alınıyor...${NC}"
REPO_OWNER=$(gh repo view --json owner --jq .owner.login)
REPO_NAME=$(gh repo view --json name --jq .name)
echo -e "${GREEN}✅ Repo: $REPO_OWNER/$REPO_NAME${NC}"
echo ""

# GitHub Secrets ekle
echo -e "${BLUE}🔑 GitHub Secrets kuruluyor...${NC}"

echo "   → DISCORD_TOKEN ayarlanıyor..."
gh secret set DISCORD_TOKEN --body "$DISCORD_TOKEN" || echo "   ⚠️  Token zaten var"

echo "   → CLIENT_ID ayarlanıyor..."
gh secret set CLIENT_ID --body "1474549608968622130" || echo "   ⚠️  Zaten var"

echo -e "${GREEN}✅ GitHub Secrets kuruldu${NC}"
echo ""

# Railway CLI kontrol et
echo -e "${BLUE}📦 Railway CLI kuruluyor...${NC}"
if ! command -v railway &> /dev/null; then
    echo "Railway CLI yükleniyor..."
    npm install -g @railway/cli
fi
echo -e "${GREEN}✅ Railway CLI ready${NC}"
echo ""

# Railway token'ı sor
echo -e "${YELLOW}🎫 Railway Token gerekli!${NC}"
echo ""
echo "Adımlar:"
echo "  1. Git: https://railway.app"
echo "  2. Login yap → GitHub ile"
echo "  3. Account settings → Tokens"
echo "  4. 'New Token' tıkla"
echo "  5. Token'ı kopyala"
echo ""
echo "Token'ı yapıştır ve Enter'a bas:"
read -s RAILWAY_TOKEN

if [ -z "$RAILWAY_TOKEN" ]; then
    echo -e "${YELLOW}❌ Railway Token boş!${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🔑 Railway Token GitHub Secrets'a ekleniyor...${NC}"
gh secret set RAILWAY_TOKEN --body "$RAILWAY_TOKEN"
echo -e "${GREEN}✅ Railway Token kuruldu${NC}"
echo ""

# GitHub push et (deployment trigger et)
echo -e "${BLUE}🚀 Deployment başlatılıyor...${NC}"
git add -A
git commit -m "🤖 Auto deployment configured" || echo "Yapılacak değişiklik yok"
git push origin main

echo ""
echo -e "${GREEN}✅ TÜM KURULUM TAMAMLANDI!${NC}"
echo ""
echo "🎉 Bot şimdi otomatik olarak Railway'e deploy ediliyor!"
echo ""
echo "Kontrol et:"
echo "  → Railway: https://railway.app"
echo "  → GitHub Actions: https://github.com/$REPO_OWNER/$REPO_NAME/actions"
echo "  → Discord: /setup komutunu yaz"
echo ""
echo "⏳ 2-3 dakika içinde bot canlı olacak..."
