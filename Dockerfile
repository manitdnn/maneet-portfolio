FROM php:8.2-cli

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

# Storage & Database permissions
RUN mkdir -p database storage bootstrap/cache
RUN touch database/database.sqlite
RUN chmod -R 777 storage bootstrap/cache database

EXPOSE 10000
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=10000