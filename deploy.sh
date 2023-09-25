#!/bin/bash

echo "Pulling"
git pull

echo "Building application"
cd docker/

docker stop $(docker ps -q)
docker compose -f docker-compose.dev.yml up -d --build