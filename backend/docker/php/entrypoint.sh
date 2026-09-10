#!/bin/sh
set -e

mkdir -p storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

chown -R www-data:www-data storage bootstrap/cache
chmod -R 775 storage bootstrap/cache

DB_HOST="${DB_HOST:-mysql}"
DB_PORT="${DB_PORT:-3306}"
DB_USERNAME="${DB_USERNAME:-koda}"
DB_PASSWORD="${DB_PASSWORD:-secret}"
DB_DATABASE="${DB_DATABASE:-koda}"
RUN_MIGRATIONS="${RUN_MIGRATIONS:-true}"

echo "Waiting for MySQL at ${DB_HOST}:${DB_PORT}..."
i=0
until mysqladmin ping -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USERNAME" -p"$DB_PASSWORD" --silent; do
    i=$((i + 1))
    if [ "$i" -ge 60 ]; then
        echo "MySQL did not become ready in time."
        exit 1
    fi
    sleep 2
done
echo "MySQL is ready."

if [ ! -f vendor/autoload.php ]; then
    echo "Installing Composer dependencies..."
    composer install --no-interaction --prefer-dist
fi

if [ -f .env ] && ! grep -q '^APP_KEY=base64:' .env; then
    php artisan key:generate --force
fi

php artisan config:clear >/dev/null 2>&1 || true

if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "Running migrations..."
    php artisan migrate --force
fi

exec docker-php-entrypoint "$@"
