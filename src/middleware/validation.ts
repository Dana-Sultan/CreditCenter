import { Request, Response, NextFunction } from 'express';
import { CreditRepository } from '../repositories/credit.repository';

export const CheckUserIdProvided = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers["userid"];

    // Check that userid is provided
    if (!userId) {
        return res.status(400).json({ success: false, error: "userid header missing" });
    }

    next();
}

export const CheckUserIdValid = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers["userid"];
    const { symbol } = req.body;

    // Check that userid is provided
    if (!userId) {
        return res.status(400).json({ success: false, error: "userid header missing" });
    }

    // Check that symbol is provided
    if (!symbol) {
        return res.status(400).json({ success: false, error: 'Symbol not provided' });
    }

    // Check that userid is equal to the credit's owner
    const creditRepo = new CreditRepository();
    const credit = await creditRepo.findBySymbol(symbol);

    if (credit && credit.owner !== Number(userId)) {
        return res.status(403).json({ success: false, error: "User is not the owner of this credit." });
    }

    next();
};

export const CheckCreditExist = async (req: Request, res: Response, next: NextFunction) => {
    const { symbol } = req.body;

    // Check that symbol is provided
    if (!symbol) {
        return res.status(400).json({ success: false, error: 'Symbol not provided' });
    }

    // Check that credit with the symbol exist
    const creditRepo = new CreditRepository();
    const credit = await creditRepo.findBySymbol(symbol);

    if (!credit) {
        return res.status(404).json({ success: false, error: 'Credit with this symbol does not exist!' });
    }

    next();
}
