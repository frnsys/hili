FROM python:3.9-slim-buster
RUN mkdir -p /app
WORKDIR /app
ADD server.py /app/server.py
