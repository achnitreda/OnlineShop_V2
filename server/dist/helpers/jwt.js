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
exports.authJwt = void 0;
const express_jwt_1 = require("express-jwt");
const authJwt = () => {
    const api = process.env.API_URL || 'http://localhost:3000/api/v1';
    return (0, express_jwt_1.expressjwt)({
        secret: process.env.SECRET_KEY || (() => 'secret'),
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            // regex101.com to test regex
            { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
            { url: /\/api\/v1\/orders(.*)/, methods: ['GET', 'OPTIONS', 'POST'] },
            `${api}/users/login`,
            `${api}/users/register`,
        ]
    });
    function isRevoked(req, token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!token.payload.isAdmin) {
                return true;
            }
            return false;
        });
    }
};
exports.authJwt = authJwt;
