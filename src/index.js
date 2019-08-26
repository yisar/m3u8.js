const mimeCodec = {
  mp4: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
}

class M3U8 {
  constructor () {
    this.mse = new MediaSource()
  }
  load (src, type) {
    this.src = src
    this.type = type
    this.mime = mimeCodec[type]
  }
  attach (video) {
    this.video = video
    video.src = URL.createObjectURL(this.mse)
  }
  play () {
    this.mse.addEventListener('sourceopen', this.sourceOpen.bind(this))
  }
  sourceOpen () {
    const sourceBuffer = this.mse.addSourceBuffer(this.mime)
    fetchAB(this.src, buf => {
      sourceBuffer.addEventListener('updateend', () => {
        mediaSource.endOfStream()
        this.video.play()
      })
      sourceBuffer.appendBuffer(buf)
    })
  }
  static isSupported () {
    return 'MediaSource' in window
  }
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
