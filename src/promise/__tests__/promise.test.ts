import { createAbortablePromise } from '../promise';

describe('given a promise', () => {
    let ret: ReturnType<typeof createAbortablePromise<string>>;

    beforeEach(() => {
        ret = createAbortablePromise<string>();
    });

    describe('given resolve, reject, finally callbacks', () => {
        let resolveFn: jest.Mock;
        let rejectFn: jest.Mock;
        let finallyFn: jest.Mock;

        beforeEach(() => {
            resolveFn = jest.fn();
            rejectFn = jest.fn();
            finallyFn = jest.fn();

            ret.promise.then(resolveFn).catch(rejectFn).finally(finallyFn);
        });

        describe('when resolve is called', () => {
            beforeEach(() => {
                ret.resolve('a');
            });

            test('resolveFn has been called with single time and with matched value', () => {
                expect(resolveFn).toBeCalledTimes(1);
                expect(resolveFn).toBeCalledWith('a');
            });

            test('finallyFn has been called, rejectFn has not been called', () => {
                expect(finallyFn).toBeCalledTimes(1);
                expect(rejectFn).not.toBeCalled();
            });

            test('promise status is fulfilled', () => {
                expect(ret.status()).toBe('fulfilled');
            });

            test('can not call resolve again', () => {
                expect(() => ret.resolve('b')).toThrow();
            });

            test('can not call reject', () => {
                expect(() => ret.reject()).toThrow();
            });

            test('can not call abort', () => {
                expect(() => ret.abort()).toThrow();
            });
        });

        describe('when reject is called', () => {
            let e: Error;

            beforeEach(() => {
                e = new Error();
                ret.reject(e);
            });

            test('rejectFn has been called with single time and with matched error', () => {
                expect(rejectFn).toBeCalledTimes(1);
                expect(rejectFn).toBeCalledWith(e);
            });

            test('finallyFn has been called, resolveFn has not been called', () => {
                expect(finallyFn).toBeCalledTimes(1);
                expect(resolveFn).not.toBeCalled();
            });

            test('promise status is rejected', () => {
                expect(ret.status()).toBe('rejected');
            });

            test('can not call reject again', () => {
                expect(() => ret.reject()).toThrow();
            });

            test('can not call resolve', () => {
                expect(() => ret.resolve('a')).toThrow();
            });

            test('can not call abort', () => {
                expect(() => ret.abort()).toThrow();
            });
        });

        describe('when abort is called', () => {
            beforeEach(() => {
                ret.abort();
            });

            test('no fn has been called', () => {
                expect(resolveFn).not.toBeCalled();
                expect(rejectFn).not.toBeCalled();
                expect(finallyFn).not.toBeCalled();
            });

            test('promise status is aborted', () => {
                expect(ret.status()).toBe('aborted');
            });

            test('can not call resolve, reject or abort', () => {
                expect(() => ret.resolve('a')).toThrow();
                expect(() => ret.reject()).toThrow();
                expect(() => ret.abort()).toThrow();
            });
        });
    });
});
