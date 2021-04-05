let last_tags = '';
let mobile = false;
const state = {};
const TIMEOUT = 5000;

// Queue for offline highlights
const queue = [];

// Confirmation indicator
const successEl = document.createElement('div');
successEl.style.position = 'fixed';
successEl.style.zIndex = 10000000000;
successEl.style.display = 'none';
successEl.style.fontFamily = 'sans-serif';
successEl.style.fontSize = '12px';
successEl.style.textAlign = 'center';
successEl.style.color = '#fff';
successEl.style.padding = '18px 12px';
successEl.style.bottom = '12px';
successEl.style.right = '12px';
successEl.style.width = '30%';
successEl.style.background = '#1CBC5F';
successEl.innerText = 'Success';
document.body.appendChild(successEl);

// Queue indicator/counter
const queueEl = document.createElement('div');
queueEl.style.position = 'fixed';
queueEl.style.zIndex = 10000000000;
queueEl.style.display = 'none';
queueEl.style.userSelect = 'none';
queueEl.style.fontFamily = 'sans-serif';
queueEl.style.fontSize = '10px';
queueEl.style.textAlign = 'center';
queueEl.style.color = '#000';
queueEl.style.padding = '6px';
queueEl.style.bottom = '12px';
queueEl.style.left = '12px';
queueEl.style.background = '#f4dd29';
document.body.appendChild(queueEl);

function fetchTimeout(url, options, timeout) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout')), timeout)
    })
  ]);
}

function post(data) {
  return browser.storage.sync.get(['host', 'key']).then((res) => {
    return fetchTimeout(res.host, {
      headers: {
        'Authentication': res.key,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data)
    }, TIMEOUT).then((res) => {
      if (!res.ok) {
        if (res.status == 401) {
          alert(`hili: Unauthorized (check your authentication key)`);
        } else {
          alert(`hili: Bad response from server: ${res.status}`);
        }
      } else {
        // Send a confirmation notification
        browser.runtime.sendMessage({type: "highlighted", data});
        successEl.style.display = 'block';
        setTimeout(() => {
          successEl.style.display = 'none';
        }, 200);
      }
    }, (err) => {
      // Queue to retry later
      // There doesn't seem to be any "correct"
      // way of catching a NetworkError; it's
      // very browser-dependent. Assuming
      // that if we got here, something with the request failed,
      // and we need to retry.
      queue.push(data);
      queueEl.style.display = 'block';
      queueEl.innerText = queue.length;
      // alert(`hili: ${err.message}`);
    });
  }, (err) => {
    alert(`hili: ${err.message}`);
  });
}

// Retry queued
setInterval(() => {
  if (queue.length > 0) {
    console.log('Retrying...')
    let d = queue.pop();
    while (d) {
      post(d).then(() => {
        if (queue.length === 0) {
            queueEl.style.display = 'none';
        } else {
            queueEl.innerText = retry.length;
        }
      });
      d = queue.pop();
    }
  }
}, 10000);

// https://stackoverflow.com/a/5222955
function getSelectionHtml(sel) {
  if (sel.rangeCount) {
    var container = document.createElement('div');
    for (var i = 0, len = sel.rangeCount; i < len; ++i) {
      container.appendChild(sel.getRangeAt(i).cloneContents());
    }
    html = container.innerHTML;
  }
  return html;
}

function highlightText() {
  let {text, html} = state;
  if (!mobile) {
    let selection = window.getSelection();
    text = selection.toString().trim();
    html = getSelectionHtml(selection);
  }
  if (text) {
    let note = prompt('Note', '').trim()
    let tags = prompt('Tags', last_tags).split(',').map((t) => t.trim());
    if (tags == null) return;
    last_tags = tags.join(', ');
    let data = {
      href: cleanUrl(window.location.href),
      title: document.title,
      time: +new Date(),
      text,
      html,
      note,
      tags,
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
          href: cleanUrl(window.location.href),
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

// Remove marketing params from urls
const marketingRegex =  /(utm_.+|mc_.+|cmpid|truid|CMP)/;
function cleanUrl(url) {
  url = new URL(url);
  let toDelete = new Set();
  for (let entry of url.searchParams) {
    let [key, val] = entry;
    if (marketingRegex.test(key)) {
      toDelete.add(key);
    }
  }
  toDelete.forEach((k) => url.searchParams.delete(k));
  return url.href;
}

browser.runtime.onMessage.addListener(function(message) {
  switch (message.type) {
    case 'highlight-text':
      highlightText();
      break;
    case 'highlight-image':
      highlightImage(message.src);
      break;
    case 'init-frontend':
      mobile = true;
      setupFrontend();
      break;
  }
});

function setupFrontend() {
  // Setup highlight button
  const hiliEl = document.createElement('div');
  hiliEl.innerText = 'Highlight';
  hiliEl.style.background = '#000';
  hiliEl.style.fontFamily = 'sans-serif';
  hiliEl.style.fontSize = '12px';
  hiliEl.style.textAlign = 'center';
  hiliEl.style.color = '#fff';
  hiliEl.style.cursor = 'pointer';
  hiliEl.style.padding = '18px 12px';
  hiliEl.style.position = 'fixed';
  hiliEl.style.zIndex = 10000000000;
  hiliEl.style.display = 'none';
  hiliEl.style.bottom = '12px';
  hiliEl.style.right = '12px';
  hiliEl.style.width = '30%';
  hiliEl.addEventListener('click', function() {
    // TODO highlight image
    highlightText();
  });
  document.body.appendChild(hiliEl);

  // Resets
  window.addEventListener('blur', function() {
    hiliEl.style.display = 'none';
  });

  document.addEventListener('selectionchange', function(ev) {
    // Update selection
    let selection = window.getSelection();
    state.text = selection.toString().trim();
    state.html = getSelectionHtml(selection);
    if (state.text) {
      hiliEl.style.display = 'block';
    } else {
      hiliEl.style.display = 'none';
    }
  });
}

browser.runtime.sendMessage({type: 'init'});

window.onbeforeunload = () => {
  if (queue.length > 0) {
    return 'You have unsaved highlights. Continue?';
  }
};
