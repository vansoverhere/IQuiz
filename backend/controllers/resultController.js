import Result from '../model/Result.js';
import { getAuth } from "@clerk/express";

//create result
export const CreatemyResult = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({
                error: "Unauthorized"
            });
        }
        console.log("REQ BODY:", req.body);
        const result = await Result.create({
            ...req.body,
            userId
        });
        res.json(result);
    }
    catch (error) {
        console.log("CREATE RESULT ERROR:", error);
        res.status(500).json({ error: "Failed" });
    }
}

//to get a result for that logged in user
export const getMyResult = async (req, res) => {
    const { userId } = getAuth(req);
    const results = await Result.find({ userId }).sort({ createdAt: -1 });

    res.json(results);
}