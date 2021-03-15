#!/bin/bash
cd $(dirname "${BASH_SOURCE[0]}")

docker-compose -p challenge-js -f ../docker-compose.yaml up -d
docker-compose -p challenge-js -f ../docker-compose.yaml exec kafka rpk topic create 'challenge.document.requested' -p 100
docker-compose -p challenge-js -f ../docker-compose.yaml exec kafka rpk topic create 'challenge.document.created' -p 5
