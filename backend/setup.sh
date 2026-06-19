#!/bin/bash

# Web Assist AI Backend Setup Script

echo "============================================"
echo "Web Assist AI Backend Setup"
echo "============================================"

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 17 or higher."
    exit 1
fi

echo "✅ Java found: $(java -version 2>&1 | head -n 1)"

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "❌ Maven is not installed. Please install Maven."
    exit 1
fi

echo "✅ Maven found: $(mvn -v | head -n 1)"

# Create MySQL database
echo ""
echo "Setting up MySQL database..."
echo "You will be prompted for MySQL root password"

read -sp "Enter MySQL root password: " MYSQL_PASSWORD
echo ""

DB_NAME="web_assist_ai"
DB_EXISTS=$(mysql -u root -p"$MYSQL_PASSWORD" -N -B -e "SHOW DATABASES LIKE '$DB_NAME';")

if [ "$DB_EXISTS" == "$DB_NAME" ]; then
    echo "✅ Database '$DB_NAME' already exists. Skipping database creation."
else
    echo "Database '$DB_NAME' does not exist. Creating from schema.sql..."
    mysql -u root -p"$MYSQL_PASSWORD" < src/main/resources/schema.sql
    
    if [ $? -eq 0 ]; then
        echo "✅ Database created successfully"
    else
        echo "❌ Failed to create database. Please check your MySQL connection."
        exit 1
    fi
fi

# Install dependencies
echo ""
echo "Installing Maven dependencies..."
mvn clean install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "============================================"
echo "✅ Setup completed successfully!"
echo "============================================"
echo ""
echo "To start the application, run:"
echo "  mvn spring-boot:run"
echo ""
echo "The application will be available at:"
echo "  http://localhost:8080"
echo ""
