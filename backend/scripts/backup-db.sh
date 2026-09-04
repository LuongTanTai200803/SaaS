#!/bin/bash

DATE=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_DIR="./backups"

DB_HOST="localhost"
DB_PORT="3306"
DB_NAME="web_assist_ai "
DB_USER="root"
DB_PASS="3366"

mkdir -p $BACKUP_DIR

mysqldump -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" | gzip > "$BACKUP_DIR/backup_$DATE.sql.gz"