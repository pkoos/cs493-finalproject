export {};

declare global {
    namespace Express {
        export interface Request {
            loggedInID?: number;
        }
    }
}
