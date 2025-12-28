# ☕ CoffeeTeam Pro

מערכת ניהול הזמנות P2P לבתי קפה - בנויה על State Machine דטרמיניסטי.

## תכונות

- **P2P בזמן אמת**: תקשורת ישירה בין מכשירים ללא שרת מרכזי
- **State Machine קפדני**: כל מעבר מצב מוגדר ומאומת
- **STT בעברית**: זיהוי דיבור אוטומטי להזמנות
- **ממשק דו-תפקידי**: קופאי (Cashier) ובריסטה (Barista)
- **עיצוב מודרני**: Glassmorphism, אנימציות, ותמיכה מלאה ב-RTL

## דרישות מקדימות

- Node.js 18+ ו-npm
- דפדפן מודרני (Chrome/Edge מומלץ לתמיכה מלאה ב-STT)
- HTTPS בפרודקשן (נדרש ל-Web Speech API)

## התקנה

```bash
# התקן תלויות
npm install

# הרץ שרת פיתוח
npm run dev

# בנה לפרודקשן
npm run build

# הצג תצוגה מקדימה של הבנייה
npm run preview
```

## שימוש

### הגדרה ראשונית

1. פתח את האפליקציה בדפדפן
2. הזן שם והגדר תפקיד (קופאי/בריסטה)
3. הזן קוד סניף (כל המכשירים באותו סניף צריכים להשתמש באותו קוד)
4. המתן לחיבור

### זרימת עבודה - קופאי

1. לחץ על "התחל הקלטה"
2. דבר בבירור: "קפה גדול עם חלב שקדים חזק"
3. עצור הקלטה וערוך את ההזמנה במידת הצורך
4. שלח הזמנה

### זרימת עבודה - בריסטה

1. צפה בתור הזמנות (ממוינות לפי זמן יצירה)
2. לחץ "התחל הכנה" כשמתחיל לעבוד על הזמנה
3. לחץ "סיים" כשההזמנה מוכנה
4. ההזמנה תעלם אוטומטית לאחר 3 שניות

## ארכיטקטורה

### State Machine

```
BOOT → UNREGISTERED → REGISTERED → CONNECTING → READY
                                                   ↓
                                    ┌──────────────┴──────────────┐
                                    ↓                             ↓
                            RECORDING_ORDER              BARISTA_ACTIVE
                                    ↓
                            REVIEWING_ORDER
                                    ↓
                                  READY
```

### מבנה קבצים

```
src/
├── core/               # ליבה - State Machine, Types, Invariants
├── services/           # שירותים - P2P, Storage, STT, NLP
├── ui/                 # ממשק משתמש
│   ├── screens/        # מסכים לכל State
│   └── components/     # קומפוננטים לשימוש חוזר
└── styles/             # CSS - Tokens, Components, Screens
```

### טכנולוגיות

- **Vite**: Build tool מהיר
- **TypeScript**: Type safety
- **PeerJS**: P2P communication (WebRTC wrapper)
- **Web Speech API**: זיהוי דיבור
- **Vanilla CSS**: עיצוב מותאם אישית

## Invariants (חוקי הפיזיקה)

1. **אין Master**: כל המכשירים שווים
2. **Order ID ייחודי**: `${createdAt}-${deviceId}`
3. **סדר הצגה דטרמיניסטי**: לפי createdAt → deviceId
4. **Immutability**: הזמנה לא משתנה אחרי יצירה (מלבד status)
5. **Idempotency**: אירועים מעובדים פעם אחת בלבד
6. **Last-Write-Wins**: תיקונים בחלון 5 שניות

## פתרון בעיות

### STT לא עובד

- ודא שהדפדפן תומך (Chrome/Edge מומלץ)
- בדוק הרשאות מיקרופון
- ב-production, דרוש HTTPS

### P2P לא מתחבר

- ודא שכל המכשירים משתמשים באותו קוד סניף
- בדוק חומת אש/רשת
- ייתכן צורך ב-STUN/TURN server לרשתות מורכבות

### הזמנות לא מסתנכרנות

- בדוק שהמכשירים מחוברים (מספר peers > 0)
- בדוק קונסול לשגיאות
- נסה לרענן את הדף

## פיתוח

### הוספת מילות מפתח חדשות

ערוך את `src/services/nlp-parser.ts`:

```typescript
const KEYWORDS = {
  products: ['קפה', 'תה', 'המילה החדשה שלך'],
  // ...
};
```

### הוספת State חדש

1. הוסף ל-`AppState` enum ב-`src/core/types.ts`
2. עדכן `TRANSITIONS` ב-`src/core/state-machine.ts`
3. צור מסך חדש ב-`src/ui/screens/`
4. עדכן `AppUI.render()` ב-`src/ui/app.ts`

## רישיון

MIT

## תמיכה

לשאלות או בעיות, פתח issue ב-GitHub.

---

**נבנה עם ❤️ ו-☕**
