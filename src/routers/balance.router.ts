
import { Request, Response, Router } from 'express';
import { BalanceRepository } from '../repositories/balance.repository';

// Middleware
import { CheckCreditExist, CheckUserIdProvided, CheckUserIdValid } from '../middleware/validation';

const router = Router();
const balanceRepo = new BalanceRepository();

// Add amount to user's balance in the credit with the symbol
router.post('/mint', CheckUserIdValid, async (req: Request, res: Response) => {
    try {
        const { symbol, to, amount } = req.body;

        // Check if symbol to and amount are provided
        if (!symbol || !to || !amount) {
            return res.status(400).json({ success: false, error: 'Symbol, to, and amount are required.' });
        }

        const updatedBalance = await balanceRepo.mint(symbol, to, amount);
        res.status(200).json({ success: true, updatedBalance });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Reduce amount to user's balance in the credit with the symbol
router.post('/burn', CheckUserIdValid, async (req: Request, res: Response) => {
    try {
        const { symbol, to, amount } = req.body;

        // Check if symbol to and amount are provided
        if (!symbol || !to || !amount) {
            return res.status(400).json({ success: false, error: 'Symbol, to, and amount are required.' });
        }

        const updatedBalance = await balanceRepo.burn(symbol, to, amount);
        res.status(200).json({ success: true, updatedBalance });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get user's balance in specific credit with symbol
router.get('/of/:symbol/:userId', async (req: Request, res: Response) => {
    try {
        const { symbol, userId } = req.params;

        // Check if symbol and userId are provided
        if (!symbol || !userId) {
            return res.status(400).json({ success: false, error: 'Symbol, and userId are required.' });
        }

        const balance = await balanceRepo.balanceOf(symbol, Number(userId));
        res.status(200).json({ success: true, balance });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get total amount of all user's balances in specific credit by symbol
router.get('/total/:symbol', async (req: Request, res: Response) => {
    try {
        const { symbol } = req.params;

        // Check if symbol is provided
        if (!symbol) {
            return res.status(400).json({ success: false, error: 'Symbol is required.' });
        }

        const totalSupply = await balanceRepo.totalSupply(symbol);
        res.status(200).json({ success: true, totalSupply });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Transfer amount from sender to other user in specific credit by symbol
router.post('/transfer', CheckCreditExist, async (req: Request, res: Response) => {
    const fromUserId = req.headers["userid"];
    const { symbol, to, amount } = req.body;

    // Check if symbol to and amount are provided
    if (!symbol || !to || !amount) {
        return res.status(400).json({ success: false, error: 'Symbol, to, and amount are required.' });
    }

    try {
        await balanceRepo.transfer(symbol, Number(fromUserId), to, amount);
        res.status(200).json({ success: true, message: 'Transfer successful' });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Transfer with approval
router.post('/transferFrom', CheckUserIdProvided, async (req: Request, res: Response) => {
    try {
        const userId = req.headers["userid"];
        const { symbol, from, to, amount } = req.body;

        // Check if inputs are provided
        if (!symbol || !from || !to || !amount) {
            return res.status(400).json({ success: false, error: 'Symbol, from, to, and amount are required.' });
        }

        await balanceRepo.transferFrom(Number(userId), symbol, from, to, amount);
        res.status(200).json({ success: true, message: 'Transfer successful' });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;


