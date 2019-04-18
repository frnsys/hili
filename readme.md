# hili

Firefox extension to highlight and save text from the web.

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

## Server

`server.py` launches a simple HTTP server that accepts any data at `localhost:<PORT>/` and saves it to a specified file.

Basic usage is: `python server.py <SAVE FILE> <UPLOAD DIRECTORY> [-p <PORT>]`

For example: `python server.py ~/notes/annos.json ~/notes/saved_files -p 8888`

Make sure `PORT` is set to the same value in `extension/hili.js` (`8888` by default).

## Usage

Once the extension is installed:

1. Run the server, e.g. `python server.py ~/notes/annos.json ~/notes/saved_files`
2. Highlight some text on a page, and click the "Highlight" button that appears

I suggest running the server on system startup as a background process. E.g. you could add `cd ~/hili; python server.py ~/notes/annos.json ~/notes/saved_files` to your `~/.xinitrc` or equivalent file.

![](demo.gif)
