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
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
class authSocialController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const updateLoginDate = `UPDATE Users SET updatedAt=CURRENT_TIMESTAMP WHERE email='${email}'`;
                index_1.connection.query(updateLoginDate, (error, results) => {
                    if (error) {
                        return results.status(400).json({ message: 'Login error', code: 400 });
                    }
                    else {
                        const query = `SELECT * FROM Users WHERE email = '${email}'`;
                        index_1.connection.query(query, (error, results) => {
                            const token = jwt.sign({ email }, 'secret');
                            if (error)
                                throw error;
                            if (results.length === 1) {
                                const user = results[0];
                                const userData = {
                                    id: user.id,
                                    email: user.email,
                                    firstName: user.firstName,
                                    lastLame: user.lastLame,
                                    role: user.role,
                                    avatar: user.avatar,
                                    isBlocked: user.isBlocked,
                                    createdAt: user.createdAt,
                                    updatedAt: user.updatedAt
                                };
                                bcrypt.compare(password, user.password, (error, match) => {
                                    if (error)
                                        throw error;
                                    if (match) {
                                        res.cookie('token', token, {
                                            expires: new Date(Date.now() + (3600 * 1000 * 24 * 180 * 1)),
                                            sameSite: 'none',
                                            secure: "true",
                                            httpOnly: true,
                                        });
                                        res.status(200).json({
                                            message: 'Login successful',
                                            data: userData,
                                            code: 200
                                        });
                                    }
                                    else {
                                        return res.status(401).json({
                                            message: 'Incorrect email or password',
                                            code: 401
                                        });
                                    }
                                });
                            }
                            else {
                                return res.status(401).json({ message: 'Incorrect email or password', code: 401 });
                            }
                        });
                    }
                });
                return console.log('Connection closed');
            }
            catch (e) {
                res.status(400).json({ message: 'Login error', code: 400 });
            }
        });
    }
    registration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ message: "Registration error", errors, code: 400 });
                }
                const { firstName, lastName, email, password } = req.body;
                const salt = yield bcrypt.genSalt(10);
                const hashedPassword = yield bcrypt.hash(password, salt);
                const userExistsQuery = `SELECT * FROM Users WHERE email = '${email}'`;
                const userRegisterQuery = `INSERT INTO Users (firstName, lastName, email, password) VALUES ('${firstName}', '${lastName}', '${email}', '${hashedPassword}')`;
                index_1.connection.query(userExistsQuery, (error, results) => {
                    if (error)
                        throw error;
                    if (results.length === 1) {
                        return res.status(409).json({ message: 'User already exists', code: 409 });
                    }
                    else
                        (index_1.connection.query(userRegisterQuery, (error, results) => {
                            if (error)
                                throw error;
                            res.status(201).json({ message: 'User registered successfully', code: 201 });
                        }));
                });
                return console.log('Connection closed');
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Registration error', code: 400 });
            }
        });
    }
}
module.exports = new authSocialController();
