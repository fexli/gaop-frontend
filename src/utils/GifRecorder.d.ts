export declare class GifRecorder extends EventTarget {
    constructor(stream: any, options: Record<string, any>)

    static isTypeSupported(mimetype: string)

    static get mimeType()

    get state()

    pause()

    resume()

    start(timeslice: any)

    stop()

    capture(ts: Number)
}
