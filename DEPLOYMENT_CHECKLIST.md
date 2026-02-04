# 🚀 LOJAKY - COMPLETE TESTING & DEPLOYMENT CHECKLIST

## 📋 **PRE-DEPLOYMENT TESTING**

### **✅ STEP 1: UPDATE DATABASE CONFIG**

**Open browser console (F12) on homepage and run:**

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
    alert('✅ Images updated! Refreshing...');
    setTimeout(() => location.reload(), 1000);
});
```

---

## 🔗 **ALL PAGES TO TEST** (localhost:3001)

### **🏠 PUBLIC PAGES:**

| Page | URL | What to Check |
|------|-----|---------------|
| **Homepage** | http://localhost:3001 | Splash screen, header image, footer |
| **Login** | http://localhost:3001/login | Footer, LojaKy branding |
| **Register** | http://localhost:3001/register | Footer, form works |
| **Signup** | http://localhost:3001/signup | Footer, store registration |

### **🛍️ STORE PAGES:**

| Store | URL | What to Check |
|-------|-----|---------------|
| **Marcone Papai** | http://localhost:3001/loja/marcone-papai-d35e | Footer, products, header |
| **Multicapas** | http://localhost:3001/loja/multicapas_pe | Footer, products |
| **Leo Chegou** | http://localhost:3001/loja/leo-chegou | Footer, products |

### **🛒 CHECKOUT:**

| Page | URL | What to Check |
|------|-----|---------------|
| **Checkout** | http://localhost:3001/checkout | Footer, order form |
| **Order Success** | http://localhost:3001/order-success | Footer, confirmation |

### **👤 ADMIN PAGES:**

| Page | URL | What to Check |
|------|-----|---------------|
| **Admin Login** | http://localhost:3001/admin | Login form |
| **Super Admin** | http://localhost:3001/admin/super | Super admin panel |
| **Store Admin** | http://localhost:3001/admin/marcone-papai-d35e | Dashboard |

---

## ✅ **BRANDING CHECKLIST**

For EACH page, verify:

- [ ] **Browser Tab**: Shows "LojaKy"
- [ ] **Theme Color**: Purple (#a855f7)
- [ ] **Footer**: "© Noviapp Mobile Apps • LojAky®"
- [ ] **No "OlinShop"**: Text anywhere
- [ ] **Images**: Local files loading correctly

---

## 🎨 **VISUAL ELEMENTS TO VERIFY**

### **Homepage:**
- [ ] Animated splash screen (3 seconds) - `/splash-lojaky.jpg`
- [ ] Header background image - `/header-lojaky.png`
- [ ] Purple background (#C8C4E9)
- [ ] "Suas compra na LojAky" subtitle
- [ ] Footer at bottom

### **Store Pages:**
- [ ] Header with store info
- [ ] Products displaying correctly
- [ ] Footer at bottom
- [ ] WhatsApp button (if configured)

### **All Pages:**
- [ ] Consistent purple theme
- [ ] Standard footer format
- [ ] No broken images
- [ ] Responsive design

---

## 🚀 **DEPLOYMENT STEPS**

### **1. Commit Changes:**

```bash
cd D:\Antigravity\olinshop

git add .

git commit -m "Complete LojaKy rebranding: new images, footer standardization, purple theme"

git push origin main
```

### **2. Verify Vercel Deployment:**

- Go to: https://vercel.com/dashboard
- Check deployment status
- Wait for build to complete

### **3. Test Production:**

**Primary Domain:**
- https://lojaky.noviapp.com.br

**Fallback Domain:**
- https://olinshop.vercel.app

**Test:**
- [ ] Homepage loads
- [ ] Splash screen shows
- [ ] Header image displays
- [ ] Footer on all pages
- [ ] Store pages work
- [ ] Checkout works

---

## 📊 **DEPLOYMENT VERIFICATION**

### **After Deploy, Check:**

1. **Homepage:**
   - https://lojaky.noviapp.com.br
   - Splash screen loads
   - Header image shows
   - Footer displays

2. **Store Page:**
   - https://lojaky.noviapp.com.br/loja/marcone-papai-d35e
   - Products load
   - Footer shows

3. **Admin:**
   - https://lojaky.noviapp.com.br/admin
   - Login works
   - Dashboard accessible

---

## 🎯 **QUICK TEST SCRIPT**

**Copy-paste this in browser console on each page:**

```javascript
// Check for OlinShop references
const bodyText = document.body.innerText;
if (bodyText.includes('OlinShop')) {
    console.error('❌ Found OlinShop reference!');
} else {
    console.log('✅ No OlinShop found');
}

// Check footer
const footer = document.querySelector('footer');
if (footer && footer.innerText.includes('LojAky®')) {
    console.log('✅ Footer correct');
} else {
    console.error('❌ Footer missing or incorrect');
}

// Check title
if (document.title.includes('LojaKy')) {
    console.log('✅ Title correct');
} else {
    console.error('❌ Title incorrect:', document.title);
}
```

---

## 📝 **FINAL CHECKLIST**

Before deploying:

- [ ] Database config updated (run console script)
- [ ] All images saved in `/public`
- [ ] Footer on all main pages
- [ ] No "OlinShop" text anywhere
- [ ] Browser title is "LojaKy"
- [ ] Theme color is purple
- [ ] Local testing complete
- [ ] Git committed
- [ ] Ready to push

After deploying:

- [ ] Production site loads
- [ ] Splash screen works
- [ ] Images display correctly
- [ ] Footer on all pages
- [ ] Store pages functional
- [ ] Admin panel accessible
- [ ] SSL certificate active
- [ ] Custom domain working

---

## 🎊 **SUCCESS CRITERIA**

**LojaKy rebranding is complete when:**

✅ All pages show "LojaKy" branding  
✅ Footer standardized: "© Noviapp Mobile Apps • LojAky®"  
✅ Purple theme throughout  
✅ Splash screen with correct image  
✅ Header with landscape image  
✅ No "OlinShop" references  
✅ Production site live at lojaky.noviapp.com.br  

---

## 📞 **SUPPORT**

**If issues occur:**

1. Check browser console for errors
2. Verify database config was updated
3. Clear browser cache (Ctrl + Shift + R)
4. Check Vercel deployment logs
5. Verify environment variables

---

**Created:** 2026-02-03  
**Status:** Ready for Testing & Deployment  
**Domains:** lojaky.noviapp.com.br (primary), olinshop.vercel.app (fallback)
