"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({ message: 'The user is not authorized' });
    }
    if (err.name === 'ValidationError') {
        //  validation error
        return res.status(401).json({ message: err });
    }
    // default to 500 server error
    return res.status(500).json(err);
};
exports.errorHandler = errorHandler;
