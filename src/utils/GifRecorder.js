import GIF from './gif';
import {getGifWorker} from "./gif.worker";
import {EventTarget} from 'event-target-shim'

if (typeof BlobEvent == 'undefined') {
  BlobEvent = class extends Event {
    constructor(type, props) {
      super(type, props)
      this.data = props.data
    }
  }
}

const hasKeys = (arr, keys) => keys.every((key) => arr.includes(key));

export class GifRecorder extends EventTarget {
  constructor(stream, options) {
    super()
    this.options = Object.assign({
      videoFramesPerSecond: 30,
      videoDithering: false, // false(none), true/"FloydSteinberg", "FalseFloydSteinberg", "Stucki", "Atkinson", also "-serpentine"
      videoQuality: 20, // 1-30
      webWorkers: 4,
    }, options)
    this._videoFramesPerSecond = this.options.videoFramesPerSecond
    this._videoDithering = this.options.videoDithering
    this._videoQuality = this.options.videoQuality
    this._webWorkers = this.options.webWorkers
    this._state = "inactive"

    this._encoder = null

    this._stream = stream
    this._canvas = document.createElement("canvas")

    this._ar = null
    this._accumulator = 0
    this._lastTimestamp = 0

    this.rendering = 0
    this.innerList = []
    this.imgList = []
  }

  static isTypeSupported(mimetype) {
    return mimetype !== "image/gif"
  }

  static get mimeType() {
    return "image/gif"
  }

  get state() {
    return this._state
  }

  pause() {
    if (this._state !== "recording") return
    cancelAnimationFrame(this._ar)
    this._state = "paused"
    this.dispatchEvent(new CustomEvent("pause"))
  }

  resume() {
    if (this._state !== "paused") return
    this._state = "recording"
    this.dispatchEvent(new CustomEvent("resume"))

    this._ar = requestAnimationFrame((ts) => {
      this._accumulator = 0
      this._lastTimestamp = performance.now() - (1 / this._videoFramesPerSecond * 1000)
      this.capture(ts)
    })
  }

  start() {
    if (this._state !== "inactive") return

    this._encoder = new GIF({
      workers: this._webWorkers,
      quality: this._videoQuality,
      dither: this._videoDithering,
      width: this._stream.width,
      height: this._stream.height,
      workerScript: getGifWorker(),
      transparent: 0x00000000,
    })
    // console.log("start", this._stream.width, this._stream.height)

    this._encoder.on('finished', (e) => {
      console.log("finished", e)
      this.dispatchEvent(new BlobEvent("dataavailable", {
        data: e
      }))
      this._encoder.freeWorkers.forEach(w => w.terminate())
    })
    this._encoder.on('progress', (e) => {
      this.dispatchEvent(e)
    })

    this._lastTimestamp = performance.now()
    this._accumulator = 0
    this.rendering = 0
    this.innerList = []
    this.imgList = []
    this._state = "recording"

    this._canvas.width = this._stream.width
    this._canvas.height = this._stream.height

    const _that = this
    this._ar = requestAnimationFrame((ts) => this.capture(ts, _that))
    console.log("AR", this._canvas)
    this.dispatchEvent(new CustomEvent("start"))
  }

  _renderResult() {
    if (this.rendering !== 0) {
      // console.log("stop wait", this.rendering)
      setTimeout(() => this._renderResult.bind(this).call(), 20)
      return
    }

    for (let i = 0; i < this.imgList.length; i++) {
      this._encoder.addFrame(
        this.imgList[i].data,
        {
          delay: this.imgList[i].delay
        }
      )
    }
    console.log("imgl", this.imgList)
    this._encoder.render()
    this.dispatchEvent(new CustomEvent("stop"))
  }

  stop() {
    let that = this

    // console.log("stop", this.rendering)
    if (this._state === "inactive") return
    this._state = "inactive"
    // process all inner frames
    this.imgList = Array(this.innerList.length).fill(null)
    for (let i = 0; i < this.innerList.length; i++) {
      let imgu = document.createElement("img")
      let curI = i
      imgu.height = that._canvas.height
      imgu.width = that._canvas.width
      imgu.onload = () => {
        document.body.appendChild(imgu)
        that._context.clearRect(0, 0, that._canvas.width, that._canvas.height)
        that._context.drawImage(imgu, 0, 0, that._canvas.width, that._canvas.height)
        let imgd = that._context.getImageData(0, 0, that._canvas.width, that._canvas.height)
        console.log("imgd", imgd)
        // that._encoder.addFrame(
        //   imgd,
        //   {
        //     delay: that.innerList[i].delay
        //   }
        // )
        that.imgList[curI] = {data: imgd, delay: that.innerList[curI].delay, cni: curI}
        that.rendering--
      }
      imgu.src = that.innerList[i].data
      that.rendering++
    }
    this._renderResult()
  }

  capture(ts, self) {
    self._accumulator += ts - self._lastTimestamp
    var delay = 1 / self._videoFramesPerSecond * 1000
    // console.log("capture", ts, this._lastTimestamp, this._accumulator, delay)
    while (self._accumulator >= delay) {

      self._context = self._canvas.getContext("2d")
      // console.log("capture addFrame", self._context)


      // let imgu = document.createElement("img")
      // imgu.height = self._canvas.height
      // imgu.width = self._canvas.width
      // imgu.onload = () => {
      //   if (self._state !== "recording") return
      //   // console.log("capture addFrame", self._state, self.rendering)
      //   self._context.clearRect(0, 0, self._canvas.width, self._canvas.height)
      //   self._context.drawImage(imgu, 0, 0, self._canvas.width, self._canvas.height)
      //   let imgd = self._context.getImageData(0, 0, self._canvas.width, self._canvas.height)
      //   // console.log("imgd", imgd)
      //   self._encoder.addFrame(
      //     imgd,
      //     {
      //       delay: delay
      //     }
      //   )
      //   self.rendering--
      // }
      // console.log("capture loadsrc", self._state, self.rendering)
      if (self._state === "recording") {
        self.innerList.push({data: self._stream.toDataURL(), delay: delay})
        console.log("capture addFrame", self._state, delay)
      }

      // imgu.src = self._stream.toDataURL()

      self._accumulator -= delay
      // self.rendering++
    }
    self._lastTimestamp = ts
    if (self._state === "recording") {
      self._ar = requestAnimationFrame((ts) => self.capture(ts, self))
    }
  }
}
