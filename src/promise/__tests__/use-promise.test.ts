import { createAbortablePromise } from '../promise';
import { renderHook, RenderHookResult, configure } from '@testing-library/react';
import { usePromise } from '../use-promise';

configure({ reactStrictMode: true });

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

        describe('render a hook with default value', () => {
            let res: RenderHookResult<string, never>;

            beforeEach(() => {
                res = renderHook(() => usePromise(ret.promise, 'a'));
            });

            afterEach(() => {
                res.unmount();
            });

            test('result value matched', () => {
                expect(res.result.current).toBe('a');
            });
        });

        describe('render a hook, then resolve', () => {
            let res: RenderHookResult<string, never>;

            beforeEach(() => {
                res = renderHook(() => usePromise(ret.promise));
                ret.resolve('a');
            });

            afterEach(() => {
                res.unmount();
            });

            test('result value matched', () => {
                expect(res.result.current).toBe('a');
            });
        });

        describe('resolve, then render a hook', () => {
            let res: RenderHookResult<string, never>;

            beforeEach(() => {
                ret.resolve('a');
                res = renderHook(() => usePromise(ret.promise));
            });

            afterEach(() => {
                res.unmount();
            });

            test('result value matched', () => {
                expect(res.result.current).toBe('a');
            });
        });
    });
});
