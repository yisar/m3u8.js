export class Scheduler {
  constructor(url, cb) {
    this.url = url
    fetch(this.url)
      .then(res => res.arrayBuffer())
      .then(data => {
        cb(data)
      })
  }
}
