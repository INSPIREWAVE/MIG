"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = listUsers;
exports.updateUserRole = updateUserRole;
exports.toggleUserStatus = toggleUserStatus;
exports.deleteUser = deleteUser;
const adapter_1 = require("../db/adapter");
async function listUsers(_req, res, next) {
    try {
        const users = await adapter_1.db.getAllUsers();
        res.json({ success: true, data: users });
    }
    catch (err) {
        next(err);
    }
}
async function updateUserRole(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const { role, permissions } = req.body;
        const result = await adapter_1.db.updateUserRole(id, role, permissions || '');
        adapter_1.db.logAudit('UPDATE_USER_ROLE', 'user', id, null, JSON.stringify({ role, permissions }));
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function toggleUserStatus(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        const { isActive } = req.body;
        const result = await adapter_1.db.toggleUserStatus(id, isActive);
        adapter_1.db.logAudit('TOGGLE_USER_STATUS', 'user', id, null, JSON.stringify({ isActive }));
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
async function deleteUser(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);
        if (req.user && req.user.id === id) {
            res.status(400).json({ success: false, error: 'Cannot delete your own account' });
            return;
        }
        const result = await adapter_1.db.deleteUser(id);
        adapter_1.db.logAudit('DELETE_USER', 'user', id, null, null);
        res.json({ success: true, data: result });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=users.controller.js.map