import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './ormconfig';

dotenv.config();

const app: Express = express();
const port = process.env.API_PORT;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Hello world');
});

connectDB
    .initialize()
    .then(() => {
        console.log(`Data Source has been initialized`);
        app.listen(port, () => {
            console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error(`Data Source initialization error`, err);
    })