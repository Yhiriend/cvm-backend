"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductos = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const getProductos = (req, res) => {
    connection_1.default.query('SELECT * FROM products', (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            res.json({
                data
            });
        }
    });
};
exports.getProductos = getProductos;
