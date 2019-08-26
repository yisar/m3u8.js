class M3U8 {
  constructor () {}
  static isSupported(){
    return 'MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)
  }
}
