FROM python:3.5.2-alpine
EXPOSE 8000
WORKDIR /var/www

RUN apk update && apk add \
git cmake build-base postgresql-dev nodejs python-dev jpeg-dev zlib-dev \
libxml2-dev libxslt-dev caddy

ADD requirements.txt /var/www/requirements.txt
RUN LIBRARY_PATH=/lib:/usr/lib /bin/sh -c "pip install -r requirements.txt"

ADD package.json /var/www/package.json
RUN npm install
