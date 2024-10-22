import { Router } from 'express';
import Config from '../core/config.js';
import Carts from '../services/carts.js';


const router = Router();
const carts = new Carts();


/**
 * @swagger
 * /api/carts:
 *  get:
 *    summary: List all carts
 *    tags: [Carts]
 *    description: Cart management
 *    parameters:
 *    - in: query
 *      name: limit
 *      required: false
 *      schema:
 *        type: number
 *      description: The limit of carts (Optional)
 *    responses:
 *      200:
 *        description: The list of carts
 *        content:
 *          application/json:
 *            example:
 *              data: [{_id: '123', products: [{_id: '123', quantity: 1}]}]
 *      500:
 *        description: Error
 *        content:
 *          application/json:
 *            example:
 *              error: [{error: 'Error'}]
 */
router.get('/', async (req, res) => {
    const limit = req.query.limit || Config.LIMIT_LIST_CARTS;
    try {
        const data = await carts.getCarts(limit);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send({error: error.message});
    }
});


/**
 * @swagger
 * /api/carts/{cid}:
 *  get:
 *   summary: List products by cart id
 *   tags: [Carts]
 *   description: List products by cart id
 *   parameters:
 *   - in: path
 *     name: cid
 *     required: true
 *     description: The cart id
 *     schema:
 *       type: string
 *   responses:
 *     200:
 *       description: The cart
 *       content:
 *         application/json:
 *           example:
 *             data: [{_id: '123', products: [{_id: '123', quantity: 1}]}]
 *     404:
 *       description: Cart not found
 *       content:
 *         application/json:
 *           example:
 *             error: [{error: 'Cart not found'}]
 */
router.get('/:cid', async (req, res) => {
    try {
        const cart = await carts.getCartById(req.params.cid);
        ! cart ? res.status(404).send({error: 'Cart not found'}) : res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).send({error: error.message});
    }
});


/**
 * @swagger
 * /api/carts/:
 *  post:
 *   summary: Create a cart with empty products
 *   tags: [Carts]
 *   description: Create a cart with empty products
 *   responses:
 *     201:
 *       description: Cart created
 *       content:
 *         application/json:
 *           example:
 *             status: 'Cart created'
 *     400:
 *       description: Cart not created
 *       content:
 *         application/json:
 *           example:
 *             error: 'Cart not created'
 */
router.post('/', async (req, res) => {
    try {
        const cart = await carts.createCart();
        cart ? res.status(201).send({status: 'Cart created'}) : res.status(400).send({error: 'Cart not created'});
    } catch (error) {
        console.error(error);
        res.status(500).send({error: error.message});
    }
});


/**
 * @swagger
 * /api/carts/{cid}/product/{pid}:
 *  post:
 *   summary: Add a product to a cart
 *   tags: [Carts]
 *   description: Add a product to a cart
 *   parameters:
 *   - in: path
 *     name: cid
 *     required: true
 *     description: The cart id
 *     schema:
 *       type: string
 *   - in: path
 *     name: pid
 *     required: true
 *     description: The product id
 *     schema:
 *       type: string
 *   requestBody:
 *     required: true
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             quantity:
 *               type: number
 *   responses:
 *     201:
 *       description: Product added to cart
 *       content:
 *         application/json:
 *           example:
 *             status: 'Product added to cart'
 *     404:
 *       description: Cart not found
 *       content:
 *         application/json:
 *           example:
 *             error: 'Cart not found'
 */
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cart = await carts.addProductToCart(req.params.cid, req.params.pid, req.body.quantity);
        ! cart ? res.status(404).send({error: 'Cart not found'}) : res.status(201).send({status: 'Product added to cart'});
    } catch (error) {
        console.error(error);
        res.status(500).send({error: error.message});
    }
});

export default router;