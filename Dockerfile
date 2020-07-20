FROM python:3.8-slim-buster
RUN mkdir -p /app
WORKDIR /app
## INSTALL NOM - workaround for now until PR is merged
# RUN pip install nom
RUN apt-get update && apt-get install -y git
RUN git clone --single-branch --branch fix/lxml-requests-reqs https://github.com/breezykermo/nom
RUN cd nom && pip install .
## ADD SERVER
ADD server.py /app/server.py
