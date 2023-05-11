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
const supabase_1 = require("../supabase/supabase");
class AdminController {
    fetchUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data: users, error: reviewError } = yield supabase_1.supabase
                    .from('users')
                    .select('*')
                    .order('created_at', { ascending: false });
                return res.status(200).send({ message: 'Getting users successfully', data: users, statusCode: 200 });
            }
            catch (e) {
                console.log(e);
                return res.status(500).send({ message: 'Internal server error' });
            }
        });
    }
    changeAdminStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, role } = req.body;
                const { error } = yield supabase_1.supabase
                    .from('users')
                    .update({ role })
                    .match({ id: userId });
                if (error) {
                    console.error(error);
                    return res.status(500).send({ message: 'Internal server error' });
                }
                return res.status(200).send({ message: 'User role changed', statusCode: 201 });
            }
            catch (e) {
                console.log(e);
                return res.status(500).send({ message: 'Internal server error' });
            }
        });
    }
    changeIsBlockedStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, status } = req.body;
                const { error } = yield supabase_1.supabase
                    .from('users')
                    .update({ is_blocked: status })
                    .match({ id: userId });
                if (error) {
                    console.error(error);
                    return res.status(500).send({ message: 'Internal server error' });
                }
                return res.status(200).send({ message: 'User status changed', statusCode: 201 });
            }
            catch (e) {
                console.log(e);
                return res.status(500).send({ message: 'Internal server error' });
            }
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const { error } = yield supabase_1.supabase
                    .rpc('delete_user_by_id', { id: userId });
                if (error) {
                    console.error(error);
                    return res.status(500).send({ message: error.message });
                }
                return res.status(200).send({ message: 'User deleted', statusCode: 201 });
            }
            catch (e) {
                console.log(e);
                return res.status(500).send({ message: 'Internal server error' });
            }
        });
    }
}
module.exports = new AdminController();
