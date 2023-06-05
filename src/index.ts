import express, {Express, Request, Response} from 'express';
import bodyParser from 'body-parser';

const app: Express = express();
const port = process.env.PORT ?? 8000;

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
