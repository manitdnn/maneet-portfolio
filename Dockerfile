FROM php:8.2-fpm

# System dependencies
RUN apt-get update && apt-get install -y \
    git zip unzip libpng-dev libonig-dev libxml2-dev sqlite3 libsqlite3-dev \
    nodejs npm

RUN docker-php-ext-install pdo pdo_sqlite mbstring gd

WORKDIR /var/www

COPY . .

# PHP & Node dependencies build
RUN composer install --no-dev --optimize-autoloader
RUN npm install && npm run build

# SQLite DB File setup if not exists
RUN touch database/database.sqlite
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache /var/www/database

EXPOSE 8000
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=8000