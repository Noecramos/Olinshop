# OlinDelivery Favicon & Logo Setup

## ✅ Favicon Uploaded to Vercel Blob

**URL:** `https://rfbwcz2lzvkh4d7s.public.blob.vercel-storage.com/olindelivery-favicon.jpg`

---

## 📋 Changes Needed

### 1. Update Favicon (app/favicon.ico)

Replace the current favicon with the new logo. In Next.js 13+, you can:

**Option A: Use app/icon.png**
1. Download the image from the URL above
2. Convert to PNG (512x512 recommended)
3. Save as `app/icon.png`
4. Next.js will automatically use it as favicon

**Option B: Add to metadata**
Create or update `app/layout.tsx`:

```typescript
export const metadata = {
  title: 'OlinDelivery',
  description: 'Delivery de Comida',
  icons: {
    icon: 'https://rfbwcz2lzvkh4d7s.public.blob.vercel-storage.com/olindelivery-favicon.jpg',
    apple: 'https://rfbwcz2lzvkh4d7s.public.blob.vercel-storage.com/olindelivery-favicon.jpg',
  },
}
```

### 2. Update Email Template (app/api/admin/super-reset/route.ts)

Add the logo to the email HTML (line ~33):

```typescript
html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <!-- Add Logo -->
        <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://rfbwcz2lzvkh4d7s.public.blob.vercel-storage.com/olindelivery-favicon.jpg" 
                 alt="OlinDelivery" 
                 style="width: 120px; height: 120px; border-radius: 60px;" />
        </div>
        
        <h2 style="color: #EA1D2C; text-align: center;">🔐 Nova Senha de Super Admin</h2>
        <p>Sua senha de super administrador foi resetada com sucesso.</p>
        ...
```

### 3. Update WhatsApp Messages (app/admin/super/page.tsx)

Add logo to WhatsApp approval messages (line ~60):

```typescript
const message = `🍔 *OlinDelivery* 🍔%0A%0AOlá, ${restaurant.responsibleName || 'Parceiro'}!%0A%0A...`;
```

### 4. Update All Page Titles

Search for all `<title>` tags and metadata and ensure they reference OlinDelivery.

---

## 🚀 Quick Deploy Script

```bash
# Navigate to olindelivery
cd d:\Antigravity\olindelivery

# Add logo URL to .env.local (optional)
echo LOGO_URL=https://rfbwcz2lzvkh4d7s.public.blob.vercel-storage.com/olindelivery-favicon.jpg >> .env.local

# Commit and push
git add .
git commit -m "feat: Add OlinDelivery logo as favicon and in emails"
git push origin main
```

---

## 📧 Email Logo Preview

The logo will appear in:
- ✅ Password reset emails
- ✅ Restaurant approval notifications (if implemented)
- ✅ Order confirmations (if implemented)

---

## 🌐 Favicon Preview

The logo will appear as:
- ✅ Browser tab icon
- ✅ Bookmark icon
- ✅ Mobile home screen icon (when saved)
- ✅ PWA icon (if configured)

---

## Files to Modify

1. `app/layout.tsx` or `app/icon.png` - Favicon
2. `app/api/admin/super-reset/route.ts` - Email logo
3. `app/admin/super/page.tsx` - WhatsApp messages (optional)

---

**Logo URL (copy this):**
```
https://rfbwcz2lzvkh4d7s.public.blob.vercel-storage.com/olindelivery-favicon.jpg
```
