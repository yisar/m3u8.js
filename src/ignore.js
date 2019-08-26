var video = document.querySelector('video')

var assetURL = 'frag_bunny.mp4'
var mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'

if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
  var mediaSource = new MediaSource()
  video.src = URL.createObjectURL(mediaSource)
  mediaSource.addEventListener('sourceopen', sourceOpen)
} else {
  console.error('Unsupported MIME type or codec: ', mimeCodec)
}

function sourceOpen (_) {
  var mediaSource = this
  var sourceBuffer = mediaSource.addSourceBuffer(mimeCodec)
  fetchAB(assetURL, function (buf) {
    sourceBuffer.addEventListener('updateend', function (_) {
      mediaSource.endOfStream()
      video.play()
    })
    sourceBuffer.appendBuffer(buf)
  })
}

function fetchAB (url, cb) {
  var xhr = new XMLHttpRequest()
  xhr.open('get', url)
  xhr.responseType = 'arraybuffer'
  xhr.onload = function () {
    cb(xhr.response)
  }
  xhr.send()
}
