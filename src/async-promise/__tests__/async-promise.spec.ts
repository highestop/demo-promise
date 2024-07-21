import { asyncPromise } from '../async-promise';

describe('初始状态下的 promise', () => {
    const obj = asyncPromise();
    test('completed 为 false', () => {
        expect(obj.completed()).toBeFalsy();
    });
    test('result 没有值', () => {
        expect(obj.result()).toBeUndefined();
    });
});

describe('尝试修改 promise', () => {
    const obj = asyncPromise();
    test('会报错', () => {
        expect(() => ((obj.promise as any) = {})).toThrow();
    });
    test('会报错', () => {
        expect(() => ((obj.promise.catch as any) = {})).toThrow();
    });
    test('会报错', () => {
        expect(() => ((obj.promise.then as any) = {})).toThrow();
    });
    test('会报错', () => {
        expect(() => ((obj.completed as any) = {})).toThrow();
    });
    test('会报错', () => {
        expect(() => ((obj.result as any) = {})).toThrow();
    });
    test('会报错', () => {
        expect(() => ((obj.resolve as any) = {})).toThrow();
    });
    test('会报错', () => {
        expect(() => ((obj.reject as any) = {})).toThrow();
    });
});

describe('调用 resolve', () => {
    const obj = asyncPromise<number>();
    obj.resolve(1);
    test('completed 为 true', () => {
        expect(obj.completed()).toBeTruthy();
    });
    test('result 与结果相同', () => {
        expect(obj.result()).toBe(1);
    });
    test('再次 resolve 会报错', () => {
        expect(() => obj.resolve(1)).toThrow();
    });
    test('再次 reject 会报错', () => {
        expect(() => obj.reject()).toThrow();
    });
});

describe('调用 reject', () => {
    const obj = asyncPromise<number>();
    obj.reject(new Error('error'));
    test('completed 为 true', () => {
        expect(obj.completed()).toBeTruthy();
    });
    test('result 没有值', () => {
        expect(obj.result()).toBeUndefined();
    });
    test('再次 resolve 会报错', () => {
        expect(() => obj.resolve(1)).toThrow();
    });
    test('再次 reject 会报错', () => {
        expect(() => obj.reject()).toThrow();
    });
});

describe('订阅 promise', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });
    afterEach(() => {
        jest.useRealTimers();
    });
    describe('只订阅 then', () => {
        const obj = asyncPromise();
        const resolveFn = jest.fn();
        beforeAll(() => {
            obj.promise.then(resolveFn);
        });
        test('resolveFn 不会被调用', () => {
            expect(resolveFn).not.toBeCalled();
        });
    });
    describe('多次订阅 then', () => {
        const obj = asyncPromise();
        test('不会报错', () => {
            const resolveFn = jest.fn();
            expect(() => {
                obj.promise.then(resolveFn);
                obj.promise.then(resolveFn);
            }).not.toThrow();
        });
        test('不会报错', () => {
            expect(() => {
                obj.promise.then(jest.fn());
                obj.promise.then(jest.fn());
            }).not.toThrow();
        });
    });
    describe('只订阅 catch', () => {
        const obj = asyncPromise();
        const rejectFn = jest.fn();
        beforeAll(() => {
            obj.promise.catch(rejectFn);
        });
        test('rejectFn 不会被调用', () => {
            expect(rejectFn).not.toBeCalled();
        });
    });
    describe('多次订阅 catch', () => {
        const obj = asyncPromise();
        test('不会报错', () => {
            const rejectFn = jest.fn();
            expect(() => {
                obj.promise.catch(rejectFn);
                obj.promise.catch(rejectFn);
            }).not.toThrow();
        });
        test('不会报错', () => {
            expect(() => {
                obj.promise.catch(jest.fn());
                obj.promise.catch(jest.fn());
            }).not.toThrow();
        });
    });
    describe('依次订阅 then/catch', () => {
        const obj = asyncPromise();
        const fn = jest.fn();
        test('不会报错', () => {
            expect(() => {
                obj.promise.then(fn);
                obj.promise.catch(fn);
            }).not.toThrow();
        });
        test('不会报错', () => {
            expect(() => {
                obj.promise.catch(fn);
                obj.promise.then(fn);
            }).not.toThrow();
        });
    });
});

