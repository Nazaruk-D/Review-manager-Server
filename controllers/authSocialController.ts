import {connection} from "../index";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator')


class authSocialController {
    async login(req: any, res: any) {
        try {
            const {email, password} = req.body;
            const updateLoginDate = `UPDATE Users SET updatedAt=CURRENT_TIMESTAMP WHERE email='${email}'`;
            connection.query(updateLoginDate, (error: any, results: any) => {
                if (error) {
                    return results.status(400).json({message: 'Login error', code: 400})
                } else {
                    const query = `SELECT * FROM Users WHERE email = '${email}'`;
                    connection.query(query, (error: any, results: any) => {
                        const token = jwt.sign({email}, 'secret');
                        if (error) throw error;
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
                            bcrypt.compare(password, user.password, (error: any, match: any) => {
                                if (error) throw error;
                                if (match) {
                                    res.cookie('token', token, {
                                        expires: new Date(Date.now() + (3600 * 1000 * 24 * 180 * 1)),
                                        sameSite: 'none',
                                        secure: "true",
                                        httpOnly: true,
                                    })
                                    res.status(200).json({
                                        message: 'Login successful',
                                        data: userData,
                                        code: 200
                                    });
                                } else {
                                    return res.status(401).json({
                                        message: 'Incorrect email or password',
                                        code: 401
                                    });
                                }
                            });
                        } else {
                            return res.status(401).json({message: 'Incorrect email or password', code: 401});
                        }
                    });
                }

            });

            return console.log('Connection closed')
        } catch (e) {
            res.status(400).json({message: 'Login error', code: 400})
        }
    }

    async registration(req: any, res: any) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Registration error", errors, code: 400})
            }
            const {firstName, lastName, email, password} = req.body;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const userExistsQuery = `SELECT * FROM Users WHERE email = '${email}'`;
            const userRegisterQuery = `INSERT INTO Users (firstName, lastName, email, password) VALUES ('${firstName}', '${lastName}', '${email}', '${hashedPassword}')`;
            connection.query(userExistsQuery, (error: any, results: any) => {
                if (error) throw error;
                if (results.length === 1) {
                    return res.status(409).json({message: 'User already exists', code: 409});
                } else (
                    connection.query(userRegisterQuery, (error: any, results: any) => {
                        if (error) throw error;
                        res.status(201).json({message: 'User registered successfully', code: 201});
                    })
                )
            });
            return console.log('Connection closed')
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Registration error', code: 400})
        }
    }
}

module.exports = new authSocialController()