#FROM python:3.9
FROM ubuntu:16.04
FROM python:3.9
#FROM tiangolo/uwsgi-nginx-flask:python3.8-alpine

WORKDIR /app

COPY . /app
RUN pip install --upgrade pip
RUN pip install --no-cache-dir tensorflow
RUN pip install --no-cache-dir -r requirements.txt

ENV LISTEN_PORT=5000
EXPOSE 5000


#CMD ["python", "app.py"]
CMD ["python3","app.py"]

