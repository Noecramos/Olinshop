# 🛍️ LojaKy Rebranding Plan - OlinShop → LojaKy

## 🎨 Brand Identity

### **New Branding:**
- **Name:** LojaKy
- **Tagline:** "Suas compra na LojAky"
- **Colors:** Purple/Pink gradient, Navy blue, Hot pink
- **Logo:** Shopping bag with gradient and sparkles
- **Style:** Modern, playful, e-commerce focused

### **Current Branding:**
- **Name:** OlinShop
- **Footer:** "© 2025 OlinShop Premium retail"
- **Colors:** Generic
- **Logo:** Basic

---

## 📊 Files to Update (Found 28 instances of "OlinShop")

### **Critical Files (High Priority):**

1. **`public/manifest.json`** (2 instances)
   - Line 2: `"name": "OlinShop"`
   - Line 3: `"short_name": "OlinShop"`

2. **`app/layout.tsx`** (1 instance)
   - Line 10: `title: "OlinShop"`

3. **`app/page.tsx`** (2 instances)
   - Line 22: Footer text
   - Line 112: Alt text

4. **`package.json`**
   - Project name

### **User-Facing Pages:**

5. **`app/register/page.tsx`** (2 instances)
   - Line 186: Subtitle
   - Line 450: Footer

6. **`app/login/page.tsx`** (1 instance)
   - Line 37: WhatsApp message

7. **`app/checkout/page.tsx`** (3 instances)
   - Line 232: User-Agent header
   - Line 427: WhatsApp footer
   - Line 792: Page footer

8. **`app/loja/[slug]/layout.tsx`** (1 instance)
   - Line 24: Title

### **Admin Pages:**

9. **`app/admin/page.tsx`** (2 instances)
   - Line 29: Subtitle
   - Line 91: Footer

10. **`app/admin/[slug]/page.tsx`** (3 instances)
    - Line 335: Print footer
    - Line 362: Support link
    - Line 707: Page footer

11. **`app/admin/super/page.tsx`** (4 instances)
    - Line 92: Approval WhatsApp message
    - Line 130: Password reset message
    - Line 193: User password reset
    - Line 330: Subtitle
    - Line 527: Footer

### **Components:**

12. **`app/components/PageHeader.tsx`** (1 instance)
    - Line 30: Alt text

13. **`app/components/StoreHeader.tsx`** (1 instance)
    - Line 22: Default name

14. **`app/components/admin/GlobalConfigForm.tsx`** (1 instance)
    - Line 351: Placeholder

15. **`app/components/admin/StoreSettings.tsx`** (1 instance)
    - Line 402: User-Agent header

### **API Routes:**

16. **`app/api/og/route.tsx`** (1 instance)
    - Line 7: Default title

17. **`app/test-whatsapp/page.tsx`** (1 instance)
    - Line 34: WhatsApp footer

### **N8N Workflows (Low Priority):**

18. **`n8n-customer-support-ai.json`**
19. **`n8n-ai-simple-ready.json`**

---

## 🎯 Rebranding Tasks

### **Phase 1: Visual Assets** (New)

- [ ] Save uploaded logo to `public/logo-lojaky.png`
- [ ] Save uploaded splash to `public/splash-lojaky.jpg`
- [ ] Create landscape header `public/header-lojaky.png`
- [ ] Update favicon to LojaKy colors
- [ ] Create app icons (PWA)

### **Phase 2: Text Replacements**

**Standard Footer Format:**
```
© 2026 Noviapp Mobile Apps • LojaKy®
```

