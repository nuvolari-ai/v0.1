#! /bin/bash

docker compose -f docker-compose.yml exec -it postgres psql -U postgres -d postgres
