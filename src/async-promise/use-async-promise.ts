import { useEffect, useState } from 'react';
import { AsyncPromise } from './async-promise';

export function useAsyncPromise<T, R = T | undefined>(promise: AsyncPromise<T>, catchError?: (e: any) => void): R;
export function useAsyncPromise<T, R = T>(promise: AsyncPromise<T>, defaultValue: T, catchError?: (e: any) => void): R;
export function useAsyncPromise<T, R>(promise: AsyncPromise<T>, defaultValue?: T, catchError?: (e: any) => void) {
    const [state, setState] = useState<T | undefined>(defaultValue);
    useEffect(() => {
        promise.then((data) => setState(data)).catch((e) => catchError?.(e));
    }, []);
    return state;
}
