export const auth = (req: any, res: any, next: any) => {
    const userId = req.headers["userid"];

    if (!userId) {
        return res.status(400).json({ error: "USERID header missing" });
    }

    req.userId = userId;
    next();
};