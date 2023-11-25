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
exports.update = exports.signIn = exports.login = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const time_converter_1 = __importDefault(require("../utils/time-converter"));
const EXPIRATION_TIME = (0, time_converter_1.default)(30);
const login = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const sql = "SELECT * FROM users WHERE email = ?";
    return new Promise((resolve, reject) => {
        connection_1.default.query(sql, [email], (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                let data = {};
                if (result.length === 0) {
                    resolve({ msg: "Invalid Email" });
                }
                else {
                    data = result[0];
                    const userPassword = data.password;
                    bcrypt_1.default.compare(password, userPassword, (err, result) => {
                        if (err) {
                            resolve(err.message);
                        }
                        else {
                            if (result) {
                                const token = jsonwebtoken_1.default.sign({
                                    name: data.name,
                                    surname: data.surname,
                                    phone: data.phone,
                                    email: data.email,
                                    address: data.address,
                                    age: data.age,
                                    gender: data.gender
                                }, process.env.SECRET_KEY, {
                                    expiresIn: EXPIRATION_TIME.toString(),
                                });
                                const dataWithoutPassword = Object.assign({}, data);
                                delete dataWithoutPassword.password;
                                resolve({ token: token, data: dataWithoutPassword });
                            }
                            else {
                                resolve({ msg: "Invalid Password" });
                            }
                        }
                    });
                }
            }
        });
    });
});
exports.login = login;
const signIn = (user) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        bcrypt_1.default
            .hash(user.password, 10)
            .then((hash) => {
            connection_1.default.query("INSERT INTO users SET ?", {
                name: user.name,
                surname: user.surname,
                password: hash,
                email: user.email,
                address: user.address,
                age: user.age,
                gender: user.gender,
                phone: user.phone,
            }, (err, data) => {
                console.log(data);
                if (err) {
                    reject(err.message);
                }
                else {
                    const userWithoutPassword = Object.assign({}, user);
                    delete userWithoutPassword.password;
                    resolve({
                        msg: "Successfully registered",
                        data: userWithoutPassword,
                    });
                }
            });
        })
            .catch((err) => {
            console.log(err.message);
        });
    });
});
exports.signIn = signIn;
const update = (user, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    console.warn('newpassword', newPassword);
    return new Promise((resolve, reject) => {
        connection_1.default.query("SELECT * FROM users WHERE id = ?", [user.id], (err, result) => {
            if (err) {
                reject(err.message);
            }
            else {
                if (result.length === 0) {
                    reject("Invalid user");
                }
                else {
                    const updateData = user;
                    bcrypt_1.default.compare(user.password, result[0].password, (err, result) => {
                        if (err) {
                            resolve(err.message);
                        }
                        else {
                            if (result) {
                                if (newPassword) {
                                    bcrypt_1.default.hash(newPassword, 10).then((hash) => {
                                        updateData.password = hash;
                                        connection_1.default.query("UPDATE users SET ? WHERE id = ?", [updateData, user.id], (err, data) => {
                                            if (err) {
                                                reject(err.message);
                                            }
                                            else {
                                                resolve({
                                                    msg: true,
                                                });
                                            }
                                        });
                                    });
                                }
                                else {
                                    delete updateData.password;
                                    connection_1.default.query("UPDATE users SET ? WHERE id = ?", [updateData, user.id], (err, data) => {
                                        if (err) {
                                            reject(err.message);
                                        }
                                        else {
                                            resolve({
                                                msg: true,
                                            });
                                        }
                                    });
                                }
                            }
                            else {
                                resolve({ msg: false });
                            }
                        }
                    });
                }
            }
        });
    });
});
exports.update = update;
