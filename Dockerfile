FROM nginx:alpine

COPY dist/JbrMmg /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80
