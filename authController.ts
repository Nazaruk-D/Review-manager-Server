import {connection} from "./index";
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {validationResult} = require('express-validator')


class authController {
    async auth(req: any, res: any) {
        try {
            const token = req.cookies.token;
            if (!token) {
                return res.status(401).json({message: 'Unauthorized in token', token, statusCode: 401});
            }
            const decodedToken = jwt.verify(token, 'secret');
            const email = decodedToken.email;
            const userExistsQuery = `SELECT * FROM Users WHERE email = '${email}'`;
            connection.query(userExistsQuery, (error: any, results: any) => {
                if (error) throw error;
                if (results[0].status === "blocked") {
                    return res.status(401).json({message: 'User blocked', statusCode: 401});
                }
                if (results.length === 1) {
                    const user = results[0];
                    const userData = {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        status: user.status,
                        createdAt: user.created_at,
                        updatedAt: user.last_online
                    };
                    return res.status(200).json({data: userData, statusCode: 200});
                } else {
                    return res.status(401).json({message: 'Unauthorized in user', statusCode: 401});
                }
            });
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Me error', statusCode: 400})
        }
    }

    async registration(req: any, res: any) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Registration error", errors, statusCode: 400})
            }
            const {name, email, password} = req.body;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const userExistsQuery = `SELECT * FROM Users WHERE email = '${email}'`;
            const userRegisterQuery = `INSERT INTO Users (email, name, password_hash) VALUES ('${email}', '${name}', '${hashedPassword}')`;
            connection.query(userExistsQuery, (error: any, results: any) => {
                if (error) throw error;
                if (results.length === 1) {
                    return res.status(409).json({message: 'User already exists', statusCode: 409});
                } else (
                    connection.query(userRegisterQuery, (error: any, results: any) => {
                        if (error) throw error;
                        res.status(201).json({message: 'User registered successfully', statusCode: 201});
                    })
                )
            });
            return console.log('Connection closed')
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Registration error', statusCode: 400})
        }
    }

    async login(req: any, res: any) {
        try {
            const {email, password} = req.body;
            const updateLoginDate = `UPDATE Users SET last_online=CURRENT_TIMESTAMP WHERE email='${email}'`;
            connection.query(updateLoginDate, (error: any, results: any) => {
                if(error) {
                    results.status(400).json({message: 'Login error', statusCode: 400})
                } else {
                    const query = `SELECT * FROM Users WHERE email = '${email}'`;
                    connection.query(query, (error: any, results: any) => {
                        const token = jwt.sign({email}, 'secret');
                        if (error) throw error;
                        if (results.length === 1) {
                            if (results[0].status === "blocked") {
                                return res.status(401).json({message: 'User blocked', statusCode: 401});
                            }
                            const user = results[0];
                            const userData = {
                                id: user.id,
                                email: user.email,
                                name: user.name,
                                status: user.status,
                                createdAt: user.created_at,
                                updatedAt: user.last_online
                            };
                            bcrypt.compare(password, user.password_hash, (error: any, match: any) => {
                                if (error) throw error;
                                if (match) {
                                    res.cookie('token', token, {
                                        expires: new Date(Date.now() + (3600 * 1000 * 24 * 180 * 1)),
                                        sameSite: 'none',
                                        secure: "true",
                                        httpOnly: true,
                                    })
                                    res.status(200).json({message: 'Login successful', user: userData, statusCode: 200});
                                } else {
                                    return res.status(401).json({message: 'Incorrect email or password', statusCode: 401});
                                }
                            });
                        } else {
                            return res.status(401).json({message: 'Incorrect email or password', statusCode: 401});
                        }
                    });
                }

            });

            return console.log('Connection closed')
        } catch (e) {
            res.status(400).json({message: 'Login error', statusCode: 400})
        }
    }

    async logout(req: any, res: any) {
        try {
            res.cookie('token', "", {
                expires: new Date(0),
                sameSite: 'none',
                secure: "true",
                httpOnly: true,
            })
            res.status(200).json({message: 'Logout successful', statusCode: 200});
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Logout error', statusCode: 400})
        }
    }
}

module.exports = new authController()