# 🚀 UPDATE DATABASE CONFIG - QUICK FIX

## ⚠️ **PROBLEM:**
The homepage is loading old "OlinShop" config from the database, overriding our code changes.

## ✅ **SOLUTION:**
Update the database config via the web interface!

---

## 📝 **STEPS TO FIX:**

### **1. Open the Update Page:**
👉 **http://localhost:3001/update-config.html**

### **2. Click the Button:**
- Click "Update Configuration Now"
- Wait for success message
- Page will auto-redirect to homepage

### **3. See the Changes!**
- Refresh homepage
- You should now see LojaKy branding!

---

## 🎨 **What Will Be Updated:**

```
✅ Header Image: /logo-lojaky.png
✅ Splash Image: https://i.imgur.com/pjzRyRN.gif (animated GIF)
✅ Welcome Subtitle: "Suas compra na LojAky"
✅ Footer: "© Noviapp Mobile Apps • LojAky®"
✅ Header Color: #C8C4E9 (purple)
```

---

## 📊 **Standard Footer Format:**

**All pages will use:**
```
© Noviapp Mobile Apps • LojAky®
```

**Symbols:**
- `©` = Copyright symbol
- `•` = Bullet separator  
- `®` = Registered trademark

---

## 🔧 **Alternative: Manual Database Update**

If the web page doesn't work, you can update via Vercel dashboard:

1. Go to Vercel → Storage → Postgres
2. Run this SQL:
```sql
UPDATE global_settings 
SET value = '/logo-lojaky.png'
WHERE key = 'headerImage';

UPDATE global_settings 
SET value = 'https://i.imgur.com/pjzRyRN.gif'
WHERE key = 'splashImage';

UPDATE global_settings 
SET value = 'Suas compra na LojAky'
WHERE key = 'welcomeSubtitle';

UPDATE global_settings 
SET value = '© Noviapp Mobile Apps • LojAky®'
WHERE key = 'footerText';

UPDATE global_settings 
SET value = '#C8C4E9'
WHERE key = 'headerBgColor';
```

---

## ✅ **DO THIS NOW:**

1. Open: **http://localhost:3001/update-config.html**
2. Click the button
3. Wait for redirect
4. Refresh and see LojaKy! 🎉

---

**This will fix the database and show the correct branding!** 🚀
