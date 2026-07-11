const { body } = require('express-validator');

// Ensuring these fields are strings prevents NoSQL-injection payloads
// like { "email": { "$gt": "" } } from reaching Mongoose queries.
const signupValidator = [
    body('username').isString().trim().isLength({ min: 3, max: 32 }),
    body('email').isString().trim().isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 8, max: 128 }),
    body('role').isString().isIn(['User', 'Organization']),
];

const loginValidator = [
    body('email').isString().trim().notEmpty(),
    body('password').isString().notEmpty(),
];

module.exports = { signupValidator, loginValidator };
