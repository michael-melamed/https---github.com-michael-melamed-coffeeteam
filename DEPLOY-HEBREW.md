# CoffeeTeam Pro - Quick Deploy Guide 🚀

## הכי מהיר: Render.com (3 דקות)

### שלב 1: העלה את התיקייה
1. לך ל: https://render.com
2. הירשם (חינם)
3. לחץ "New +" → "Web Service"
4. בחר "Public Git repository" או "Upload folder"

### שלב 2: הגדרות
```
Name: coffeeteam-signaling
Environment: Node
Build Command: npm install
Start Command: npm start
Plan: Free
```

### שלב 3: Deploy
לחץ "Create Web Service" - זהו!

### שלב 4: קבל את ה-URL
אחרי 2-3 דקות תקבל:
`https://coffeeteam-signaling.onrender.com`

### שלב 5: עדכן את הקליינט
צור קובץ `.env` בתיקיית הפרויקט:
```
VITE_SIGNALING_SERVER=https://coffeeteam-signaling.onrender.com
```

**זהו! עכשיו זה עובד מכל מקום בעולם! 🌍**

---

## חלופה: Railway.app

1. https://railway.app
2. "New Project" → "Deploy from folder"
3. העלה את `signaling-server`
4. Railway עושה הכל אוטומטית
5. קבל URL: `https://coffeeteam-signaling.up.railway.app`

---

## בעיות נפוצות

**שרת לא עובד?**
- בדוק ב-Render Logs
- וודא ש-PORT מוגדר נכון (אוטומטי)

**החיבור נכשל?**
- וודא ש-CORS מאופשר (כבר מוגדר)
- בדוק שה-URL ב-.env נכון

**השרת "ישן"?**
- Render Free tier ישן אחרי 15 דקות
- התעוררות: 30 שניות
- זה בסדר! השרת רק לחיבור ראשוני

---

## מה הלאה?

אחרי ה-deploy:
1. ✅ עדכן `.env` עם ה-URL החדש
2. ✅ הרץ `npm run dev`
3. ✅ פתח 2 חלונות דפדפן
4. ✅ בדוק שהכל עובד!

**הכל מוכן לשימוש! 🎉**
