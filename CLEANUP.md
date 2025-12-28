# ניקוי קבצים ישנים

הקבצים הבאים הם מהגרסה הישנה (Vanilla JS) וצריך למחוק אותם:

## למחיקה:

### תיקיות:
- `src/ui/` - כל הממשק הישן
- `src/core/` - State machine ישן

### קבצים:
- `src/services/nlp-engine.ts` - NLP ישן (יש `nlp.ts` חדש)
- `src/services/stt-service.ts` - STT ישן (יש `stt.ts` חדש)

## פקודות מחיקה (PowerShell):

```powershell
# מחק תיקיות ישנות
Remove-Item -Recurse -Force "src\ui"
Remove-Item -Recurse -Force "src\core"

# מחק קבצים כפולים
Remove-Item -Force "src\services\nlp-engine.ts"
Remove-Item -Force "src\services\stt-service.ts"
```

## לשמור:

### React App (חדש):
- `src/App.tsx`
- `src/main.tsx`
- `src/components/` - כל הקומפוננטות
- `src/screens/` - כל המסכים
- `src/context/` - State management
- `src/services/nlp.ts` - NLP חדש
- `src/services/stt.ts` - STT חדש
- `src/services/p2p.ts` - P2P מלא
- `src/services/storage.ts` - Storage
- `src/types/` - TypeScript types
- `src/styles/` - CSS

### Config:
- `package.json`
- `tsconfig.json`
- `vite.config.ts`
- `vercel.json`
- `index.html`

## אחרי הניקוי:

```powershell
# בדוק שהכל עובד
npm install
npm run dev
```

אם הכל עובד - deploy ל-Vercel!
