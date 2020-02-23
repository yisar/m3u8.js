import { getSegments } from '../src/parser/m3u8'

const p = getSegments('https://rescdn.yishihui.com/longvideo/transcode/video/vpc/20200221/12255802foEBblL7Fey4rIHoNx-safe1582272600.m3u8')

p.then(str => console.log(str))
