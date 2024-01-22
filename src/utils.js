"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapAsync = void 0;
// idk. from https://github.com/indexphonemica/pshrimp-server/blob/master/utils.js
function wrapAsync(fn) {
    return function (req, res, next) {
        return fn(req, res, next).catch(next);
    };
}
exports.wrapAsync = wrapAsync;
