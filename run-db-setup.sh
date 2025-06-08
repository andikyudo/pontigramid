#!/bin/bash

export MONGODB_URI="mongodb+srv://pontigramid-admin:PontigramDB2024!@pontigramid-cluster.xvktgnl.mongodb.net/pontigramid?retryWrites=true&w=majority"
export DEFAULT_ADMIN_PASSWORD="PontigramAdmin2024"

echo "🚀 Running database setup with MongoDB Atlas..."
echo "📍 Cluster: pontigramid-cluster.xvktgnl.mongodb.net"
echo "👤 User: pontigramid-admin"
echo "🗄️ Database: pontigramid"
echo ""

node scripts/setup-production-db.mjs
