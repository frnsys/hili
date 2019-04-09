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

Highlight some text on a page, and click the "Highlight" button that appears

![](demo.gif)
