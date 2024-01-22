"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var db_1 = require("./db");
var utils_1 = require("./utils");
var app = (0, express_1.default)();
var port = 3000;
app.get('/dynamicContent', function (req, res) {
    res.send("Hi! I'm some dynamic content! You loaded this page at millisecond ".concat(new Date().getTime(), " of the UNIX \u5E74\u53F7."));
});
app.get('/words', (0, utils_1.wrapAsync)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var words;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.client.query('SELECT * FROM words_diacritics')];
            case 1:
                words = _a.sent();
                res.json(words.rows);
                return [2 /*return*/];
        }
    });
}); }));
app.put('/words/:word/increment', (0, utils_1.wrapAsync)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var update;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.client.query('UPDATE words_diacritics SET total_count = total_count + 1 WHERE word = $1::text', [req.params.word])];
            case 1:
                update = _a.sent();
                res.json(update);
                return [2 /*return*/];
        }
    });
}); }));
app.post('/words/:word', (0, utils_1.wrapAsync)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var insert;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db_1.client.query("INSERT INTO words_diacritics VALUES ($1::text, 0)", [req.params.word])];
            case 1:
                insert = _a.sent();
                res.json(insert);
                return [2 /*return*/];
        }
    });
}); }));
// Default error handling middleware is fine for now
// https://expressjs.com/en/starter/static-files.html
app.use(express_1.default.static('public'));
(function () {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.client.connect()];
                case 1:
                    _a.sent();
                    app.listen(port, function () {
                        console.log("Example app listening on port ".concat(port));
                    });
                    return [2 /*return*/];
            }
        });
    });
})();
