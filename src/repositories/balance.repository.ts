import { Balance } from "../entities/balance.entity";
import connectDB from "../ormconfig";
import { ApprovalRepository } from "./approval.repository";
import { CreditRepository } from "./credit.repository";

export class BalanceRepository {
    private repository;
    private creditRepository: CreditRepository;
    private approvalRepository: ApprovalRepository;

    constructor() {
        this.repository = connectDB.getRepository(Balance);
        this.creditRepository = new CreditRepository();
        this.approvalRepository = new ApprovalRepository();
    }

    // Add amount to user's balance
    async mint(symbol: string, to: number, amount: number): Promise<Balance> {

        // Check if the credit with the symbol exists
        const credit = await this.creditRepository.findBySymbol(symbol);
        if (!credit) {
            throw new Error('Credit with this symbol does not exist!');
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
    async burn(symbol: string, to: number, amount: number): Promise<Balance> {

        // Check if the credit symbol exists
        const credit = await this.creditRepository.findBySymbol(symbol);
        if (!credit) {
            throw new Error('Credit with this symbol does not exist!');
        }

        // Check if the balance for the given user and symbol exists
        const userBalance = await this.repository.findOne({ where: { credit: { symbol: symbol }, userId: to } });

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

        // Retrieve the balance for the given user and symbol
        const userBalance = await this.repository.findOne({ where: { credit: { symbol: symbol }, userId: userId } });

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

        // Check if the sender has sufficient funds
        const senderBalance = await this.repository.findOne({ where: { credit: { symbol: symbol }, userId: fromUserId } });

        if (!senderBalance || senderBalance.amount < amount) {
            throw new Error('Insufficient funds for transfer.');
        }

        // Subtract the amount from the sender
        await this.burn(symbol, fromUserId, amount);

        // Add the amount to the recipient's balance
        await this.mint(symbol, toUserId, amount);
    }

    // Transfer with approval
    async transferFrom(userId: number, symbol: string, from: number, to: number, amount: number): Promise<void> {

        // Validate that an approval exists and is sufficient
        const approval = await this.approvalRepository.findApproval(symbol, from, userId);
        if (!approval || approval.amount < amount) {
            throw new Error('Not enough approved credits for transfer.');
        }

        // Find the credit based on symbol
        const credit = await this.creditRepository.findBySymbol(symbol);
        if (!credit) {
            throw new Error('Credit with this symbol does not exist!');
        }

        // Deduct amount from the 'from' user's balance
        this.burn(symbol, from, amount);

        // Add the amount to the 'to' user's balance
        this.mint(symbol, to, amount)

        // Update the approved amount
        approval.amount -= amount;
        if (approval.amount === 0) {
            await this.approvalRepository.removeApproval(approval);
        } else {
            // console.log(credit)
            await this.approvalRepository.saveOrUpdateApproval(credit, approval.owner, approval.spender, approval.amount);
        }
    }
}
