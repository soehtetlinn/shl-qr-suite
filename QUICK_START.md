# 🚀 QR Suite - Quick Start

## ⚡ Start in 3 Commands

```bash
# 1. Go to project directory
cd /root/shltechent/shl-qr-suite

# 2. Start development server
npm run dev

# 3. Open browser
# Visit: http://localhost:3002
```

> **Note**: QR Suite runs on port 3002 to avoid conflict with main frontend (port 3000)

## 📋 Prerequisites Checklist

- ✅ Backend API running at `http://localhost:4000`
- ✅ Node.js 18+ installed
- ✅ npm installed

## 🎯 First Steps After Launch

1. **Register Account**: `/register`
2. **Create QR Code**: `/create`
3. **View Dashboard**: `/dashboard`

## 🎨 Key Features

| Feature | Description |
|---------|-------------|
| ♥ Heart QR | Heart-shaped frame option |
| 🎨 Custom Colors | 8 color presets + custom |
| 📊 Analytics | Real-time scan tracking |
| 🔄 Dynamic URLs | Edit destination anytime |
| 💾 Download | PNG export |
| 📱 Mobile Ready | Fully responsive |

## 🔑 Important URLs

- **Frontend**: http://localhost:3002
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/health
- **Production**: https://qr-suite.shltechent.com

## 📂 Project Location

```
/root/shltechent/shl-qr-suite/
```

## 🛠️ Useful Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check for lint errors
npm run lint
```

## 🎯 Sample Workflow

1. **Login/Register** → Create account
2. **Navigate to Create** → Click "Create New QR Code"
3. **Enter URL** → https://example.com
4. **Customize Design** → Choose heart frame + pink color
5. **Add Logo** → Upload your logo (optional)
6. **Generate** → Click "Generate Dynamic QR Code"
7. **View Analytics** → Track scans in real-time
8. **Edit Anytime** → Update destination URL without reprinting

## 💡 Pro Tips

- **Heart Frame**: Perfect for weddings, events, Valentine's campaigns
- **High Error Correction**: Use level H if adding a logo
- **Dynamic QR**: Always use dynamic for trackable, editable QR codes
- **Trial Period**: 10 days free - no credit card needed
- **Short URL**: Format is `qr.shltechent.com/[code]`

## 🎨 Popular Use Cases

| Industry | Use Case |
|----------|----------|
| 🍽️ Restaurants | Digital menus |
| 🏪 Retail | Product info |
| 🎉 Events | Registration |
| 💼 Business | Digital cards |
| 📱 Marketing | Campaign tracking |
| 🎓 Education | Course materials |

## ⚠️ Common Issues & Fixes

### Backend not running?
```bash
cd /root/shltechent/sonesoebid_server
npm run dev
```

### Port 3000 in use?
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9
```

### API connection error?
- Check `.env` file has correct API URL
- Verify backend is running on port 3001

## 📊 What's Tracked

Every QR scan captures:
- ⏰ Date & time
- 🌍 Country & city
- 📱 Device type
- 🌐 Browser & OS
- 🔗 Referrer URL

## 🎨 Customization Quick Reference

### Colors
`Classic | Blue | Purple | Pink | Green | Red | Dark | Gradient`

### Frames
`None | Heart ♥ | Round ○ | Badge ⬟ | Square ▢`

### Styles
`Squares ▪ | Dots •`

### Error Correction
`L (7%) | M (15%) | Q (25%) | H (30%)`

## 📞 Need Help?

See `SETUP_GUIDE.md` for detailed documentation.

---

**Ready? Let's create amazing QR codes! 🎉**

