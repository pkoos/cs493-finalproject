import * as jwt from 'jsonwebtoken';

export function generateAuthToken(user_id: number): string {
    const payload = { sub: user_id };

    return jwt.sign(payload, process.env.SECRET_KEY ?? '', { expiresIn: '24h'});
}