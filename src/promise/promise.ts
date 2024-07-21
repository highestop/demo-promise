type AbortablePromiseStatus = 'pending' | 'aborted' | 'fulfilled' | 'rejected';

export function createAbortablePromise<T>(): Readonly<{
    promise: Promise<T>;
    resolve: (t: T) => void;
    reject: (e?: Error) => void;
    abort: () => void;
    status: () => AbortablePromiseStatus;
}> {
    let status: AbortablePromiseStatus = 'pending';
    let resolve: (v: T) => void = () => {
        throw Error(`Method 'resolve' of promise has NOT been defined yet.`);
    };
    let reject: (e?: Error) => void = () => {
        throw Error(`Method 'reject' of promise has NOT been defined yet.`);
    };
    const abort = () => {
        if (status === 'pending') {
            status = 'aborted';
        } else {
            throw Error(`Promise status is ${status}, can NOT abort.`);
        }
    };
    const promise = new Promise<T>((_resolve, _reject) => {
        resolve = (t: T) => {
            if (status === 'pending') {
                _resolve(t);
                status = 'fulfilled';
            } else {
                throw Error(`Promise status is ${status}, can NOT resolve.`);
            }
        };
        reject = (e?: Error) => {
            if (status === 'pending') {
                _reject(e);
                status = 'rejected';
            } else {
                throw Error(`Promise status is ${status}, can NOT reject.`);
            }
        };
    });
    return Object.freeze({
        promise,
        resolve,
        reject,
        abort,
        status: () => status,
    });
}
