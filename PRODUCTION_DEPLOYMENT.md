# 🚀 Production Deployment Guide

## ✅ QR Suite is Now Live!

**Production URL**: https://qr-suite.shltechent.com

---

## 📋 What Was Deployed

The new QR Suite application has been successfully deployed to production with:

- ✅ React 19 + TypeScript frontend
- ✅ Beautiful heart-shaped QR codes
- ✅ Advanced analytics and tracking
- ✅ Dynamic QR code generation
- ✅ User authentication system
- ✅ Subscription plans UI
- ✅ Production API integration

---

## 🔧 Production Configuration

### Environment Variables
**File**: `/root/shltechent/shl-qr-suite/.env.production`
```
VITE_API_BASE_URL=https://api.shltechent.com
```

### File Locations
- **Build Output**: `/root/shltechent/shl-qr-suite/dist/`
- **Production Files**: `/var/www/qr-suite/`
- **Nginx Config**: `/etc/nginx/sites-available/qr-suite.shltechent.com`

### API Endpoints
- **Development**: `http://localhost:4000`
- **Production**: `https://api.shltechent.com`

---

## 🚀 Deployment Process

### Quick Deployment
```bash
cd /root/shltechent
./deploy-qr-suite.sh
```

### Manual Deployment Steps
```bash
# 1. Navigate to project
cd /root/shltechent/shl-qr-suite

# 2. Install dependencies (if needed)
npm install

# 3. Build for production
npm run build

# 4. Copy to web directory
cp -r dist/* /var/www/qr-suite/

# 5. Set permissions
chown -R www-data:www-data /var/www/qr-suite
chmod -R 755 /var/www/qr-suite

# 6. Reload Nginx
systemctl reload nginx
```

---

## 🌐 Nginx Configuration

**File**: `/etc/nginx/sites-available/qr-suite.shltechent.com`

```nginx
server {
    listen 443 ssl http2;
    server_name qr-suite.shltechent.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/shltechent.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/shltechent.com/privkey.pem;

    # Serve the QR Suite frontend
    root /var/www/qr-suite;
    index index.html;

    # Handle SPA routing
    location / {
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

---

## 🔍 Verification

### Check Site is Live
```bash
curl -I https://qr-suite.shltechent.com
# Expected: HTTP/2 200
```

### Check Content
```bash
curl -s https://qr-suite.shltechent.com | grep "QR Suite"
# Expected: <title>QR Suite - Create Beautiful Dynamic QR Codes</title>
```

### Check API Connection
```bash
# Check backend is accessible
curl https://api.shltechent.com/health
# Expected: {"ok":true}
```

---

## 📊 Production vs Development

| Aspect | Development | Production |
|--------|-------------|------------|
| **URL** | http://localhost:3002 | https://qr-suite.shltechent.com |
| **API** | http://localhost:4000 | https://api.shltechent.com |
| **Protocol** | HTTP | HTTPS |
| **SSL** | No | Yes (Let's Encrypt) |
| **Caching** | No | Yes (1 year for assets) |
| **Build** | Dev mode | Optimized production |

---

## 🔄 Update Workflow

When you make changes to the QR Suite:

1. **Make changes** in `/root/shltechent/shl-qr-suite/src/`
2. **Test locally**:
   ```bash
   cd /root/shltechent/shl-qr-suite
   npm run dev
   # Visit: http://localhost:3002
   ```
3. **Deploy to production**:
   ```bash
   cd /root/shltechent
   ./deploy-qr-suite.sh
   ```

---

## 🗂️ Cache Busting

Vite automatically adds content hashes to filenames:
- `index-DwL3J2df.js` (changes with each build)
- `index-CMylYmp-.css` (changes with each build)

This ensures users always get the latest version.

---

## 🔐 SSL Certificate

- **Certificate**: Let's Encrypt
- **Auto-renewal**: Configured via certbot
- **Covers**: *.shltechent.com
- **Valid for**: 90 days (auto-renews at 30 days)

### Renew Manually (if needed)
```bash
certbot renew
systemctl reload nginx
```

---

## 📈 Monitoring

### Check Nginx Logs
```bash
# Access logs
tail -f /var/log/nginx/access.log | grep qr-suite

# Error logs
tail -f /var/log/nginx/error.log
```

### Check Backend Logs
```bash
# Backend API logs
cd /root/shltechent/sonesoebid_server
tail -f server.log
```

---

## 🚨 Troubleshooting

### Site Shows Old Version
```bash
# Clear browser cache (Ctrl+Shift+R)
# Or force rebuild and redeploy:
cd /root/shltechent/shl-qr-suite
rm -rf dist node_modules
npm install
npm run build
cp -r dist/* /var/www/qr-suite/
systemctl reload nginx
```

### 502 Bad Gateway
```bash
# Check if backend is running
curl http://localhost:4000/health

# Restart backend if needed
cd /root/shltechent/sonesoebid_server
npm run dev
```

### SSL Certificate Error
```bash
# Check certificate
certbot certificates

# Renew if needed
certbot renew --force-renewal
systemctl reload nginx
```

### Nginx Not Starting
```bash
# Test configuration
nginx -t

# Check for syntax errors
cat /var/log/nginx/error.log
```

---

## 📊 Performance Optimization

Current build size:
- **CSS**: 247.94 KB (34.37 KB gzipped)
- **JS**: 638.35 KB (211.03 KB gzipped)

### Future Optimizations (Optional)
1. **Code splitting**: Use dynamic imports
2. **Lazy loading**: Load components on demand
3. **Image optimization**: Use WebP format
4. **CDN**: Serve static assets from CDN

---

## 🔄 Rollback Procedure

If you need to rollback to a previous version:

1. **Keep backups**:
   ```bash
   # Before each deployment
   cp -r /var/www/qr-suite /var/www/qr-suite.backup.$(date +%Y%m%d-%H%M%S)
   ```

2. **Restore backup**:
   ```bash
   # List backups
   ls -la /var/www/ | grep qr-suite.backup
   
   # Restore specific backup
   rm -rf /var/www/qr-suite/*
   cp -r /var/www/qr-suite.backup.YYYYMMDD-HHMMSS/* /var/www/qr-suite/
   systemctl reload nginx
   ```

---

## ✅ Deployment Checklist

Before each deployment:
- [ ] Test locally on http://localhost:3002
- [ ] Check all features work
- [ ] Run `npm run build` successfully
- [ ] Backup current production files
- [ ] Deploy new build
- [ ] Test production site
- [ ] Check API connections
- [ ] Verify authentication works
- [ ] Test QR code generation
- [ ] Check analytics dashboard

---

## 📞 Support

If you encounter issues:

1. Check logs (Nginx, Backend)
2. Verify SSL certificates
3. Test API connectivity
4. Clear browser cache
5. Check file permissions

---

## 🎉 Success!

Your QR Suite is now live at:
**https://qr-suite.shltechent.com**

Features available:
- ♥ Heart-shaped QR codes
- 🎨 Custom colors and styles
- 📊 Real-time analytics
- 🔄 Dynamic QR codes
- 👤 User authentication
- 💳 Subscription plans
- 📱 Fully responsive design

**Start creating amazing QR codes!** 🚀

