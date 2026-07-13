#!/bin/bash

DB_HOST="localhost"
DB_PORT="3306"
DB_NAME="web_assist_ai "
DB_USER="root"
DB_PASS="3366"
BACKUP_FILE="$1"

mysql -u $DB_USER -p$DB_PASS $DB_NAME < $BACKUP_FILE