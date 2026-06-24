# נכסים להפקה — צלילים (+ וידאו אופציונלי)

סטטוס:
- ✔ 16 תמונות ויטרינה (`public/assets/`) — הועלו.
- ✔ 16 רקעי תקופה (`public/assets/era/`) — הועלו. הם נטענים אוטומטית עם תנועת
  Ken-Burns ומעבר חלק (cross-fade) בין התקופות, עם שכבת "ערפל" צבעונית חיה מעליהם.
- ⬜ צלילים — מה שנשאר. למטה פרומפטים מוכנים ל־Suno.

---

# חלק א׳ — צלילים (Suno)

ל־Suno אין שדה "הוראות כלליות", לכן **כל פרומפט כאן עצמאי ומכיל את כל ההנחיות**.
פשוט העתק־הדבק כל פרומפט, צור, ושמור בשם המתאים.

## לולאות אווירה — לשמור בתיקייה `public/assets/audio/`

> טיפ: אם יש אפשרות, סמן *Instrumental* וכבה מילים/שירה. מטרה: רקע שקט שאפשר
> להשאיר דקות ארוכות בלי שיפריע.

**`amb-cave.mp3`**
```
Seamless looping ambient soundscape, fully instrumental, no vocals, no melody, no beat. Deep prehistoric cave atmosphere: faint slow water drips, soft low echo, distant airflow. Calm, dark, immersive, very low intensity, smooth seamless loop, about 60 seconds.
```

**`amb-savanna.mp3`**
```
Seamless looping ambient soundscape, fully instrumental, no vocals, no melody, no beat. Open African savanna: gentle warm wind, distant birds, soft rustling dry grass. Spacious, calm, natural, low intensity, smooth seamless loop, about 60 seconds.
```

**`amb-fire.mp3`**
```
Seamless looping ambient soundscape, fully instrumental, no vocals, no melody, no beat. Warm campfire: soft crackling flames and faint embers, cozy and close, inside a quiet cave. Calm, comforting, low intensity, smooth seamless loop, about 60 seconds.
```

**`amb-wind.mp3`**
```
Seamless looping ambient soundscape, fully instrumental, no vocals, no melody, no beat. Open windy plateau: steady airy wind with a sense of vast space and movement, faint distant gusts. Epic but calm, low intensity, smooth seamless loop, about 60 seconds.
```

**`amb-water.mp3`**
```
Seamless looping ambient soundscape, fully instrumental, no vocals, no melody, no beat. Thawing ice age: gentle trickling stream, soft dripping melting ice, light water movement. Fresh, cool, calm, low intensity, smooth seamless loop, about 60 seconds.
```

**`amb-field.mp3`**
```
Seamless looping ambient soundscape, fully instrumental, no vocals, no melody, no beat. Peaceful early farmland at morning: light breeze through crops, soft insects, distant birds. Warm, serene, low intensity, smooth seamless loop, about 60 seconds.
```

**`amb-village.mp3`**
```
Seamless looping ambient soundscape, fully instrumental, no vocals, no melody, no beat. Distant calm ancient village: faint far-off human activity, soft wood and pottery work in the distance, gentle breeze. Warm, communal, low intensity, smooth seamless loop, about 60 seconds.
```

**`amb-forge.mp3`**
```
Seamless looping ambient soundscape, fully instrumental, no vocals, no melody, no beat. Ancient metal forge: low furnace whoosh, occasional soft distant hammer taps, warm crackle. Industrious but calm, low intensity, smooth seamless loop, about 60 seconds.
```

**`amb-museum.mp3`**
```
Seamless looping ambient soundscape, fully instrumental, no vocals, no melody, no beat. Quiet spacious museum hall: very soft airy room tone, subtle distant reverb, sense of calm and space. Clean, minimal, low intensity, smooth seamless loop, about 60 seconds.
```

## צלילי ממשק — לשמור בתיקייה `public/assets/audio/ui/`

> אלה צלילים זעירים (פחות משנייה). Suno פחות מתאים לזה — אם יש לך בנק SFX או כלי
> אפקטים, עדיף. אם בכל זאת ב־Suno, בקש את הקצר והעדין ביותר. אופציונלי לגמרי.

**`correct.mp3`** — `Very short soft pleasant confirmation chime, warm gentle organic tone, no music, about 0.4 seconds.`
**`wrong.mp3`** — `Very short soft low muted thud, gentle and non-punishing, no music, about 0.3 seconds.`
**`click.mp3`** — `Very short soft tactile click or tap, subtle wooden/stone tone, no music, about 0.2 seconds.`

---

# חלק ב׳ — וידאו פתיחה (אופציונלי, Google Flow / Veo)

לא חובה — האתר נראה מצוין בלי זה. אבל אם רוצים "וואו" במסך הפתיחה, אפשר להוסיף
קליפ רקע קצר ומתנגן בלולאה מאחורי הכותרת. נטען רק אם הקובץ קיים.

- שמור בשם: `public/assets/video/hero.mp4`
- יחס 16:9, רזולוציה 1920×1080+, ללא טקסט, **חייב להתנגן בלופ חלק** (התחלה≈סוף).
- Veo מייצר קטעים של ~8 שניות — מספיק ללולאה אחת.

**פרומפט פתיחה (hero.mp4):**
```
Cinematic slow-motion shot inside a dark prehistoric cave, a single small campfire flickering, warm orange light dancing across rough textured stone walls, faint embers drifting upward, deep shadows, subtle drifting smoke. Very slow gentle camera push-in. Moody, atmospheric, no people, no text. Seamless loop, 8 seconds, 16:9.
```

**אם תרצה קליפ נוסף (אופציונלי, להמשך/וריאציה) — `hero-2.mp4`:**
```
Cinematic extreme slow-motion of glowing embers and soft smoke drifting through darkness, warm orange and deep black, abstract and atmospheric, no people, no text. Seamless loop, 8 seconds, 16:9.
```

---

# רשימת קבצים מהירה (Checklist)

**אווירה (`/assets/audio/`):**
amb-cave · amb-savanna · amb-fire · amb-wind · amb-water · amb-field ·
amb-village · amb-forge · amb-museum

**ממשק (`/assets/audio/ui/`, אופציונלי):** correct · wrong · click

**וידאו (`/assets/video/`, אופציונלי):** hero (+ hero-2 אם רוצים)

> כל קובץ שחסר פשוט לא יושמע/יוצג — האתר ממשיך לעבוד כרגיל.
