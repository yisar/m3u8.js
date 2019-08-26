# m3u8.js

m3u8 client using WebAssembly and Media Source Extension

### Use

```js
import M3U8 from 'm3u8.js'

if (M3U8.isSupported()) {
  const m3u8 = new M3U8({
    node: document.querySelector('video'),
    url: './001.m3u8',
    type: 'm3u8',
  })
}
```
