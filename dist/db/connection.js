"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = __importDefault(require("mysql"));
class DatabaseConnection {
    constructor() {
        this.connection = mysql_1.default.createConnection({
            host: "localhost",
            user: "root",
            password: "",
            database: "app-web-am",
        });
    }
    static getInstance() {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }
    getConnection() {
        return this.connection;
    }
}
const connection = DatabaseConnection.getInstance().getConnection();
exports.default = connection;
