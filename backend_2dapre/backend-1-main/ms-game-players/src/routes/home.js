import { Router } from 'express';
import Config from '../core/config.js';
import Products from '../services/products.js';
import logger from '../core/logger.js';



const router = Router();
const products = new Products();

router.get('/', async (req, res) => {
    const limit = Config.LIMIT_LIST_PRODUCTS;
    try {
        const data = await products.getProducts(limit);
        res.render('home', {
            title: 'Welcome to Home',
            style: 'style.css',
            list_products: data,
        });
    } catch(error) {
        res.status(500).json({error: error.message});
        logger.error(`Error: ${error.message}`);
    }
});


export default router;