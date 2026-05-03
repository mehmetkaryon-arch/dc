# 🚀 Discord Bot 7/24 Deployment Guide

Bu proje 7 gün 24 saat çalışacak şekilde yapılandırılmıştır.

## 📋 Setup

### 1. Gerekli Bilgiler
- Discord Bot Token (https://discord.com/developers/applications)
- Bot Client ID
- Guild ID (sunucu ID'si)

### 2. .env Dosyası Oluştur

`.env.example` dosyasını `.env` olarak kopyala ve değerleri doldur:

```bash
cp .env.example .env
```

Ardından `.env` dosyasını düzenle:
```
TOKEN=your_discord_bot_token_here
CLIENT_ID=1474549608968622130
GUILD_ID=your_guild_id_here
STAFF_ROLE_NAME=patron
```

## 🌐 7/24 Aktif Deployment Seçenekleri

### Option 1: Railway (⭐ Tavsiye)
**Ücretsiz ve kolay!**

1. [railway.app](https://railway.app) üzerinden GitHub ile giriş yap
2. "New Project" → "Deploy from GitHub repo"
3. Bu repoyu seç
4. **Add Variables** tıkla:
   - `TOKEN` = your_bot_token
   - `CLIENT_ID` = 1474549608968622130
   - `GUILD_ID` = your_guild_id
   - `STAFF_ROLE_NAME` = patron

5. Deploy tıkla ve 2-3 dakika bekle ✅

### Option 2: Replit
1. [replit.com](https://replit.com) git
2. GitHub reposunu import et
3. `.env` dosyası oluştur ve TOKEN ekle
4. Play butonuna tıkla
5. Bot otomatik başlayacak ve 7/24 açık kalacak

### Option 3: Heroku (Legacy)
```bash
heroku login
heroku create your-bot-name
heroku config:set TOKEN=your_token
git push heroku main
```

### Option 4: Render
1. [render.com](https://render.com) git
2. "New" → "Web Service"
3. GitHub reposunu connect et
4. Environment variables ekle
5. Deploy et

## 🏃 Local Çalıştırma

```bash
npm install
npm start
```

Bot şimdi local olarak çalışacak.

## ✅ Kontrol

Botu şu Discord komutlarıyla test et:
- `/setup` - Sistem kurulumu
- `/hosgeldin` - Hoş geldin mesajı
- `/ticaret` - Ticaret sistemi

## 📝 Notlar

- Bot otomatik olarak keep-alive server çalıştırır (7/24 hizmet için)
- TOKEN değerini gizli tutun!
- `.env` dosyasını git'e push etmeyin
