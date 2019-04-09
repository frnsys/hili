# hili

Firefox extension to highlight and save text from the web.

## Extension

To install (Firefox), open `about:debugging` and choose "Load Temporary Add-on", then select the `manifest.json` file.

## Server

`server.py` launches a simple HTTP server that accepts any data at `localhost:<PORT>/` and saves it to a specified file.

Basic usage is: `python server.py <SAVE FILE> [-p <PORT>]`

For example: `python server.py ~/notes/annos.json -p 8888`

Make sure `PORT` is set to the same value in `extension/hili.js` (`8888` by default).

## Usage

Once the extension is installed:

1. Run the server, e.g. `python server.py ~/notes/annos.json`
2. Highlight some text on a page, and click the "Highlight" button that appears

I suggest running the server on system startup as a background process. E.g. you could add `cd ~/hili; python server.py ~/notes/annos.json` to your `~/.xinitrc` or equivalent file.

![](shot.gif)
