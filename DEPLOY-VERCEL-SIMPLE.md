# Deploy CoffeeTeam Pro to Vercel - מדריך מהיר

## שלב 1: וודא שהפרויקט מוכן

הקבצים החשובים קיימים:
- ✅ `vercel.json` - עודכן
- ✅ `package.json` - עם כל ה-dependencies
- ✅ `src/` - כל קוד React
- ✅ `index.html` - נקודת כניסה

## שלב 2: Deploy דרך Git (הכי פשוט!)

### אם הפרויקט כבר מחובר ל-Git:

```powershell
# הוסף את כל השינויים
git add .

# Commit
git commit -m "React rewrite with P2P - production ready"

# Push
git push
```

**זהו!** Vercel יעשה deploy אוטומטית!

---

## שלב 3: הגדר Environment Variable

**חשוב מאוד!** לפני שהאפליקציה תעבוד:

1. לך ל: https://vercel.com/micm260m-3861s-projects/ct-pro/settings/environment-variables
2. לחץ "Add New"
3. מלא:
   ```
   Name: VITE_SIGNALING_SERVER
   Value: https://coffeeteam-signaling.onrender.com
   ```
   (או ה-URL של שרת האיתות שלך)
4. בחר: ✓ Production ✓ Preview ✓ Development
5. Save

---

## שלב 4: Redeploy (אם צריך)

אם שינית את ה-environment variable:

1. לך ל: https://vercel.com/micm260m-3861s-projects/ct-pro
2. Deployments → לחץ על ה-deployment האחרון
3. ⋮ (שלוש נקודות) → "Redeploy"
4. Redeploy

---

## שלב 5: בדוק!

1. פתח: https://ct-pro.vercel.app
2. צור משתמש קופאי
3. בחלון אחר: צור בריסטה
4. שלח הזמנה!

---

## אם אין לך Git:

### אפשרות A: Vercel CLI

```powershell
# התקן Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### אפשרות B: העלאה ידנית

1. Zip את כל התיקייה
2. לך ל-Vercel Dashboard
3. Import Project → Upload
4. העלה את ה-ZIP

---

## Troubleshooting

**Build נכשל?**
- בדוק שיש `socket.io-client` ו-`peerjs` ב-package.json
- הרץ `npm install` מקומית
- בדוק את ה-build logs ב-Vercel

**אפליקציה לא עובדת?**
- וודא ש-`VITE_SIGNALING_SERVER` מוגדר
- בדוק שהשרת פועל: https://your-server.onrender.com/health
- פתח Console בדפדפן לשגיאות

**P2P לא עובד?**
- וודא ששני המשתמשים מחוברים
- בדוק שהשרת לא "ישן" (Render free tier)
- רענן את הדף

---

## סיכום מהיר

1. ✅ `git push` (אם יש Git)
2. ✅ הגדר `VITE_SIGNALING_SERVER` ב-Vercel
3. ✅ Redeploy אם צריך
4. ✅ בדוק!

**זהו! האפליקציה אמורה לעבוד! 🎉**

URL: https://ct-pro.vercel.app
