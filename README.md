# m3u8.js

m3u8 client using WebAssembly and Media Source Extension

### Use

```js
import M3U8 from 'm3u8.js'

const video = document.querySelector('video')
if (M3U8.isSupported()) {
  const m3u8 = new M3U8()
  m3u8.loadSource('./001.m3u8')
  m3u8.attachMedia(video)
  m3u8.load()
  m3u8.play()
}
```
