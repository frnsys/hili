// Config
const port = 8888;
const host = `http://localhost:${port}`;

// Current selection
let selection = null;
let text = null;
let html = null;

function post(data) {
  fetch(host, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(data)
  }).catch(err => { throw err });
}

// Setup highlight button
const hiliEl = document.createElement('div');
hiliEl.innerText = 'Highlight';
hiliEl.style.background = 'rgba(0,0,0,0.8)';
hiliEl.style.fontFamily = 'sans-serif';
hiliEl.style.fontSize = '10px';
hiliEl.style.color = '#fff';
hiliEl.style.cursor = 'pointer';
hiliEl.style.padding = '2px';
hiliEl.style.position = 'fixed';
hiliEl.style.display = 'none';
hiliEl.addEventListener('click', function() {
  if (text) {
    let data = {
      href: window.location.href,
      title: document.title,
      time: +new Date(),
      text: text,
      html: html
    };
    post(data);
  }
});
document.body.appendChild(hiliEl);

// Adjust highlight button position
window.addEventListener('scroll', function() {
  let text = selection.toString().trim();
  if (text) {
    let bb = selection.getRangeAt(0).getBoundingClientRect();
    hiliEl.style.left = `${bb.left}px`;
    hiliEl.style.top = `${bb.top + bb.height}px`;
  }
});

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

// Resets
window.addEventListener('blur', function() {
  hiliEl.style.display = 'none';
});
document.body.addEventListener('mousemove', function() {
  let sel = window.getSelection();
  let text = sel.toString().trim();
  if (!text) hiliEl.style.display = 'none';
});
document.body.addEventListener('mousedown', function(ev) {
  if (ev.target !== hiliEl) {
    hiliEl.style.display = 'none';
  }
});

// Selection
document.body.addEventListener('mouseup', function(ev) {
  if (ev.target == hiliEl) return;
  selection = window.getSelection();
  text = selection.toString().trim();
  if (text) {
    html = getSelectionHtml(selection);
    let bb = selection.getRangeAt(0).getBoundingClientRect();
    hiliEl.style.display = 'block';
    hiliEl.style.left = `${bb.left}px`;
    hiliEl.style.top = `${bb.top + bb.height}px`;
  } else {
    hiliEl.style.display = 'none';
  }
});