**Files to Update:**
- [ ] `public/manifest.json` - Name and short_name
- [ ] `app/layout.tsx` - Title and description
- [ ] `app/page.tsx` - Footer and alt text
- [ ] `app/register/page.tsx` - Subtitle and footer
- [ ] `app/login/page.tsx` - WhatsApp message
- [ ] `app/checkout/page.tsx` - User-Agent, WhatsApp, footer
- [ ] `app/loja/[slug]/layout.tsx` - Title
- [ ] `app/admin/page.tsx` - Subtitle and footer
- [ ] `app/admin/[slug]/page.tsx` - All instances
- [ ] `app/admin/super/page.tsx` - All messages and footer
- [ ] `app/components/PageHeader.tsx` - Alt text
- [ ] `app/components/StoreHeader.tsx` - Default name
- [ ] `app/components/admin/GlobalConfigForm.tsx` - Placeholder
- [ ] `app/components/admin/StoreSettings.tsx` - User-Agent
- [ ] `app/api/og/route.tsx` - Default title
- [ ] `app/test-whatsapp/page.tsx` - Footer
- [ ] `package.json` - Project name

### **Phase 3: Styling Updates**

**Color Scheme:**
- Primary: Purple/Pink gradient
- Secondary: Navy blue (#1e3a8a)
- Accent: Hot pink (#ec4899)
- Background: Light purple (#e9d5ff)

**Files to Update:**
- [ ] `app/globals.css` - Add LojaKy color variables
- [ ] `tailwind.config.js` - Add custom colors
- [ ] `app/page.tsx` - Update header styling
- [ ] `app/components/PageHeader.tsx` - Update colors

### **Phase 4: Header Image**

**Create landscape header similar to ZAPPY:**
- Height: 256px (h-64)
- Background: Purple/pink gradient
- Position: center 40%
- Style: cover

### **Phase 5: Database Updates** (Optional)

**Update global_settings:**
- Header image: `/header-lojaky.png`
- Footer text: `© 2026 Noviapp Mobile Apps • LojaKy®`

---

## 📝 Replacement Patterns

### **Text Replacements:**

```
OlinShop → LojaKy
olinshop → lojaky
OLINSHOP → LOJAKY
```

### **URL Replacements:**

```
olinshop.vercel.app → lojaky.noviapp.com.br (in messages)
```

### **Footer Standardization:**

**Old:**
```
© 2025 OlinShop Premium retail
© 2025 Noviapp Mobile Apps • www.noviapp.com.br • OlindAki & OlinShop
```

**New:**
```
© 2026 Noviapp Mobile Apps • LojaKy®
```

---

## ⏱️ Estimated Timeline

**Total Time:** ~2-3 hours

### **Breakdown:**
- Phase 1 (Visual Assets): 30 min
- Phase 2 (Text Updates): 45 min
- Phase 3 (Styling): 30 min
- Phase 4 (Header): 15 min
- Phase 5 (Database): 10 min
- Testing & Deployment: 30 min

---

## 🚀 Deployment Plan

### **Step 1: Prepare Assets**
1. Save logo and splash images
2. Create header image
3. Update icons

### **Step 2: Update Code**
1. Text replacements (28 instances)
2. Footer standardization (10 instances)
3. Styling updates

### **Step 3: Test Locally**
1. Run `npm run dev`
2. Check all pages
3. Verify branding

### **Step 4: Deploy**
1. Commit changes
2. Push to GitHub
3. Vercel auto-deploys
4. Verify at lojaky.noviapp.com.br

---

## ✅ Success Criteria

**Visual:**
- [ ] LojaKy logo on all pages
- [ ] Purple/pink color scheme
- [ ] Landscape header (256px)
- [ ] Standardized footer

**Text:**
- [ ] No "OlinShop" visible anywhere
- [ ] All text says "LojaKy"
- [ ] Consistent footer format
- [ ] Updated WhatsApp messages

**Functional:**
- [ ] All pages load correctly
- [ ] No broken links
- [ ] Images display properly
- [ ] Admin panels work
- [ ] Both URLs work (old + new)

---

## 🎯 Ready to Execute?

**Confirm before proceeding:**
1. ✅ Logo images uploaded
2. ✅ Color scheme approved
3. ✅ Footer format approved
4. ✅ Ready to start rebranding

**Next Step:** Create visual assets and begin text replacements!
