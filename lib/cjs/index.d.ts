import { DeepNonNullable } from 'utility-types';
/**
 * A custom error class to be thrown if we encounter a null value
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
 */
export declare class DeepNotNullError extends Error {
    constructor(...params: Array<unknown>);
}
export interface Options {
    /**
     * If a null value is found, should we throw an error instead of returning null?
     * (Default: false)
     */
    throwError?: boolean;
    /**
     * JSONPath (or list thereof) of properties that are allowed to be null
     * @see https://github.com/dchester/jsonpath#jsonpath-syntax
     * (Default: [])
     */
    allowedNull?: string | Array<string>;
}
// @ts-ignore: TODO: Make this generic work
export default function isDeepNonNull<T>(obj: T, options?: Omit<Options, 'allowedNull'>): obj is DeepNonNullable<T>;
export declare function isDeepNonNullWithAllowedPaths<T>(obj: T, _options?: Options): obj is T;
