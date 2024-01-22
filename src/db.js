"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
var pg_1 = require("pg");
// Definitely change these. Your deployment environment should tell you what to do here.
var CLIENT_PROPS = {
    user: 'postgres',
    password: 'postgres',
    database: 'eliotweb',
    port: 5432
};
exports.client = new pg_1.Client(CLIENT_PROPS);
