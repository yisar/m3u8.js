const NON_QUOTED_COMMA = /,(?=(?:[^"]|"[^"]*")*$)/
const KV_SPLITTER = /="?([^"]*)/
const KEY_PREFIX = '#EXT-X-'
const URL_PERFIX = /(.+)\/(.+)/
let prefix = ''

export function getSegments(url) {
  prefix = url.match(URL_PERFIX)[1]
  return fetch(url)
    .then(res => res.text())
    .then(data => new Parser(data).segments)
}

export class Parser {
  constructor(playlist) {
    this.segments = []
    this.info = []

    let lines = playlist.toString().split('\n')

    if (!lines.length || !startsWith(lines[0], '#EXTM3U')) {
      throw new Error('Invalid m3u playlist')
    }

    for (let i = 0; i < lines.length; i++) {
      let line = trim(lines[i])
      if (!startsWith(line, '#')) {
        this.segments.push(prefix + '/' + line)
      } else {
        this.info.push(this.transform(line))
      }
    }
  }

  transform(line) {
    let splitted = split(line)
    let obj = {}

    obj[normalize(splitted[0])] = splitted.length > 1 ? parseParams(splitted[1]) : void 0

    return obj
  }
}

function parseParams(line) {
  let pairs = line.split(NON_QUOTED_COMMA).map(l => trim(l))
  let attrs = {}

  let i
  let kvList

  for (i = 0; i < pairs.length; ++i) {
    kvList = pairs[i].split(KV_SPLITTER)

    if (pairs.length === 1 && kvList.length === 1) {
      return kvList[0]
    }

    attrs[trim(kvList[0])] = kvList.length > 1 ? trim(kvList[1]) : void 0
  }

  return attrs
}

function normalize(key) {
  return startsWith(key, KEY_PREFIX) ? key.slice(KEY_PREFIX.length) : startsWith(key, '#') ? key.slice(1) : key
}

function split(line) {
  let pos = line.indexOf(':')
  return pos > 0 ? [line.slice(0, pos), line.slice(pos + 1)] : [line]
}

function startsWith(s, prefix) {
  if (typeof s !== 'string') {
    return false
  }

  if (typeof s.startsWith === 'function') {
    return s.startsWith(prefix)
  }

  return s.indexOf(prefix) === 0
}

function trim(str) {
  return typeof str.trim === 'function' ? str.trim() : str.replace(/^\s*|\s*$/g, '')
}
