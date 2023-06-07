import express, {Express, Request, Response} from 'express';
import bodyParser from 'body-parser';
import mysql2, { Pool } from 'mysql2/promise';

const app: Express = express();
const port = process.env.PORT ?? 8000;

export const db: Pool =  mysql2.createPool({
    connectionLimit: 10,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    host: process.env.MYSQL_HOST ?? "localhost",
    port: 3306
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/test', (req: Request, res: Response) => {
    console.log("test complete");
    res.status(200).json({"status": "Success!"});
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}.`);
});
