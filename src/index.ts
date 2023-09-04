import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

// DB connection
import connectDB from './ormconfig';

// Routers
import creditRouter from "./routers/credit.router"
import balanceRouter from "./routers/balance.router"
import approvalRouter from "./routers/approval.router"

dotenv.config();

const app: Express = express();
const port = process.env.API_PORT;

app.use(express.json());

// Use routers
app.use('/credits', creditRouter);
app.use('/balances', balanceRouter);
app.use('/approvals', approvalRouter);

// Create connection with DB
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