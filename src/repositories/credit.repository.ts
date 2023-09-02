import { Balance } from "../entities/balance.entity";
import { Credit } from "../entities/credit.entity";
import connectDB from "../ormconfig";

export class CreditRepository {
    private repository;

    constructor() {
        this.repository = connectDB.getRepository(Credit);
    }

    // Return credit by symbol
    async findBySymbol(symbol: string): Promise<Credit | null> {
        return this.repository.findOne({ where: { symbol } });
    }

    // Create new credit and save to DB
    async deployCredit(symbol: string, owner: string): Promise<Credit> {
        // Check if the symbol already exists
        const existingCredit = await this.findBySymbol(symbol);
        if (existingCredit) {
            throw new Error('This symbol already exists!');
        }

        // Create new credit and save to DB
        const credit = new Credit();
        credit.symbol = symbol;
        credit.owner = owner;
        return await this.repository.save(credit);
    }
}
