import { Request, Response, Router } from 'express';
import { CreditRepository } from '../repositories/credit.repository';
import { CheckUserIdProvided } from '../middleware/validation';

const router = Router();
const creditRepo = new CreditRepository();

// Deploy new credit with owner as the sender
router.post('/deploy', CheckUserIdProvided, async (req: Request, res: Response) => {
    const userId = req.headers["userid"];
    const { symbol } = req.body;

    // Check that symbol is provided
    if (!symbol) {
        return res.status(400).json({ success: false, error: 'Symbol is required' });
    }

    try {
        const credit = await creditRepo.deployCredit(symbol, Number(userId));
        res.status(200).json({ success: true, credit });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
