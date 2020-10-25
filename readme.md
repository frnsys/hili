# hili

Firefox extension to highlight and save text and images from the web.

If you are offline, `hili` queues the snippets to send when a connection returns (you need to leave the tab open until they are successfully sent; there's a little indicator that lets you know how many snippets are queued).

## Extension

To install (Firefox), open `about:debugging` and choose "Load Temporary Add-on", then select the `manifest.json` file. This is temporary (but useful for development); the add-on will be gone next time you run Firefox.

To install it more permanently:

If you're running Firefox Developer Edition, you should be able to:
1. Zip up the `extensions` directory
2. Go to `about:addons`, then `Install Add-on From File`, and select the zipped extension

Otherwise, the process is more involved:
1. Go to `https://addons.mozilla.org/en-US/developers/addon/api/key/` (create a Firefox account if necessary) and generate credentials
2. Install `web-ext`: `npm install -g web-ext`
3. Navigate to the `extensions` folder and run: `web-ext sign --api-key=<JWT issuer> --api-secret=<JWT secret>`
4. This will create an `.xpi` file in `web-ext-artifacts`.
5. Go to `about:addons`, then `Install Add-on From File`, and select the `.xpi` file.

You can also install it from here: <https://addons.mozilla.org/en-US/firefox/addon/hili/>

_Note this no longer works because the latest Firefox for Android removes support for sideloading extensions (Fenix)_:
To install on mobile, the easiest way is to visit this url from your phone: `https://frnsys.com/misc/hili.xpi`.

Instead you can use this collection id: `14770219` and user id: `hili` or add it to your own collection.

## Server

`server.py` launches a simple HTTP server that accepts any data at `localhost:<PORT>/` and saves it to a specified file.

Basic usage is: `python server.py <SAVE FILE> <UPLOAD DIRECTORY> [-p <PORT>]`

For example: `python server.py ~/notes/annos.json ~/notes/saved_files -p 8888`

Make sure `PORT` is set to the same value in `extension/hili.js` (`8888` by default).

You can also replace this server with whatever server you want, using `server.py` as a starting point. In the extension options you can specify any endpoint to send the selections to.

## Usage

Once the extension is installed:

1. Run the server, e.g. `python server.py ~/notes/annos.json ~/notes/saved_files`
2. Highlight some text on a page, and click the "Highlight" button that appears

I suggest running the server on system startup as a background process. E.g. you could add `cd ~/hili; python server.py ~/notes/annos.json ~/notes/saved_files` to your `~/.xinitrc` or equivalent file.

![](demo.gif)

You can also view your highlights by visiting the server address, e.g. `localhost:8888`

## Listener scripts

If you want something to happen whenever a new highlight is received, you can do something like:

```
#!/bin/bash
ANNOS_PATH=~/notes/web/annos.json

tail -n 0 -f $ANNOS_PATH | while read line; do
    # do something here, e.g. pass $line to another script
    echo $line
done
```
