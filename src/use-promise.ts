import { useEffect, useState } from "react"

export function usePromise<T, R = T | undefined>(promise: Promise<T>, catchError?: (e: any) => void): R
export function usePromise<T, R = T>(promise: Promise<T>, defaultValue: T, catchError?: (e: any) => void): R
export function usePromise<T, R>(promise: Promise<T>, defaultValue?: T, catchError?: (e: any) => void) {
    const [state, setState] = useState<T | undefined>(defaultValue)
    useEffect(() => {
        promise
            .then((data) => setState(data))
            .catch((e) => {
                catchError?.(e)
            })
    }, [])
    return state
}