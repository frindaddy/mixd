docker run -d -p 80:5000 --name mixd -e DB_HOST=tsides.win -e IMAGE_DIR=/root/images/ -v mixd_images:/root/images sidezbros/mixd:latest
PAUSE