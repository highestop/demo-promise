import { useEffect, useState } from 'react';

export function usePromise<T, R = T | undefined>(promise: Promise<T>, catchError?: (e: any) => void): R;
export function usePromise<T, R = T>(promise: Promise<T>, defaultValue: T, catchError?: (e: any) => void): R;
export function usePromise<T>(promise: Promise<T>, defaultValue?: T, catchError?: (e: any) => void) {
    const [state, setState] = useState<T | undefined>(defaultValue);
    useEffect(() => {
        promise.then(setState).catch(catchError);
    }, []);
    return state;
}
