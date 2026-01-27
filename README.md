# 🎯 StackPilot - Server Monitoring Dashboard

A modern, real-time server monitoring and management dashboard built with Next.js and Express.js.

![StackPilot](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Docker](https://img.shields.io/badge/Docker-ready-blue)

## ✨ Features

### 📊 Real-Time Monitoring
- **CPU Monitoring** - Real-time CPU usage with historical data
- **Memory Tracking** - RAM usage and availability
- **Disk Monitoring** - Storage usage across all drives
- **Network Stats** - Upload/download speeds and bandwidth

### 🔧 Service Management
- **Process Control** - Start/stop custom services from dashboard
- **Live Logs** - Real-time stdout/stderr log streaming
- **Python venv Support** - Automatic virtual environment detection
- **Process Tracking** - PID monitoring and status updates

### 🖥️ Server Management
- **Multi-Server Support** - Manage multiple servers
- **Real Uptime Tracking** - Database-backed uptime calculation
- **Server Types** - Database, Backend, Frontend, Custom
- **Server Logs** - View logs for each server type

### 🔐 Security
- **JWT Authentication** - Secure token-based auth
- **Rate Limiting** - Brute force protection (5 attempts/15min)
- **SQL Injection Protection** - Parameterized queries
- **Session Management** - Automatic timeout and cleanup

### ⚡ Performance
- **Session-Based Optimization** - Resources activated only when users are active
- **Automatic Idle Mode** - Background tasks stop when no users connected
- **10-Second Polling** - Real-time data without overwhelming server

### 🎨 Modern UI
- **Emerald Theme** - Professional enterprise design
- **Responsive Layout** - Works on desktop and mobile
- **Interactive Charts** - Beautiful visualizations with Recharts
- **Dark-Ready** - Theme toggle prepared for dark mode

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MySQL 8.0
- npm or yarn

### Local Development

1. **Clone repository**
```bash
git clone <repository-url>
cd stackpilot
```

2. **Backend setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

3. **Frontend setup**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with backend API URL
npm run dev
```

4. **Database setup**
```bash
# Import schema
mysql -u root -p stackpilot < backend/database/schema.sql
```

5. **Access application**
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000

## 🐳 Docker Deployment

### Quick Deploy on Ubuntu Server

```bash
# Make deploy script executable
chmod +x deploy.sh

# Run automated deployment
bash deploy.sh
```

The script will:
- Install Docker and Docker Compose
- Generate secure passwords
- Configure environment variables
- Build and start all services

### Manual Docker Deployment

```bash
# Copy and configure environment
cp .env.example .env
nano .env  # Edit with your values

# Build and start
docker-compose build
docker-compose up -d

# View logs
docker-compose logs -f
```

### Docker Services
- **mysql** - MySQL 8.0 database (port 3306)
- **backend** - Express.js API (port 3000)
- **frontend** - Next.js app (port 3001)

## 📖 Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete Ubuntu deployment guide
- **[nginx.conf](nginx.conf)** - Nginx reverse proxy configuration
- **Backend API** - RESTful API documentation in code
- **Frontend Components** - Component documentation in source

## 🔧 Tech Stack

### Backend
- Express.js 4.19.2 + TypeScript
- MySQL 8.0 with mysql2
- systeminformation for system metrics
- JWT authentication
- bcrypt password hashing

### Frontend
- Next.js 15.5.10 + TypeScript
- shadcn/ui components
- Tailwind CSS 3.x
- Recharts 2.x for charts
- Lucide React icons

### DevOps
- Docker & Docker Compose
- Multi-stage builds for optimization
- Health checks for all services
- Volume persistence for data

## 📁 Project Structure

```
stackpilot/
├── backend/
│   ├── src/
│   │   ├── controllers/      # API controllers
│   │   ├── middlewares/      # Auth, rate limiting
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── config/          # Database config
│   │   └── server.ts        # Express server
│   ├── database/
│   │   └── schema.sql       # Database schema
│   ├── Dockerfile           # Backend container
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js pages
│   │   ├── components/      # React components
│   │   └── lib/            # Utilities
│   ├── public/             # Static assets
│   ├── Dockerfile          # Frontend container
│   └── package.json
├── docker-compose.yml       # Service orchestration
├── .env.example            # Environment template
├── deploy.sh              # Auto-deploy script
├── nginx.conf             # Nginx configuration
└── DEPLOYMENT.md          # Deployment guide
```

## 🔐 Security

### Authentication
- JWT tokens with HS256 signing
- Bcrypt password hashing with salt
- Session tracking and automatic timeout

### Protection
- Rate limiting on login (5 attempts per 15 minutes)
- SQL injection protection via parameterized queries
- XSS protection headers
- CSRF token validation

### Best Practices
- Environment variable configuration
- Secrets not committed to git
- Docker secrets support
- Security headers in Nginx

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Stats & Metrics
- `GET /api/stats/server` - Server overview
- `GET /api/metrics/cpu` - CPU metrics
- `GET /api/metrics/memory` - Memory metrics
- `GET /api/metrics/disk` - Disk metrics
- `GET /api/metrics/network` - Network metrics

### Services
- `GET /api/services` - List all services
- `POST /api/services` - Create service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service
- `POST /api/services/:id/start` - Start service
- `POST /api/services/:id/stop` - Stop service
- `GET /api/services/:id/logs` - Get service logs

### Servers
- `GET /api/servers` - List all servers
- `POST /api/servers` - Add server
- `PUT /api/servers/:id` - Update server
- `DELETE /api/servers/:id` - Delete server
- `POST /api/servers/:id/restart-uptime` - Restart uptime

## 🛠️ Development

### Backend Development
```bash
cd backend
npm run dev          # Start with nodemon
npm run build       # Compile TypeScript
npm start           # Run production build
```

### Frontend Development
```bash
cd frontend
npm run dev         # Start Next.js dev server
npm run build      # Build for production
npm start          # Run production build
```

### Database Management
```bash
# Connect to MySQL
docker exec -it stackpilot-mysql mysql -u stackpilot -p

# Backup database
docker exec stackpilot-mysql mysqldump -u root -p stackpilot > backup.sql

# Restore database
docker exec -i stackpilot-mysql mysql -u root -p stackpilot < backup.sql
```

## 🐛 Troubleshooting

### Services won't start
```bash
# Check logs
docker-compose logs -f [service-name]

# Restart service
docker-compose restart [service-name]

# Rebuild
docker-compose up -d --build [service-name]
```

### Database connection errors
```bash
# Check MySQL is running
docker-compose ps mysql

# Test connection
docker exec stackpilot-mysql mysql -u stackpilot -p -e "SELECT 1"
```

### Port conflicts
```bash
# Find process using port
sudo netstat -tulpn | grep :3000

# Change ports in .env file
```

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions:
1. Check [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guides
2. Review existing GitHub issues
3. Create a new issue with details

---

Made with ❤️ for server monitoring
