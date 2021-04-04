# hili action for [Scriptable](http://scriptable.app).

iOS sucks- but lots of people use iPhones/iPads. You can't even write Safari extensions. The only way you can do scriptive things is through system-wide files and share functionality.

Scriptable is a free app that lets you write custom logic that makes use of iOS system calls using JS. If you download it, you can use the code in 'action.js' to send snippets to your hili server. It's not the smoothest, but it works.

## Setup
1. Download [Scriptable](http://scriptable.app) from the app store.
2. Create a new script called 'Clip to Hili', and copy the code from 'action.js' in this repo (just open the repo on Github in web, and copy using your system clipboard).
3. Edit the first three lines in 'action.js' to designate your server URL, pass, and any tags you want readily available.

## Workflow
1. Highlight the text you want to send. Copy it to the clipboard using the little popup.
2. Click the Share icon on the browser menu (top right; NOT the 'Share' that is made available via the tooltip after highlighting text).
3. Select Scriptable's 'Run Script' action (best if you put it in favourites, so it's at the top).
4. Hit your action, 'Clip to Hili'.
