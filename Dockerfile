# Step 1: Composer binary
FROM composer:latest AS composer_stage

# Step 2: Main PHP runtime
FROM php:8.2-cli

# Copy Composer binary
COPY --from=composer_stage /usr/bin/composer /usr/bin/composer

# Install dependencies
RUN apt-get update && apt-get install -y \
    git zip unzip libpng-dev libonig-dev libxml2-dev sqlite3 libsqlite3-dev default-mysql-client \
    nodejs npm

# Install PDO extensions cleanly
RUN docker-php-ext-install pdo pdo_sqlite pdo_mysql mbstring gd

WORKDIR /var/www

COPY . .

# Ignore platform reqs during composer install
RUN composer install --no-dev --optimize-autoloader --ignore-platform-reqs
RUN npm install && npm run build

# Permissions setup
RUN mkdir -p database storage bootstrap/cache
RUN chmod -R 777 storage bootstrap/cache database

EXPOSE 10000
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=10000