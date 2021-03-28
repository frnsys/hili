const HILI_URL = "your hili server URL"
const HILI_PASS = "your hili key"
/* Enter tags you want to be available at tap here */
const TAGS = [
  'test',
  'myproj'
]

async function post(data) {
  const req = new Request(HILI_URL)
  req.headers = {
    'Authentication': HILI_PASS,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
  req.method = 'POST'
  req.body = JSON.stringify(data)
  const resp = await req.load()
  QuickView.present(resp)
}

/** Send the clip **/
async function sendClipWithTag(clip, tag, srcUrl, dtUrl) {
  const data = {
    href: srcUrl,
    title: '',
    time: +new Date(),
    text: clip,
    html: dtUrl !== null ? dtUrl : '',
    tags: dtUrl !== null ? ['dt', tag] : [tag]
  }
  await post(data)
}


/* Text to clip, should have been put on the clipboard */
let clip = Pasteboard.paste()

/* If reading in DevonTHINK, parse the item URL */
let dtUrl;
if (args.plainTexts.length > 0) {
  let t = args.plainTexts[0].match(/x-devonthink-item.*/)
  if (t !== null && t.length === 1) dtUrl = t[0];
}

/* The URL from the browser */
let ogUrl = args.urls[0]

/* show tags menu */
const alert = new Alert()
TAGS.forEach(function(tag) {
  alert.addAction(tag)
})
alert.addAction("Add new")
const selectIdx = await alert.presentSheet()

let tag
if (selectIdx === TAGS.length) {
  /* if 'Add new' selected, let user write a new tag */
  const newAlert = new Alert()
  newAlert.addTextField()
  await newAlert.present()
  tag = newAlert.textFieldValue(0)
} else {
  /* otherwise parse from menu */
  tag = TAGS[selectIdx]
}

sendClipWithTag(clip, tag, ogUrl, dtUrl)
