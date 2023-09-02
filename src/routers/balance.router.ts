
import { Router } from 'express';
import { BalanceRepository } from '../repositories/balance.repository';

const router = Router();
const balanceRepo = new BalanceRepository();

// Add amount to user's balance in the credit with the symbol
router.post('/mint', async (req: any, res) => {
    try {
        const userId = req.userId;
        const { symbol, to, amount } = req.body;

        // Check if symbol to and amount exist
        if (!symbol || !to || !amount) {
            return res.status(400).json({ error: 'Symbol, to, and amount are required.' });
        }

        const updatedBalance = await balanceRepo.mint(userId, symbol, to, amount);
        res.json(updatedBalance);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Reduce amount to user's balance in the credit with the symbol
router.post('/burn', async (req: any, res) => {
    try {
        const userId = req.userId;
        const { symbol, to, amount } = req.body;

        // Check if symbol to and amount exist
        if (!symbol || !to || !amount) {
            return res.status(400).json({ error: 'Symbol, to, and amount are required.' });
        }

        const updatedBalance = await balanceRepo.burn(userId, symbol, to, amount);
        res.json(updatedBalance);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user's balance in specific credit with symbol
router.get('/of/:symbol/:userId', async (req, res) => {
    try {
        const { symbol, userId } = req.params;
        const balance = await balanceRepo.balanceOf(symbol, Number(userId));
        res.json({ balance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get total amount of all user's balances in specific credit by symbol
router.get('/total/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const totalSupply = await balanceRepo.totalSupply(symbol);
        res.json({ totalSupply });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Transfer amount from sender to other user in specific credit by symbol
router.post('/transfer', async (req: any, res) => {
    const { symbol, to, amount } = req.body;
    const fromUserId = req.userId;

    // Check if symbol to and amount exist
    if (!symbol || !to || !amount) {
        return res.status(400).json({ error: 'Invalid parameters' });
    }

    try {
        await balanceRepo.transfer(symbol, fromUserId, to, amount);
        res.status(200).json({ message: 'Transfer successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Transfer failed' });
    }
});

export default router;


