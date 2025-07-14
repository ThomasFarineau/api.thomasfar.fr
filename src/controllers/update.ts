import {RequestHandler, Response, Router} from 'express';
import * as updateService from '../services/update';

const router = Router();

// @ts-ignore
const updateHandler: RequestHandler = async (req, res: Response<{ upToDate?: boolean; message?: string } | {
    error: string
}>, next) => {
    const token = (req.query.token || req.header('x-update-token')) as string;
    if (!updateService.validateToken(token)) {
        return res.status(403).json({error: 'Forbidden'});
    }

    try {
        if (await updateService.isUpToDate()) {
            return res.json({upToDate: true});
        }

        await updateService.updateCode();

        res.json({message: 'Restarting'});

        updateService.restartApp().catch(err => {
            console.error('PM2 restart failed:', err);
        });
    } catch (error) {
        next(error);
    }
};

router.post('/', updateHandler);

export default router;
