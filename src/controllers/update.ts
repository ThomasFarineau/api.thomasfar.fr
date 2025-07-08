import { Router, Request, Response, NextFunction, RequestHandler } from 'express';
import * as updateService from '../services/update';

const router = Router();

// @ts-ignore
const updateHandler: RequestHandler = async (
    req: Request<{ params: any }, any, any, { token: string }>,
    res: Response<{ upToDate?: boolean; updated?: boolean } | { error: string }>,
    next: NextFunction
) => {
    const token = req.query.token || req.header('x-update-token');
    if (!updateService.validateToken(token)) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    try {
        if (await updateService.isUpToDate()) {
            return res.json({ upToDate: true });
        }

        await updateService.updateCode();
        await updateService.restartApp();

        return res.json({ updated: true });
    } catch (error) {
        next(error);
    }
};

router.post('/', updateHandler);

export default router;