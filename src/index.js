import { NALU } from './lib/nalu.js'
import { H264Parser } from './parser/h264'
import Remuxer from './remux/index'

export class Player {
  constructor(options) {
    let defaults = {
      node: '',
      fps: 30,
      flushTime: 1500
    }
    this.options = Object.assign({}, defaults, options)
    this.frameLength = 1000 / this.options.fps
    this.node = this.options.node

    this.setupMSE()

    this.remuxer = new Remuxer()
    this.remuxer.addTrack()
    this.mseReady = false
    this.remuxer.on('buffer', this.onBuffer.bind(this))
    this.remuxer.on('ready', this.createBuffer.bind(this))

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

  feed(data) {
    let nalus,
      chunks = []

    if (data.video) {
      nalus = H264Parser.extractNALu(data.video)
      if (nalus.length) {
        chunks = this.getFrames(nalus)
      }
    }

    this.remuxer.remux(chunks)
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
