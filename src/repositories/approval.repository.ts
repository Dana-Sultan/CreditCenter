import { Approval } from "../entities/approval.entity";
import { Credit } from "../entities/credit.entity";
import connectDB from "../ormconfig";

export class ApprovalRepository {
    private repository;

    constructor() {
        this.repository = connectDB.getRepository(Approval);
    }

    // Find approval by credit stmbol owner and spender
    async findApproval(symbpl: string, ownerId: number, spenderId: number): Promise<Approval | null> {
        return this.repository.findOne({
            where: {
                credit: { symbol: symbpl },
                owner: ownerId,
                spender: spenderId
            }
        })
    }

    // Remove approval
    async removeApproval(approval: Approval): Promise<Approval | null> {
        return this.repository.remove(approval)
    }

    // Update approval or create new one
    async saveOrUpdateApproval(credit: Credit, ownerId: number, spenderId: number, amount: number): Promise<Approval> {

        // Check if an approval already exists for the given credit, owner, and spender
        const existingApproval = await this.repository.findOne({
            where: {
                credit: { symbol: credit.symbol },
                owner: ownerId,
                spender: spenderId
            }
        });

        if (existingApproval) {
            // If an approval exists, update the amount and save
            existingApproval.amount = amount;
            return await this.repository.save(existingApproval);
        } else {
            // If no approval exists, create a new one
            const newApproval = new Approval();
            newApproval.credit = credit;
            newApproval.owner = ownerId;
            newApproval.spender = spenderId;
            newApproval.amount = amount;
            console.log(newApproval.credit)
            return await this.repository.save(newApproval);
        }
    }

    // Find allowance
    async findAllowance(symbol: string, ownerId: number, spenderId: number): Promise<number> {

        // Find the approval for the given credit, owner, and spender
        const approval = await this.repository.findOne({
            where: {
                credit: { symbol: symbol },
                owner: ownerId,
                spender: spenderId
            }
        });

        // If an approval is found, return the approved amount; otherwise, return 0.
        return approval ? approval.amount : 0;
    }
}
