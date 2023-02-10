import {expressjwt} from 'express-jwt';
import { Request } from 'express';

export const authJwt = () => {
    const api = process.env.API_URL || 'http://localhost:3000/api/v1';
    return expressjwt({
        secret: process.env.SECRET_KEY || (() => 'secret'),
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            {url: /\/api\/v1\/products(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/categories(.*)/ , methods: ['GET', 'OPTIONS'] },
            `${api}/users/login`,
            `${api}/users/register`,
        ]
    });

    async function isRevoked(req: Request,  token: any): Promise<boolean> {
        if(!token.payload.isVendor) {
            return true
        }
         return false;
    }
    
};

