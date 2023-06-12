import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import * as rh from './responses-helper';

export function generateAuthToken(user_id: number): string {
    const payload = { sub: user_id };

    return jwt.sign(payload, process.env.SECRET_KEY ?? '', { expiresIn: '24h'});
}

export function requireAuthentication(req: Request, res: Response, next: NextFunction) {
    const auth_header: string = req.get("Authorization") as string;
    if(!auth_header) {
        rh.errorInvalidToken(res);
        return;
    }
    const auth_header_parts: string[] = auth_header.split(" ");
    const token: string = auth_header_parts[0] === "Bearer" ? auth_header_parts[1] : "";
    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY ?? '');
        req.loggedInID = parseInt(payload.sub as string);
    }
    catch {
        rh.errorInvalidToken(res);
        return;
    }
    next();
}