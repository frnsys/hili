document.addEventListener('DOMContentLoaded', () => {
  browser.storage.sync.get(['host', 'key']).then((res) => {
    document.querySelector('#key').value = res.key || '';
    document.querySelector('#host').value = res.host || 'http://localhost:8888';
  }, (err) => {
    alert(err);
  });
});
document.querySelector('form').addEventListener('submit', (ev) => {
  ev.preventDefault();
  browser.storage.sync.set({
    key: document.querySelector('#key').value,
    host:document.querySelector('#host').value
  });
});

