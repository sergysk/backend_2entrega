import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.render('prueba', {title: 'Prueba', message: 'Hola mundo'});
})

export default router;