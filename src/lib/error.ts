export function whenCode<T>(code: string, fn: () => T): (error: unknown) => T {
    return e => {
        if (e instanceof Error && "code" in e && e.code === code) return fn()
        throw e;
    };
}
