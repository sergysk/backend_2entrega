import { Router } from 'express';
import Config from '../core/config.js';

const router = Router();

router.get('/', (req, res) => {
    res.render('realTimeProducts', {
        title: 'Real Time Products'
    });
});


export default router;