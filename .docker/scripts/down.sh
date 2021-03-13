#!/bin/bash
cd $(dirname "${BASH_SOURCE[0]}")

docker-compose -p challenge-js -f ../docker-compose.yaml down
