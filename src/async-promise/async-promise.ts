

export type AsyncPromiseResolveCallback<T> = (t: T) => void
export type AsyncPromiseResolve<T> = AsyncPromiseResolveCallback<T>

export type AsyncPromiseRejectCallback = (e?: Error) => void
export type AsyncPromiseReject = AsyncPromiseRejectCallback

export interface AsyncPromise<T> {
    then: (callback: AsyncPromiseResolveCallback<T>) => AsyncPromise<T>
    catch: (callback: AsyncPromiseRejectCallback) => void
}

export interface AsyncPromiseObject<T> {
    promise: AsyncPromise<T>
    resolve: AsyncPromiseResolve<T>
    reject: AsyncPromiseReject
    result: () => T | undefined
    completed: () => boolean
}

export function asyncPromise<T>() {
    let _content: {
        status: 'fulfilled'
        result: T
    } | {
        status: 'rejected'
        result: Error | undefined
    } | {
        status: 'pending'
        result: null
    } = {
        status: 'pending',
        result: null
    }
    const _completed = () => _content.status !== 'pending'

    const _fulfilledCallbacks: Set<AsyncPromiseResolveCallback<T>> = new Set()
    const _then = (callback: AsyncPromiseResolveCallback<T>) => _fulfilledCallbacks.add(callback)
    const _resolve: AsyncPromiseResolve<T> = (t) => {
        _content = { status: 'fulfilled', result: t }
        _fulfilledCallbacks.forEach(callback => callback(t))
        _fulfilledCallbacks.clear()
    }

    const _throwCallbacks: Set<AsyncPromiseRejectCallback> = new Set()
    const _catch = (callback: AsyncPromiseRejectCallback) => _throwCallbacks.add(callback)
    const _reject: AsyncPromiseReject = (e) => {
        _content = { status: 'rejected', result: e }
        _throwCallbacks.forEach(callback => callback(e))
        _throwCallbacks.clear()
    }

    const _promise = {
        then: (callback: AsyncPromiseResolveCallback<T>) => {
            _then(callback)
            return _promise
        },
        catch: (callback: AsyncPromiseRejectCallback) => {
            _catch(callback)
            return
        }
    }

    const _result = () => _content.status === 'fulfilled' ? _content.result : undefined

    return Object.freeze({
        promise: _promise,
        resolve: (t: T) => {
            if (_completed()) {
                throw Error('promise has been completed, cannot be resolved')
            }
            _resolve(t)
        },
        reject: (e: Error) => {
            if (_completed()) {
                throw Error('promise has been completed, cannot be rejected')
            }
            _reject(e)
        },
        result: _result,
        completed: _completed
    })
}