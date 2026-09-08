FROM php:8.3-cli-alpine

# Install system dependencies & PostgreSQL dev libraries
RUN apk add --no-cache \
    postgresql-dev \
    libzip-dev \
    zip \
    unzip \
    curl \
    git

# Install PHP extensions
RUN docker-php-ext-install \
    pdo \
    pdo_pgsql \
    pdo_mysql \
    zip \
    bcmath \
    pcntl

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy composer files first for layer caching
COPY composer.json ./

# Install dependencies
RUN composer install --no-interaction --no-scripts --no-autoloader

# Copy application source
COPY . .

# Finish autoloader
RUN composer dump-autoload --optimize

# Expose API port
EXPOSE 8000

# Default command starts PHP built-in webserver
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public", "public/index.php"]
