import { Balance } from "../entities/balance.entity";
import connectDB from "../ormconfig";
import { CreditRepository } from "./credit.repository";

export class BalanceRepository {
    private repository;
    private creditRepository: CreditRepository;

    constructor() {
        this.repository = connectDB.getRepository(Balance);
        this.creditRepository = new CreditRepository();
    }

    // Add amount to user's balance
    async mint(userId: string, symbol: string, to: number, amount: number): Promise<Balance> {

        // Check if the credit symbol exists
        const credit = await this.creditRepository.findBySymbol(symbol);
        if (!credit) {
            throw new Error('Credit with this symbol does not exist!');
        }

        // Check if the user trying to mint is the owner of the credit
        if (credit.owner !== userId) {
            throw new Error('You are not the owner of this credit');
        }

        // Check if the balance for the given user and symbol exists
        const userBalance = await this.repository.findOne({ where: { credit: { symbol: symbol }, userId: to } });

        if (userBalance) {
            // If balance record exists, increase the balance
            userBalance.amount += amount;
        } else {
            // If no balance record exists, create a new one
            const newBalance = new Balance();
            newBalance.userId = to;
            newBalance.credit = credit;
            newBalance.amount = amount;

            await this.repository.save(newBalance);
            return newBalance;
        }

        // Save the updated or new balance
        return await this.repository.save(userBalance);
    }

    // Reduce amount to user's balance
    async burn(userId: string, symbol: string, to: number, amount: number): Promise<Balance> {

        // Check if the credit symbol exists
        const credit = await this.creditRepository.findBySymbol(symbol);
        if (!credit) {
            throw new Error('Credit with this symbol does not exist!');
        }

        // Check if the user trying to burn is the owner of the credit
        if (credit.owner !== userId) {
            throw new Error('You are not the owner of this credit');
        }

        // Check if the balance for the given user and symbol exists
        const userBalance = await this.repository.findOne({
            where: {
                credit: { symbol: symbol },
                userId: to
            },
            relations: ["credit"]
        });

        // Check if user have balance for this credit
        if (!userBalance) {
            throw new Error('User does not have a balance for this credit!');
        }

        // Check if user have enough balance to burn
        if (userBalance.amount < amount) {
            throw new Error('User does not have enough balance to burn the specified amount!');
        }

        // Decrease the balance
        userBalance.amount -= amount;

        // Save the updated balance
        return await this.repository.save(userBalance);
    }

    // Get user's balance amount
    async balanceOf(symbol: string, userId: number): Promise<number> {

        // Check if the credit symbol exists
        const credit = await this.creditRepository.findBySymbol(symbol);
        if (!credit) {
            throw new Error('Credit with this symbol does not exist!');
        }

        // Retrieve the balance for the given user and symbol
        const userBalance = await this.repository.findOne({
            where: {
                credit: { symbol: symbol },
                userId: userId
            },
            relations: ["credit"]
        });

        // If the user has no balance record for this symbol, return 0
        if (!userBalance) {
            return 0;
        }

        // Return the actual balance
        return userBalance.amount;
    }

    // Get total supply of credit
    async totalSupply(symbol: string): Promise<number> {

        // Get balances by credit symbol
        const balances = await this.repository.find({ where: { credit: { symbol: symbol } } });

        // Sum total amount
        return balances.reduce((sum, balance) => sum + balance.amount, 0);
    }

    // Transfer amount from one user to another
    async transfer(symbol: string, fromUserId: number, toUserId: number, amount: number): Promise<void> {

        // Check if the credit symbol exists
        const credit = await this.creditRepository.findBySymbol(symbol);
        if (!credit) {
            throw new Error('Credit with this symbol does not exist!');
        }

        // Check if the sender has sufficient funds
        const senderBalance = await this.repository.findOne({ where: { credit: { symbol: symbol }, userId: fromUserId } });

        if (!senderBalance || senderBalance.amount < amount) {
            throw new Error('Insufficient funds for transfer.');
        }

        // Subtract the amount from the sender
        senderBalance.amount -= amount;
        if (senderBalance.amount === 0) {
            await this.repository.remove(senderBalance);
        } else {
            await this.repository.save(senderBalance);
        }

        // Add the amount to the recipient's balance
        const recipientBalance = await this.repository.findOne({ where: { credit: { symbol: symbol }, userId: toUserId } });

        if (recipientBalance) {
            recipientBalance.amount += amount;
            await this.repository.save(recipientBalance);
        } else {
            // If the recipient doesn't have an existing balance for this credit, create one
            const newBalance = new Balance();
            newBalance.userId = toUserId;
            newBalance.credit = credit;
            newBalance.amount = amount;

            await this.repository.save(newBalance);
        }
    }
}
