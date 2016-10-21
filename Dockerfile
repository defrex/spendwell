FROM python:3.5.2-alpine
EXPOSE 8000
WORKDIR /var/www

RUN apk update && apk add git cmake build-base postgresql-dev nodejs
COPY ./ /var/www


RUN echo >> /etc/hosts
RUN echo '192.30.253.112 github.com' >> /etc/hosts
RUN echo '151.101.44.133 assets-cdn.github.com' >> /etc/hosts
RUN cat /etc/hosts

RUN pip install -r requirements.txt
RUN npm install