describe('订阅 then/catch 与调用 resolve/reject', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });
    afterEach(() => {
        jest.useRealTimers();
    });
    describe('先订阅 then 再调用 resolve', () => {
        const obj = asyncPromise();
        const resolveFn = jest.fn();
        beforeAll(() => {
            obj.promise.then(resolveFn);
            obj.resolve();
        });
        test('resolveFn 会被同步调用', () => {
            expect(resolveFn).toBeCalledTimes(1);
        });
    });
    describe('先订阅 then 再调用 reject', () => {
        const obj = asyncPromise();
        const resolveFn = jest.fn();
        beforeAll(() => {
            obj.promise.then(resolveFn);
            obj.reject();
        });
        test('resolveFn 不会被调用', () => {
            expect(resolveFn).not.toBeCalled();
        });
    });
    describe('先订阅 catch 再调用 resolve', () => {
        const obj = asyncPromise();
        const rejectFn = jest.fn();
        beforeAll(() => {
            obj.promise.catch(rejectFn);
            obj.resolve();
        });
        test('rejectFn 不会被调用', () => {
            expect(rejectFn).not.toBeCalled();
        });
    });
    describe('先订阅 catch 再调用 reject', () => {
        const obj = asyncPromise();
        const rejectFn = jest.fn();
        beforeAll(() => {
            obj.promise.catch(rejectFn);
            obj.reject();
        });
        test('rejectFn 会被同步调用', () => {
            expect(rejectFn).toBeCalledTimes(1);
        });
    });
    describe('先 resolve 再订阅 then', () => {
        const obj = asyncPromise();
        const resolveFn = jest.fn();
        beforeAll(() => {
            obj.resolve();
            obj.promise.then(resolveFn);
        });
        test('resolveFn 会立即被同步调用', () => {
            expect(resolveFn).toBeCalledTimes(1);
        });
    });
    describe('先 reject 再订阅 then', () => {
        const obj = asyncPromise();
        const resolveFn = jest.fn();
        beforeAll(() => {
            obj.reject();
            obj.promise.then(resolveFn);
        });
        test('resolveFn 不会被调用', () => {
            expect(resolveFn).not.toBeCalled();
        });
    });
    describe('先 resolve 再订阅 catch', () => {
        const obj = asyncPromise();
        const rejectFn = jest.fn();
        beforeAll(() => {
            obj.resolve();
            obj.promise.catch(rejectFn);
        });
        test('rejectFn 不会被调用', () => {
            expect(rejectFn).not.toBeCalled();
        });
    });
    describe('先 reject 再订阅 catch', () => {
        const obj = asyncPromise();
        const rejectFn = jest.fn();
        beforeAll(() => {
            obj.reject();
            obj.promise.catch(rejectFn);
        });
        test('rejectFn 会立即被同步调用', () => {
            expect(rejectFn).toBeCalledTimes(1);
        });
    });
    describe('同时订阅了多个 then 再调用 resolve', () => {
        const obj = asyncPromise();
        const resolveFn1 = jest.fn();
        const resolveFn2 = jest.fn();
        beforeAll(() => {
            obj.promise.then(resolveFn1);
            obj.promise.then(resolveFn2);
            obj.resolve();
        });
        test('都会被调用', () => {
            expect(resolveFn1).toBeCalledTimes(1);
            expect(resolveFn2).toBeCalledTimes(1);
        });
    });
    describe('同时订阅了多个 catch 再调用 reject', () => {
        const obj = asyncPromise();
        const rejectFn1 = jest.fn();
        const rejectFn2 = jest.fn();
        beforeAll(() => {
            obj.promise.catch(rejectFn1);
            obj.promise.catch(rejectFn2);
            obj.reject();
        });
        test('都会被调用', () => {
            expect(rejectFn1).toBeCalledTimes(1);
            expect(rejectFn2).toBeCalledTimes(1);
        });
    });
    describe('订阅了一个 then 多次再调用 resolve', () => {
        const obj = asyncPromise();
        const resolveFn = jest.fn();
        beforeAll(() => {
            obj.promise.then(resolveFn);
            obj.promise.then(resolveFn);
            obj.resolve();
        });
        test('resolveFn 只会被调用 1 次', () => {
            expect(resolveFn).toBeCalledTimes(1);
        });
    });
    describe('订阅了一个 catch 多次再调用 reject', () => {
        const obj = asyncPromise();
        const rejectFn = jest.fn();
        beforeAll(() => {
            obj.promise.catch(rejectFn);
            obj.promise.catch(rejectFn);
            obj.reject();
        });
        test('resolveFn 只会被调用 1 次', () => {
            expect(rejectFn).toBeCalledTimes(1);
        });
    });
});
