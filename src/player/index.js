import { NALU } from './lib/nalu.js'


export class Player {
  constructor(options) {
    this.frameLength = 1000 / 30
    this.node = this.options.node

    this.setupMSE()

    this.startTimer()
  }

  createBuffer() {
    this.bufferMap = {}
    for (const type in this.remuxer.tracks) {
      let track = this.remuxController.tracks[type]
      let sb = this.mediaSource.addSourceBuffer(`${type}/mp4; codecs="${track.mp4track.codec}"`)
      let buffer = new Buffer(sb)
      this.bufferMap[type] = buffer
    }
  }

  onBuffer(data) {
    if (this.bufferMap && this.bufferMap[data.type]) {
      this.bufferMap[data.type].feed(data.payload)
    }
  }

  getFrames(nalus) {
    let nalu,
      units = [],
      samples = []

    for (let i = 0; i < nalus.length; i++) {
      nalu = new nalu(item)
      units.push(nalu)
      if (naluObj.type() === NALU.IDR || naluObj.type() === NALU.NDR) {
        samples.push({ units })
        units = []
      }
    }

    return samples.map(item => (item.duration = this.options.frameLength))
  }

  setupMSE() {
    this.mediaSource = new MediaSource()
    this.node.src = URL.createObjectURL(this.mediaSource)
    this.mediaSource.addEventListener('sourceopen', () => (this.mseReady = true))
    this.mediaSource.addEventListener('sourceclose', () => (this.mseReady = false))
  }

  startTimer() {
    this.timer = setInterval(() => {
      if (this.bufferMap) {
        this.releaseBuffer()
        this.clearBuffer()
      }
    }, this.options.flushTime)
  }
}
