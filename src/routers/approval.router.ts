import { Router } from 'express';
import { ApprovalRepository } from '../repositories/approval.repository';
import { CreditRepository } from '../repositories/credit.repository';
import { CheckCreditExist, CheckUserIdProvided } from '../middleware/validation';

const router = Router();
const approvalRepo = new ApprovalRepository();
const creditRepo = new CreditRepository();

// Create a new approval or update existing one
router.post('/', CheckUserIdProvided, async (req, res) => {
    try {
        const ownerId = req.headers["userid"];
        const { symbol, to: spenderId, amount } = req.body;

        // Check if symbol to and amount exist
        if (!symbol || !spenderId || !amount) {
            return res.status(400).json({ success: false, error: 'Symbol, spenderId, and amount are required.' });
        }

        // Check if the credit exists
        const credit = await creditRepo.findBySymbol(symbol);
        if (!credit) {
            return res.status(404).json({ success: false, error: 'Credit with this symbol does not exist!' });
        }

        // Save or update the approval
        const approval = await approvalRepo.saveOrUpdateApproval(credit, Number(ownerId), spenderId, amount);
        res.status(200).json({ success: true, approval });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get allowance by symbol owner and spender
router.get('/allowance/:symbol/:ownerId/:spenderId', async (req, res) => {
    try {
        const { symbol, ownerId, spenderId } = req.params;

        // Check if symbol to and amount exist
        if (!symbol || !ownerId || !spenderId) {
            return res.status(400).json({ success: false, error: "Symbol, ownerId, and spenderId are required." });
        }

        const allowanceAmount = await approvalRepo.findAllowance(symbol, Number(ownerId), Number(spenderId));
        res.status(200).json({ success: true, allowance: allowanceAmount });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});



export default router;
