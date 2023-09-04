
import { DataSource } from "typeorm";

// Using environment variables
import dotenv from "dotenv";

// Entities
import { Credit } from "./entities/credit.entity";
import { Balance } from "./entities/balance.entity";
import { Approval } from "./entities/approval.entity";
dotenv.config();

const connectDB = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URI,
    logging: true,
    synchronize: true,
    entities: [Credit, Balance, Approval],
})

export default connectDB;