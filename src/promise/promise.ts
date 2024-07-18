export function promise<T>(): Readonly<{
    // promise object
    promise: Promise<T>
    // resolve to complete
    resolve: (t: T) => void
    // reject to complete
    reject: (e?: Error) => void
    // abort promise, no resolve or reject would happen
    abort: () => void
}> {
    let status: 'pending' | 'aborted' | 'fulfilled' | 'rejected' = 'pending'
    let resolve: (v: T) => void
    let reject: (e: Error) => void
    const abort = () => {
        if (status === 'pending') {
            status = 'aborted'
        } else {
            throw Error(`promise status is ${status}, cannot abort.`)
        }
    }
    const promise = new Promise<T>((_resolve, _reject) => {
        resolve = (t: T) => {
            if (status === 'pending') {
                _resolve(t)
                status = 'fulfilled'
            } else {
                throw Error(`promise status is ${status}, cannot resolve.`)
            }
        }
        reject = (e?: Error) => {
            if (status === 'pending') {
                _reject(e)
                status = 'rejected'
            } else {
                throw Error(`promise status is ${status}, cannot rejecte.`)
            }
        }
    })
    return Object.freeze({
        promise,
        resolve,
        reject,
        abort
    })
}
