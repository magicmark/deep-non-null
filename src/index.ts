import traverse from 'traverse';
import jp from 'jsonpath';
import { DeepNonNullable } from 'utility-types';
import _ from 'lodash';
import stringify from 'fast-json-stable-stringify';

/**
 * A custom error class to be thrown if we encounter a null value
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
 */
export class DeepNotNullError extends Error {
    constructor(...params: Array<unknown>) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(
            // @ts-ignore: ???
            ...params,
        );

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, DeepNotNullError);
        }

        this.name = 'DeepNotNullError';
    }
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

export default function isDeepNonNull<T>(
    obj: T,
    options: Omit<Options, 'allowedNull'> = { throwError: false },
    // @ts-ignore: Not quite sure how to get the generic to be happy here :/ (https://i.fluffy.cc/53fKwhL2jdpQK20GtnHZXhb7R8VCxKq3.html)
): obj is DeepNonNullable<T> {
    try {
        traverse(obj).forEach(function () {
            const { path, node } = this;

            if (node == null) {
                throw new DeepNotNullError(`${path.join('.')} is null or undefined`);
            }
        });
    } catch (error) {
        // Check if it's not our error - we should always throw in this case
        if (error.name !== 'DeepNotNullError') {
            throw error;
        }

        if (options.throwError === true) {
            throw error;
        }

        return false;
    }

    return true;
}

export function isDeepNonNullWithAllowedPaths<T>(obj: T, _options: Options = {}): obj is T {
    const options = _.defaults(_options, { throwError: false, allowedNull: [] });

    const allowedNullArray = Array.isArray(options.allowedNull) ? options.allowedNull : [options.allowedNull];
    const allowedNullJsonPaths = _.flattenDepth(
        allowedNullArray.map((path) => jp.paths(obj, path)),
        1,
    ).map((path) => {
        // get the path in the format traverse gives us
        return path
            .map((el) => {
                if (Number.isInteger(el)) {
                    return el.toString();
                } else {
                    return el;
                }
            })
            .slice(1);
    });

    const allowedNullSet = new Set(allowedNullJsonPaths.map(stringify));

    try {
        traverse(obj).forEach(function () {
            const { path, node } = this;

            if (node == null && !allowedNullSet.has(stringify(path))) {
                throw new DeepNotNullError(`${path.join('.')} is null or undefined`);
            }
        });
    } catch (error) {
        // Check if it's not our error - we should always throw in this case
        if (error.name !== 'DeepNotNullError') {
            throw error;
        }

        if (options.throwError === true) {
            throw error;
        }

        return false;
    }

    return true;
}