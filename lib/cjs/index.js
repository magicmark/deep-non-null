"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDeepNonNullWithAllowedPaths = exports.DeepNotNullError = void 0;
var traverse_1 = __importDefault(require("traverse"));
var jsonpath_1 = __importDefault(require("jsonpath"));
var lodash_1 = __importDefault(require("lodash"));
var fast_json_stable_stringify_1 = __importDefault(require("fast-json-stable-stringify"));
/**
 * A custom error class to be thrown if we encounter a null value
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
 */
var DeepNotNullError = /** @class */ (function (_super) {
    __extends(DeepNotNullError, _super);
    function DeepNotNullError() {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        var _this = _super.apply(this, params) || this;
        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(_this, DeepNotNullError);
        }
        _this.name = 'DeepNotNullError';
        return _this;
    }
    return DeepNotNullError;
}(Error));
exports.DeepNotNullError = DeepNotNullError;
function isDeepNonNull(obj, options) {
    if (options === void 0) { options = { throwError: false }; }
    try {
        traverse_1.default(obj).forEach(function () {
            var _a = this, path = _a.path, node = _a.node;
            if (node == null) {
                throw new DeepNotNullError(path.join('.') + " is null or undefined");
            }
        });
    }
    catch (error) {
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
exports.default = isDeepNonNull;
function isDeepNonNullWithAllowedPaths(obj, _options) {
    if (_options === void 0) { _options = {}; }
    var options = lodash_1.default.defaults(_options, { throwError: false, allowedNull: [] });
    var allowedNullArray = Array.isArray(options.allowedNull) ? options.allowedNull : [options.allowedNull];
    var allowedNullJsonPaths = lodash_1.default.flattenDepth(allowedNullArray.map(function (path) { return jsonpath_1.default.paths(obj, path); }), 1).map(function (path) {
        // get the path in the format traverse gives us
        return path
            .map(function (el) {
            if (Number.isInteger(el)) {
                return el.toString();
            }
            else {
                return el;
            }
        })
            .slice(1);
    });
    var allowedNullSet = new Set(allowedNullJsonPaths.map(fast_json_stable_stringify_1.default));
    try {
        traverse_1.default(obj).forEach(function () {
            var _a = this, path = _a.path, node = _a.node;
            if (node == null && !allowedNullSet.has(fast_json_stable_stringify_1.default(path))) {
                throw new DeepNotNullError(path.join('.') + " is null or undefined");
            }
        });
    }
    catch (error) {
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
exports.isDeepNonNullWithAllowedPaths = isDeepNonNullWithAllowedPaths;
