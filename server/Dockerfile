FROM python:3.10-slim

WORKDIR /usr/src/app

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt /usr/src/app/requirements.txt
RUN pip install -r requirements.txt --src /usr/local/src

RUN apt-get clean \
    && apt-get -y update

RUN apt-get -y install nginx python3-dev build-essential
RUN apt-get -y install uwsgi uwsgi-plugins-all
RUN pip install uwsgi


ENV PORT 80
ENV HOST 0.0.0.0

COPY . /usr/src/app/

COPY nginx.conf /etc/nginx
RUN chmod +x ./start.sh
CMD ["./start.sh"]
