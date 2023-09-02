import { Router } from 'express';
import { CreditRepository } from '../repositories/credit.repository';

const router = Router();
const creditRepo = new CreditRepository();

// Deploy new credit with owner as the sender
router.post('/deploy', async (req: any, res: any) => {
    const userId = req.userId;
    const symbol = req.body.symbol;

    // Check that userid is provided
    if (!userId) {
        res.status(400).json({ error: 'USERID not provided' });
        return;
    }

    try {
        const credit = await creditRepo.deployCredit(symbol, userId);
        res.json({ success: true, credit });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
