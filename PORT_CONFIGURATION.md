# 🔌 Port Configuration - No Conflicts

## ✅ System Port Allocation

Your systems are now properly configured to avoid port conflicts:

### Development Ports

| System | Port | Status | Purpose |
|--------|------|--------|---------|
| **Sonesoebid Frontend** | 3000 | ✅ Active | Main auction platform frontend (dev) |
| **QR Suite Frontend** | 3002 | ✅ Active | QR code generator frontend (dev) |
| **Backend API** | 4000 | ✅ Active | Shared backend for all systems |
| **Telegram Bot** | 9002 | ✅ Active | Telegram bot server |

### Production (Nginx)

| Subdomain | Port | Serves | Location |
|-----------|------|--------|----------|
| `www.shltechent.com` | 443 | Main auction site | `/var/www/html` |
| `qr-suite.shltechent.com` | 443 | QR Suite | `/var/www/qr-suite` |
| `currex.shltechent.com` | 443 | Currency exchange | `/var/www/currex` |
| `dashboard.shltechent.com` | 443 | Admin dashboard | `/var/www/dashboard` |
| `api.shltechent.com` | 443 | Backend API proxy | → port 4000 |
| `qr.shltechent.com` | 443 | QR redirect service | → port 4000 |

---

## 🚀 How to Run Systems Together

### Scenario 1: Run Everything
```bash
# Terminal 1: Backend API
cd /root/shltechent/sonesoebid_server
npm run dev
# Runs on port 4000

# Terminal 2: Main Frontend
cd /root/shltechent/sonesoebid_frontend  
npm run dev
# Runs on port 3000

# Terminal 3: QR Suite Frontend
cd /root/shltechent/shl-qr-suite
npm run dev
# Runs on port 3002
```

### Scenario 2: QR Suite Only
```bash
# Terminal 1: Backend API (if not already running)
cd /root/shltechent/sonesoebid_server
npm run dev
# Runs on port 4000

# Terminal 2: QR Suite
cd /root/shltechent/shl-qr-suite
npm run dev
# Runs on port 3002
```

---

## 🌐 Access URLs

### Development
- **Main Frontend**: http://localhost:3000
- **QR Suite**: http://localhost:3002
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/health

### Production
- **Main Site**: https://www.shltechent.com
- **QR Suite**: https://qr-suite.shltechent.com
- **Currency Exchange**: https://currex.shltechent.com
- **Dashboard**: https://dashboard.shltechent.com
- **API**: https://api.shltechent.com
- **QR Redirects**: https://qr.shltechent.com/[code]

---

## 🔧 Configuration Files

### QR Suite
**File**: `/root/shltechent/shl-qr-suite/.env`
```
VITE_API_BASE_URL=http://localhost:4000
```

**File**: `/root/shltechent/shl-qr-suite/vite.config.ts`
```typescript
server: {
  port: 3002,  // Changed from 3000 to avoid conflict
  host: true,
}
```

### Backend API
**File**: `/root/shltechent/sonesoebid_server/.env`
```
PORT=4000
```

### Nginx (Production)
**File**: `/etc/nginx/sites-available/qr-suite.shltechent.com`
- Serves static files from `/var/www/qr-suite`
- SSL configured with Let's Encrypt
- CORS headers configured for API calls

---

## 🔍 Checking Active Ports

```bash
# Check which ports are in use
netstat -tlnp | grep -E ":(3000|3002|4000|9002)"

# Check running Node processes
ps aux | grep -E "(node|vite|npm)" | grep -v grep

# Check if backend is responding
curl http://localhost:4000/health
```

---

## 🚨 Troubleshooting

### Port 3002 Already in Use?
```bash
# Find the process
lsof -ti:3002

# Kill it
kill -9 $(lsof -ti:3002)

# Or kill all vite processes
pkill -f vite
```

### Backend Not Responding?
```bash
# Check if backend is running
ps aux | grep "node.*index.js"

# Start backend if not running
cd /root/shltechent/sonesoebid_server
npm run dev
```

### Cannot Connect to API?
1. Verify backend is running on port 4000
2. Check `.env` file has correct port
3. Verify CORS is configured for your origin
4. Check firewall rules (if applicable)

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    PRODUCTION (HTTPS)                    │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  www.shltechent.com (Main Auction Site)                 │
│  qr-suite.shltechent.com (QR Suite) ◄─── NEW           │
│  currex.shltechent.com (Currency Exchange)              │
│  dashboard.shltechent.com (Admin Dashboard)             │
│                                                           │
│           ▼                                               │
│     Nginx Reverse Proxy                                  │
│           ▼                                               │
│  api.shltechent.com → Backend (Port 4000)               │
│  qr.shltechent.com → Backend (Port 4000/qr/:code)       │
│                                                           │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  DEVELOPMENT (HTTP)                      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  localhost:3000 → Sonesoebid Frontend (Vite)           │
│  localhost:3002 → QR Suite Frontend (Vite) ◄─── NEW    │
│  localhost:4000 → Backend API (Express)                 │
│  localhost:9002 → Telegram Bot (Next.js)               │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ Conflict Resolution

### Before Changes
❌ **CONFLICT**: Both systems tried to use port 3000
- Sonesoebid Frontend: 3000
- QR Suite Frontend: 3000

### After Changes
✅ **NO CONFLICT**: Each system has its own port
- Sonesoebid Frontend: 3000
- QR Suite Frontend: 3002

### Backend Configuration
✅ **Shared Backend**: Both systems use the same backend
- Backend API: Port 4000
- CORS configured for all subdomains
- All QR endpoints already exist
- Database models already created

---

## 🔐 Security Notes

1. **CORS**: Backend already configured with qr-suite.shltechent.com
2. **SSL**: Production uses Let's Encrypt certificates
3. **JWT**: Authentication tokens shared across systems
4. **Rate Limiting**: Configured in Nginx and backend
5. **HTTPS**: All production traffic is encrypted

---

## 📝 Important Notes

1. **Development vs Production**
   - Development: Each frontend runs on its own port
   - Production: All served through Nginx on port 443

2. **Shared Backend**
   - Single backend serves all systems
   - QR code endpoints already exist
   - Database already has QR tables
   - No additional backend setup needed

3. **No Data Conflicts**
   - QR codes stored in separate database table
   - Users shared across systems (same login)
   - No table conflicts or data overlap

4. **Deployment**
   - Use `deploy-qr-suite.sh` script
   - Builds and copies to `/var/www/qr-suite`
   - Nginx serves static files in production

---

## 🎯 Quick Reference

### Start QR Suite Development
```bash
cd /root/shltechent/shl-qr-suite
npm run dev
# Visit: http://localhost:3002
```

### Deploy QR Suite to Production
```bash
cd /root/shltechent
./deploy-qr-suite.sh
# Visit: https://qr-suite.shltechent.com
```

### Check Everything is Working
```bash
# Backend
curl http://localhost:4000/health

# Main Frontend (if running)
curl http://localhost:3000

# QR Suite (if running)
curl http://localhost:3002
```

---

## ✨ Summary

- ✅ No port conflicts
- ✅ Backend already configured
- ✅ Nginx already configured
- ✅ CORS already configured
- ✅ SSL already configured
- ✅ Deployment script ready
- ✅ All systems can run simultaneously

**Everything is configured and ready to use!** 🎉

