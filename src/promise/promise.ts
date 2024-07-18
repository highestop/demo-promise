export function promise<T>(): Readonly<{
    // promise object
    promise: Promise<T>
    // resolve to complete
    resolve: (t: T) => void
    // reject to complete
    reject: (e?: Error) => void
    // abort promise, no resolve or reject would happen
    abort: () => void
    // if completed
    completed: boolean
}> {
    let resolve: (t: T) => void = () => void 0
    let reject: (e?: Error) => void = () => void 0
    let completed = false
    let aborted = false
    let abort = () => aborted = true
    const promise = new Promise<T>((_resolve, _reject) => {
        resolve = (t: T) => {
            if (aborted) {
                return
            }
            _resolve(t)
            completed = true
        }
        reject = (e?: Error) => {
            if (aborted) {
                return
            }
            _reject(e)
            completed = true
        }
    })
    return Object.freeze({ promise, resolve, reject, abort, completed })
}
