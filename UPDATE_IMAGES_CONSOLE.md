# 🚀 UPDATE LOJAKY IMAGES - BROWSER CONSOLE METHOD

## ✅ **SIMPLE 3-STEP PROCESS:**

### **Step 1: Open Homepage**
Go to: **http://localhost:3001**

---

### **Step 2: Open Browser Console**
Press **F12** or **Ctrl + Shift + I**

Click on **"Console"** tab

---

### **Step 3: Paste and Run This Code:**

```javascript
fetch('/api/config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        headerImage: '/logo-lojaky.png',
        splashImage: '/splash-lojaky.jpg',
        headerBackgroundImage: '/header-lojaky.png',
        headerBackgroundType: 'image'
    })
})
.then(res => res.json())
.then(data => {
    console.log('✅ SUCCESS!', data);
    alert('✅ Images updated! Refreshing page...');
    setTimeout(() => location.reload(), 1000);
})
.catch(err => {
    console.error('❌ ERROR:', err);
    alert('❌ Error: ' + err.message);
});
```

---

## 📝 **What This Does:**

1. ✅ Updates `headerImage` to `/logo-lojaky.png`
2. ✅ Updates `splashImage` to `/splash-lojaky.jpg`
3. ✅ Updates `headerBackgroundImage` to `/header-lojaky.png`
4. ✅ Sets `headerBackgroundType` to `'image'`
5. ✅ Saves to database
6. ✅ Refreshes page automatically

---

## 🎯 **Expected Result:**

**In Console:**
```
✅ SUCCESS! {success: true}
```

**Alert:**
```
✅ Images updated! Refreshing page...
```

**Page refreshes and shows:**
- ✅ Correct splash screen
- ✅ Correct header
- ✅ All LojaKy branding

---

## 🔄 **To See Splash Screen Again:**

After the page refreshes, run in console:
```javascript
sessionStorage.clear()
location.reload()
```

---

## ✅ **QUICK SUMMARY:**

1. Open: **http://localhost:3001**
2. Press: **F12**
3. Paste the code above
4. Press: **Enter**
5. Wait for refresh
6. Done! 🎉

---

**This is the easiest way! Just copy-paste in console!** ✨
