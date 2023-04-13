"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check_1 = require("express-validator/check");
const notEmpty = (value) => {
    if (!value || value.length === 0) {
        throw new Error("This field cannot be empty");
    }
    return true;
};
const userSignupValidator = (req, res, next) => {
    (0, check_1.check)("name", "Name is required").custom(notEmpty);
    (0, check_1.check)("email", "Email must be between 3 to 32 characters")
        .matches(/.+\@.+\..+/)
        .withMessage("Email must contain @")
        .isLength({
        min: 4,
        max: 32,
    });
    (0, check_1.check)("password", "Password is required").custom(notEmpty);
    (0, check_1.check)("password")
        .isLength({ min: 6 })
        .withMessage("Password must contain at least 6 characters")
        .matches(/\d/)
        .withMessage("Password must contain a number");
    const errors = (0, check_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.default = userSignupValidator;
