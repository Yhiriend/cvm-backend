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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedDatabase = void 0;
// seed.ts
const connection_1 = __importDefault(require("../db/connection"));
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connection_1.default.connect();
        const slq = "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(250),surname VARCHAR(250),email VARCHAR(250),address VARCHAR(250),phone VARCHAR(10),age INT,gender VARCHAR(10))";
        yield connection_1.default.query(slq);
    }
    catch (error) {
        console.error('Error seeding database:', error);
    }
    finally {
        connection_1.default.end();
    }
});
exports.seedDatabase = seedDatabase;
