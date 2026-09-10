.PHONY: help up down build restart logs shell migrate test fresh

help:
	@echo "Koda backend — Docker commands"
	@echo ""
	@echo "  make up        Start nginx, app, and MySQL"
	@echo "  make down      Stop all services"
	@echo "  make build     Build the PHP image"
	@echo "  make migrate   Run migrations"
	@echo "  make test      Run Pest inside the app container"
	@echo "  make shell     Open a shell in the app container"
	@echo "  make logs      Follow compose logs"
	@echo "  make fresh     Recreate volumes and rebuild"

up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose build

restart:
	docker compose restart

logs:
	docker compose logs -f

shell:
	docker compose exec app bash

migrate:
	docker compose exec app php artisan migrate --force

test:
	docker compose exec app php artisan test

fresh:
	docker compose down -v
	docker compose up -d --build
