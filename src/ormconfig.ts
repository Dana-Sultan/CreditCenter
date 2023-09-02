
import { DataSource } from "typeorm";

// Using environment variables
import dotenv from "dotenv";
import { Credit } from "./entities/credit.entity";
import { Balance } from "./entities/balance.entity";
dotenv.config();

const connectDB = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URI,
    logging: true,
    synchronize: true,
    entities: [Credit, Balance],
})

export default connectDB;