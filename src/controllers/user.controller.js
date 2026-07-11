const User = require('../models/User');

// True when the requester is acting on their own record or is an Admin.
function canManage(req) {
    const isSelf = req.user && String(req.user.id) === String(req.params.id);
    const isAdmin = req.user && Array.isArray(req.user.roles) && req.user.roles.includes('Admin');
    return { isSelf, isAdmin, allowed: isSelf || isAdmin };
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        // Only the owner or an Admin may read a full user record (contains email).
        if (!canManage(req).allowed) {
            return res.status(403).json({ message: 'Insufficient permissions' });
        }
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { isAdmin, allowed } = canManage(req);
        if (!allowed) {
            return res.status(403).json({ message: 'Insufficient permissions' });
        }

        // Never allow privilege fields to be set through a self-service update.
        // `roles` may only be changed by an Admin; `password` goes through auth.
        const { password, roles, _id, ...updateData } = req.body;
        if (roles !== undefined && isAdmin) {
            updateData.roles = roles;
        }

        const user = await User.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
