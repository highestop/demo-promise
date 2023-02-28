/**
 * 一次性发布订阅事件的 promise 封装
 */
export function promise<T>(): Readonly<{
    // promise 对象
    promise: Promise<T>
    // resolve 方法，会 complete
    resolve: (t: T) => void
    // reject 方法，会 complete
    reject: (e?: Error) => void
    // 是否 complete
    completed: boolean
}> {
    let resolve: (t: T) => void = () => {}
    let reject: (e?: Error) => void = () => {}
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
