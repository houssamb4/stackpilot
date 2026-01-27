# 🔄 Quick Deploy Script for Ubuntu Server

# Quick deployment script for StackPilot on Ubuntu
# Run with: bash deploy.sh

set -e

echo "🚀 StackPilot Deployment Script"
echo "================================"

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo "❌ Please do not run as root. Run as regular user with sudo access."
   exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "📦 Docker not found. Installing Docker..."
    
    # Install dependencies
    sudo apt update
    sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
    
    # Add Docker GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    
    # Add Docker repository
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io
    
    # Start and enable Docker
    sudo systemctl start docker
    sudo systemctl enable docker
    
    echo "✅ Docker installed successfully"
else
    echo "✅ Docker is already installed"
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "📦 Docker Compose not found. Installing..."
    
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    
    echo "✅ Docker Compose installed successfully"
else
    echo "✅ Docker Compose is already installed"
fi

# Setup environment file
if [ ! -f .env ]; then
    echo "⚙️  Setting up environment configuration..."
    cp .env.example .env
    
    # Generate random passwords
    MYSQL_ROOT_PASS=$(openssl rand -base64 24)
    MYSQL_PASS=$(openssl rand -base64 24)
    JWT_SECRET=$(openssl rand -base64 32)
    
    # Update .env file
    sed -i "s/your-strong-root-password-here/$MYSQL_ROOT_PASS/" .env
    sed -i "s/your-strong-database-password-here/$MYSQL_PASS/" .env
    sed -i "s/your-super-secret-jwt-key-minimum-32-characters-long/$JWT_SECRET/" .env
    
    # Get server IP
    SERVER_IP=$(hostname -I | awk '{print $1}')
    sed -i "s|http://localhost:3000|http://$SERVER_IP:3000|" .env
    
    echo "✅ Environment configured with secure passwords"
    echo ""
    echo "📋 Your credentials:"
    echo "MySQL Root Password: $MYSQL_ROOT_PASS"
    echo "MySQL User Password: $MYSQL_PASS"
    echo "JWT Secret: $JWT_SECRET"
    echo ""
    echo "⚠️  IMPORTANT: Save these credentials securely!"
    echo ""
else
    echo "✅ Environment file already exists"
fi

# Create backend and frontend .env files
echo "⚙️  Configuring service environments..."

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    # Update from main .env
    source .env
    sed -i "s/your-strong-database-password-here/$MYSQL_PASSWORD/" backend/.env
    sed -i "s/your-super-secret-jwt-key-minimum-32-characters-long/$JWT_SECRET/" backend/.env
fi

if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env
    source .env
    sed -i "s|http://localhost:3000|$NEXT_PUBLIC_API_URL|" frontend/.env
fi

echo "✅ Service environments configured"

# Build and start services
echo "🏗️  Building Docker images..."
docker-compose build

echo "🚀 Starting services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 10

# Check service health
echo "🔍 Checking service health..."
docker-compose ps

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📍 Access your application:"
echo "   Frontend: http://$(hostname -I | awk '{print $1}'):3001"
echo "   Backend:  http://$(hostname -I | awk '{print $1}'):3000"
echo ""
echo "📋 Useful commands:"
echo "   View logs:        docker-compose logs -f"
echo "   Stop services:    docker-compose down"
echo "   Restart:          docker-compose restart"
echo ""
echo "📖 For detailed documentation, see DEPLOYMENT.md"
