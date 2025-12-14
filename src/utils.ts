import {FormMessages} from "./types";

type AnyObject = Record<string, any>;

export function deepMerge<T extends AnyObject, U extends AnyObject>(
    obj1: T,
    obj2: U
): T & U {
    const seen = new WeakMap();

    function merge(a: any, b: any): any {
        // Primitives or functions → override
        if (b === null || typeof b !== "object") {
            return b;
        }

        if (a === null || typeof a !== "object") {
            return clone(b);
        }

        // Circular reference protection
        if (seen.has(b)) {
            return seen.get(b);
        }

        const result: any = Array.isArray(b) ? [] : {};

        seen.set(b, result);

        // Merge keys from both objects
        const keys = new Set([...Object.keys(a), ...Object.keys(b)]);

        for (const key of keys) {
            const valA = a[key];
            const valB = b[key];

            if (valB === undefined) {
                result[key] = clone(valA);
            } else {
                result[key] = merge(valA, valB);
            }
        }

        return result;
    }

    function clone(value: any): any {
        if (value === null || typeof value !== "object") return value;

        if (value instanceof Date) return new Date(value);
        if (value instanceof Map) return new Map(value);
        if (value instanceof Set) return new Set(value);
        if (typeof value === "function") return value;

        if (Array.isArray(value)) return value.map(clone);

        const obj: AnyObject = {};
        for (const k in value) {
            obj[k] = clone(value[k]);
        }
        return obj;
    }

    return merge(obj1, obj2);
}

/**
 * Merge two objects
 *
 * @param {FormMessages} o1 Object 1
 * @param {FormMessages} o2 Object 2
 * @return {FormMessages}
 */
export function merge(o1: any, o2: any): FormMessages {
    if (o1 != null) {
        for (const i in o1) {
            o2[i] = o1[i];
        }
    }
    return o2;
}
