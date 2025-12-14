import { FormMessages } from "./types";
type AnyObject = Record<string, any>;
export declare function deepMerge<T extends AnyObject, U extends AnyObject>(obj1: T, obj2: U): T & U;
/**
 * Merge two objects
 *
 * @param {FormMessages} o1 Object 1
 * @param {FormMessages} o2 Object 2
 * @return {FormMessages}
 */
export declare function merge(o1: any, o2: any): FormMessages;
export {};
