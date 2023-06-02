docker run -d -p 80:5000 --name mixd -e DB_HOST=127.0.0.1 -e IMAGE_DIR=/root/images/ -v mixd_images:/root/images frindaddy/mixd:latest
PAUSE