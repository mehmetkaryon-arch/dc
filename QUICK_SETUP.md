# 🚀 HIZLI KURULUM REHBERI

## ADIM 1: Discord Token'ı GitHub'a Ekle

Tarayıcıda aç: https://github.com/mehmetkaryon-arch/dc/settings/secrets/actions

Veya aşağıdaki 3 komutu terminal'e yapıştır:

```bash
# GitHub CLI Login (ilk defa)
gh auth login

# Secrets ekle (kendi token'ını yapıştır!)
gh secret set DISCORD_TOKEN --body "YOUR_DISCORD_TOKEN_HERE"
gh secret set CLIENT_ID --body "1474549608968622130"
```

---

## ADIM 2: Railway Token Oluştur

1. **Git:** https://railway.app
2. **Login yap** → GitHub ile (ya da email)
3. **Left sidebar** → "Account settings" 
4. **"Tokens"** sekmesi
5. **"New Token"** tıkla
6. Token'ı **kopyala**

---

## ADIM 3: Railway Token'ı GitHub'a Ekle

Terminal'de çalıştır:

```bash
# Railway token'ını ekle (kopyaladığın tokeni yapıştır)
gh secret set RAILWAY_TOKEN --body "railway_token_buraya_gelecek"
```

---

## ADIM 4: Otomatik Deploy Başlat

```bash
git push origin main
```

**[✅ BITTI!]**

Railway'de bot 2-3 dakika içinde canlı olacak! 

---

## Kontrol Et

- **Railway Dashboard:** https://railway.app → Projects → dc
- **Bot Status:** Discord'da `/setup` komutunu yaz
- **Logs:** Railway dashboard'da "Deployments" sekmesinde log gör

---

## Sorun Giderme

❌ **"Token not found"** → Secrets'ı kontrol et  
❌ **"Deployment failed"** → Railway logs'u kontrol et  
❌ **"Bot offline"** → Discord token'ın geçerli olduğunu kontrol et
