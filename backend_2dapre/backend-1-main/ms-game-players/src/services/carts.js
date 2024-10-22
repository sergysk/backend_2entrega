import Config from "../core/config.js";
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import CartsValidator from "../validators/carts.js";

const cartsValidator = new CartsValidator();

class Carts {
    constructor() {
        this.__filename = fileURLToPath(import.meta.url);
        this.__dirname = path.dirname(this.__filename);
        this.directoryPath = path.join(this.__dirname, Config.DIRECTORY_DATA);
        this.filePath = path.join(this.__dirname, Config.CARTS_FILE);
    }

    async getCarts(limit) {
        let carts = [];
        try {
            await fs.mkdir(this.directoryPath, { recursive: true });
            const data = await fs.readFile(this.filePath, 'utf-8');
            data ? carts = JSON.parse(data) : carts;
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
        return carts.slice(0, limit);
    }

    async createCart() {
        let carts = [];
        try {
            await fs.mkdir(this.directoryPath, { recursive: true });
            const data = await fs.readFile(this.filePath, 'utf-8');
            carts = JSON.parse(data);
        } catch (error) {
           if (error.code !== 'ENOENT') {
               throw error;
           }
        }

        let id = uuidv4();
        carts.push({ id, products: [] });
        await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2), 'utf-8');
        return true;
    }

    async getCartById(id) {
        try {
            await fs.mkdir(this.directoryPath, { recursive: true });
            const data = await fs.readFile(this.filePath, 'utf-8');
            const carts = JSON.parse(data);
            const products = carts.find(cart => cart.id === id);
            return products['products'];
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
        return false;
    }

    async addProductToCart(id, productId, quantity) {

        cartsValidator.addProductToCart(productId, quantity);
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            const carts = JSON.parse(data);
            const cart = carts.find(cart => cart.id === id);
            if (cart === undefined) { return false; } 

            // Si el producto ya existe en el carrito, se suma la cantidad sino se agrega el nuevo producto al carrito
            cart.products.find(product => product.product === productId) ?
                cart.products.find(product => product.product === productId).quantity += quantity :
                cart.products.push({product: productId, quantity: quantity});

            await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2), 'utf-8');
            return true;
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
        return false;
    }
}

export default Carts;