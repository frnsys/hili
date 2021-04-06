import sys
import os
import json
import requests
import time

# cheap args
env_args = os.environ.get("ARGS")
env_url = os.environ.get("URL")
env_pw = os.environ.get("PASSWORD")

if env_url is None:
    sys.exit("You must specify a server 'URL' in the environment.")

# globals
ARGS = env_args if env_args is not None else "/tmp/args.txt"
SERVER_URL = env_url
PASSWORD = env_pw
CACHE = "./cached_clips.json" # not in temp so it isn't removed


def send(body):
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    if PASSWORD is not None:
        headers["Authentication"] = PASSWORD

    requests.post(
        SERVER_URL,
        headers = headers,
        json = body
    )


def attempt_clip(clip):
    try:
        send(clip)

        # if clip is successful, flush all cached
        if os.path.exists(CACHE):
            with open(CACHE, "r") as c:
                cached_clips = [json.loads(l) for l in c.readlines()]

            for cached_clip in cached_clips:
                send(cached_clip)

            os.remove(CACHE)

    # TODO: only catch the specifics
    except requests.ConnectionError:
        is_first = not os.path.exists(CACHE)
        with open(CACHE, "a") as cache:
            if not is_first: cache.write("\n")
            json.dump(clip, cache)
        print("No internet connection, dumped to cache")


def run():
    with open(ARGS, 'r') as f:
        data = f.readlines()
    tm = int(round(time.time() * 1000))

    idx = 0
    title = ""
    while data[idx] != "*--STARTQUOTE--*\n" and idx < len(data):
        title += data[idx]
        idx += 1

    idx += 1 # skip STARTQUOTE
    quote = ""
    while data[idx] != "*--ENDQUOTE--*\n" and idx < len(data):
        quote += data[idx]
        idx += 1
    idx += 1 # skip ENDQUOTE

    note = data[idx].rstrip("\n").strip()
    tags = data[idx + 1].rstrip("\n").strip().split(",")
    if len(tags) == 1 and tags[0] == "": tags = []
    url = data[idx + 2].rstrip("\n").strip()

    clip = {
        "time": tm,
        "title": title,
        "html": quote,
        "note": note,
        "tags": tags,
        "href": url,
    }

    attempt_clip(clip)


if __name__ == "__main__":
    run()
