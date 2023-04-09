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
const index_1 = require("./index");
class usersController {
    fetchUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getUsersQuery = "SELECT * FROM Users";
                index_1.connection.query(getUsersQuery, (error, results) => {
                    if (error) {
                        return res.status(400).json({ message: 'Error getting users', statusCode: 400 });
                    }
                    else {
                        const users = results.map((u) => (Object.assign(Object.assign({}, u), { id: u.id, name: u.name, email: u.email, createdAt: u.created_at, loginData: u.last_online, status: u.status })));
                        return res.status(200).send({ message: 'Getting users successfully', data: users, statusCode: 200 });
                    }
                });
            }
            catch (e) {
                console.log(e);
                res.status(400).json({ message: 'Get users error', statusCode: 400 });
            }
        });
    }
    changeStatusUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { ids, status } = req.body;
                for (const id of ids) {
                    yield new Promise(resolve => {
                        index_1.connection.query(`UPDATE Users SET status='${status}' WHERE id=${id}`, (error, results) => {
                            if (error) {
                                return res.status(500).send({ message: 'Error updating blocked status', statusCode: 500 });
                            }
                            else {
                                resolve(id);
                            }
                        });
                    });
                    yield new Promise(resolve => setTimeout(resolve, 50));
                }
                res.status(200).json({ message: `Users ${status}`, data: { ids, status }, statusCode: 201 });
            }
            catch (e) {
                res.status(400).json({ message: 'Update data error', statusCode: 400 });
            }
        });
    }
    deleteUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { ids } = req.body;
                for (const id of ids) {
                    yield new Promise(resolve => {
                        index_1.connection.query(`DELETE FROM Users WHERE id=${id}`, (error, results) => {
                            if (error) {
                                return res.status(500).send({ message: 'Error deleting users', statusCode: 500 });
                            }
                            else {
                                resolve(id);
                            }
                        });
                    });
                    yield new Promise(resolve => setTimeout(resolve, 50));
                }
                res.status(200).json({ message: `Users deleting`, data: { ids }, statusCode: 201 });
            }
            catch (e) {
                res.status(400).json({ message: 'Update data error', statusCode: 400 });
            }
        });
    }
}
module.exports = new usersController();
