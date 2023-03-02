export function promise<T>(): Readonly<{
    // promise object
    promise: Promise<T>
    // resolve to complete
    resolve: (t: T) => void
    // reject to complete
    reject: (e?: Error) => void
    // if completed
    completed: boolean
}> {
    let resolve: (t: T) => void = () => { }
    let reject: (e?: Error) => void = () => { }
    let completed = false
    const promise = new Promise<T>((_resolve, _reject) => {
        resolve = (t: T) => {
            _resolve(t)
            completed = true
        }
        reject = (e?: Error) => {
            _reject(e)
            completed = true
        }
    })
    return Object.freeze({ promise, resolve, reject, completed })
}
