// Config
const port = 8888;
const host = `http://localhost:${port}`;
let last_tags = '';

function post(data) {
  fetch(host, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(data)
  }).catch(err => { throw err });

  // So we can send a confirmation notification
  browser.runtime.sendMessage(data);
}

// https://stackoverflow.com/a/5222955
function getSelectionHtml(sel) {
    var html = '';
    if (typeof window.getSelection != 'undefined') {
        if (sel.rangeCount) {
            var container = document.createElement('div');
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
        }
    } else if (typeof document.selection != 'undefined') {
        if (document.selection.type == 'Text') {
            html = document.selection.createRange().htmlText;
        }
    }
    return html;
}

function highlightText() {
  let tags = prompt('Tags', last_tags).split(',').map((t) => t.trim());
  if (tags == null) return;
  last_tags = tags.join(', ');
  selection = window.getSelection();
  text = selection.toString().trim();
  if (text) {
    html = getSelectionHtml(selection);
    let data = {
      href: window.location.href,
      title: document.title,
      time: +new Date(),
      text: text,
      html: html,
      tags: tags
    };
    post(data);
  }
}

function highlightImage(url) {
  let text = prompt('Description');
  let tags = prompt('Tags', last_tags).split(',').map((t) => t.trim());
  if (tags == null) return;
  last_tags = tags.join(', ');

  if (text !== null) {
    let xhr = new XMLHttpRequest();
    xhr.open('get', url);
    xhr.responseType = 'blob';
    xhr.onload = function(){
      let fr = new FileReader();
      fr.onload = function() {
        let b64 = this.result.replace(/^data:image\/[a-z]+;base64,/, '');
        let data = {
          href: window.location.href,
          title: document.title,
          time: +new Date(),
          file: {
            src: url,
            data: b64,
            type: xhr.response.type
          },
          text: text,
          tags: tags
        };
        post(data);
      };
      fr.readAsDataURL(xhr.response);
    };
    xhr.send();
  }
}

browser.runtime.onMessage.addListener(function(message) {
  switch (message.type) {
    case 'highlight-text':
      highlightText();
      break;
    case 'highlight-image':
      highlightImage(message.src);
      break;
  }
});
