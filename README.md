# GOU PA NOU - Caribbean Seasonings Website

A modern, mobile-responsive website for GOU PA NOU Caribbean Seasonings featuring 9 unique flavors.

## 🌴 Quick Start

### Preview Locally
Simply open `index.html` in your web browser:
```bash
open index.html
```

Or use a local server for best results:
```bash
# Using Python
python -m http.server 8000

# Using Node.js (if installed)
npx serve
```

Then visit `http://localhost:8000` in your browser.

---

## 📁 Project Structure

```
/GOU PA NOU project/
├── index.html           # Home page
├── shop.html            # All 9 flavors
├── about.html           # Brand story
├── contact.html         # Contact form + FAQ
├── products/            # Individual product pages
│   ├── chipotle-flavor.html
│   ├── shrimp-flavor.html
│   ├── shrimp-flavor-spicy.html
│   ├── smoke-herring-flavor.html
│   ├── smoke-herring-flavor-spicy.html
│   ├── taco-flavor.html
│   ├── all-purpose-spicy.html
│   ├── all-purpose-mild.html
│   └── all-purpose-traditional.html
├── css/
│   └── styles.css       # All styles
├── js/
│   └── main.js          # Navigation & forms
└── images/              # Product images
```

---

## 🚀 Deployment Options

### Option 1: GitHub Pages (Free)
1. Create a GitHub repository
2. Push this code to the `main` branch
3. Go to Settings → Pages
4. Select "Deploy from a branch" → `main` → `/ (root)`
5. Your site will be live at `https://username.github.io/repo-name`

### Option 2: Netlify (Free)
1. Go to [netlify.com](https://netlify.com)
2. Drag & drop this entire folder
3. Your site is instantly live!

### Option 3: Vercel (Free)
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in this directory
3. Follow the prompts

---

## 🛒 Adding Your Store Links

Replace the placeholder `#` links with your actual store URLs:

1. **Etsy Store**: Search for `href="#"` next to "Etsy" and replace with your Etsy shop URL
2. **Amazon Store**: Search for `href="#"` next to "Amazon" and replace with your Amazon store URL

Files to update:
- `index.html`
- `shop.html`
- All files in `/products/`
- Footer sections in all HTML files

---

## 🎨 Adding Product Images

### Option A: Add Your Own Images
1. Place your product photos in the `/images/` folder
2. Name them to match the existing references:
   - `chipotle-flavor.png`
   - `shrimp-flavor.png`
   - `shrimp-flavor-spicy.png`
   - `smoke-herring-flavor.png`
   - `smoke-herring-flavor-spicy.png`
   - `taco-flavor.png`
   - `all-purpose-spicy.png`
   - `all-purpose-mild.png`
   - `all-purpose-traditional.png`
   - `hero-bottles.png` (for homepage hero)
   - `about-story.png` (for about page)
   - `about-heritage.png` (for about page)

### Option B: Use AI-Generated Images
Use an AI image generator with prompts like:
> "Professional product photography of a square glass spice bottle with silver cap, labeled '[FLAVOR NAME]', Caribbean seasoning, clean white background, studio lighting, premium food brand aesthetic"

---

## 🔧 Customization

### Colors
Edit CSS variables in `css/styles.css`:
```css
:root {
  --color-primary: #8B1E3F;      /* Dark red */
  --color-secondary: #D4A574;    /* Warm gold */
  --color-accent: #2C5530;       /* Forest green */
}
```

### Email Address
Search and replace `hello@goupanouseasonings.com` with your actual email.

### Social Media
Update social media links in the footer sections of all HTML files.

---

## 📱 Features

- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ SEO-optimized with meta tags
- ✅ Mobile hamburger navigation
- ✅ Contact form with validation
- ✅ Newsletter signup
- ✅ Product grid with hover effects
- ✅ Smooth animations
- ✅ Etsy/Amazon buy buttons ready

---

## 📧 Support

For questions about this website template, contact your developer.

Made with ❤️ for GOU PA NOU Caribbean Seasonings
