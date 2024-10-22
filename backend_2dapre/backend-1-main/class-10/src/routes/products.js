import { Router } from 'express';
import Config from '../core/config.js';
import Products from '../services/products.js';

const router = Router();
const products = new Products();


/**
 * @swagger
 * /api/products:
 *  get:
 *   summary: Get all products
 *   tags: [Products]
 *   description: Get all products
 *   parameters:
 *   - in: query
 *     name: limit
 *     required: false
 *     schema:
 *       type: number
 *     description: The limit of products (Optional)
 *   responses:
 *     200:
 *       description: The list of products
 *       content:
 *         application/json:
 *           example:
 *             data: [{_id: '123', title: 'Product', description: 'Description', code: '123', price: 123, thumbnail: 'url', stock: 10, status: 'active', category: 'category'}]
 *     500:
 *       description: Error
 *       content:
 *         application/json:
 *           example:
 *             error: [{error: 'Error'}]
 */
router.get('/', async (req, res) => {
    const limit = parseInt(req.query.limit) || Config.LIMIT_LIST_PRODUCTS;

    try {
        const data = await products.getProducts(limit);
        res.json(data);
    }   catch (error) {
        res.status(500).json({error: error.message});
    }
});


/**
 * @swagger
 * /api/products/{pid}:
 *  get:
 *   summary: Get a product by id
 *   tags: [Products]
 *   description: Get a product by id
 *   parameters:
 *   - in: path
 *     name: pid
 *     required: true
 *     description: The product id
 *     schema:
 *       type: string
 *   responses:
 *     200:
 *       description: The product
 *       content:
 *         application/json:
 *           example:
 *             data: {_id: '123', title: 'Product', description: 'Description', code: '123', price: 123, thumbnail: 'url', stock: 10, status: false, category: 'category'}
 *     404:
 *       description: Product not found
 *       content:
 *         application/json:
 *           example:
 *             error: [{error: 'Product not found'}]
 */
router.get('/:pid', async (req, res) => {
    try {
        const data = await products.getProductById(req.params.pid);
        ! data ? res.status(404).json({error: 'Product not found'}) : res.json(data);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


/**
 * @swagger
 * /api/products:
 *  post:
 *    summary: Create a product
 *    tags: [Products]
 *    description: Create a product
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              description:
 *                type: string
 *              code:
 *                type: string
 *              price:
 *                type: number
 *              status:
 *                type: boolean
 *              stock:
 *                type: number
 *              category:
 *                type: string
 *              thumbnail:
 *                type: array
 *    responses:
 *      201:
 *        description: Product created
 *        content:
 *          application/json:
 *            example:
 *              data: {_id: '123', title: 'Product', description: 'Description', code: '123', price: 123, stock: 10, status: false, category: 'category', thumbnail: ['name.jpg']}
 *      500:
 *        description: Error
 *        content:
 *          application/json:
 *            example:
 *              error: [{error: 'Error'}]
 */
router.post('/', async (req, res) => {
    const product = req.body;

    try {
       const data = await products.createProduct(
            product.title,
            product.description,
            product.code,
            product.price,
            product.status,
            product.stock,
            product.category,
            product.thumbnail);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


/**
 * @swagger
 * /api/products/{pid}:
 *  put:
 *    summary: Update a product
 *    tags: [Products]
 *    description: Update a product
 *    parameters:
 *    - in: path
 *      name: pid
 *      required: true
 *      description: The product id
 *      schema:
 *        type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *          properties:
 *            title:
 *              type: string
 *            description:
 *              type: string
 *            code:
 *              type: string
 *            price:
 *              type: number
 *            status:
 *              type: boolean
 *            stock:
 *              type: number
 *            category:
 *              type: string
 *            thumbnail:
 *              type: array
 *    responses:
 *      200:
 *        description: Product updated
 *        content:
 *          application/json:
 *            example:
 *              message: {message: 'Product updated'}
 *      404:
 *        description: Product not found
 *        content:
 *          application/json:
 *            example:
 *              error: {error: 'Product not found'}
 *      500:
 *        description: Error
 *        content:
 *          application/json:
 *            example:
 *              error: {error: 'Error'}
 */
router.put('/:pid', async (req, res) => {
    try {
        const data = await products.updateProduct(req.params.pid, req.body);
        data ? res.json({message: 'Product updated'}) : res.status(404).json({error: 'Product not found'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


/**
 * @swagger
 * /api/products/{pid}:
 *  delete:
 *    summary: Delete a product
 *    tags: [Products]
 *    description: Delete a product
 *    parameters:
 *    - in: path
 *      name: pid
 *      required: true
 *      description: The product id
 *      schema:
 *        type: string
 *    responses:
 *      200:
 *        description: Product deleted
 *        content:
 *          application/json:
 *            example:
 *              message: {message: 'Product deleted'}
 *      404:
 *        description: Product not found
 *        content:
 *          application/json:
 *            example:
 *              error: {error: 'Product not found'}
 *      500:
 *        description: Error
 *        content:
 *          application/json:
 *            example:
 *              error: {error: 'Error'}
 */
router.delete('/:pid', async (req, res) => {
    try {
        const data = await products.deleteProduct(req.params.pid);
        data ? res.json({message: 'Product deleted'}) : res.status(404).json({error: 'Product not found'});
    } catch (error) {
        res.status(500).json({error: error.message}); 
    }
});

export default router;