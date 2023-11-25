"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateToken = (req, res, next) => {
    const headerToken = req.headers["authorization"];
    if (headerToken && headerToken.startsWith("Bearer ")) {
        const bearerToken = headerToken.split(" ");
        try {
            const validToken = jsonwebtoken_1.default.verify(bearerToken[1], process.env.SECRET_KEY || "rN4Z3yn96rJLv!zzB(+q");
            next();
        }
        catch (err) {
            res.status(400).json({
                error: 'invalid token'
            });
        }
    }
    else {
        res.status(400).json({
            error: "Acceso denegado",
        });
    }
};
exports.default = validateToken;
