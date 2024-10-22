import Config from '../core/config.js';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';
import ProdutcsValidator from '../validators/products.js';

const productsValidator = new ProdutcsValidator();

class Products {
    constructor() {
        this.__filename = fileURLToPath(import.meta.url);
        this.__dirname = path.dirname(this.__filename);
        this.directoryPath = path.join(this.__dirname, Config.DIRECTORY_DATA);
        this.filePath = path.join(this.__dirname, Config.PRODUCTS_FILE);
    }

    async getProducts(limit) {
        let products = [];

        try {
            await fs.mkdir(this.directoryPath, { recursive: true });
            const data = await fs.readFile(this.filePath, 'utf-8');
            data ? products = JSON.parse(data) : products;
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            } 
        }

        return products.slice(0, limit);
    }

    async getProductById(id) {
        let products = [];

        try {
            await fs.mkdir(this.directoryPath, { recursive: true });
            const data = await fs.readFile(this.filePath, 'utf-8');
            data ? products = JSON.parse(data) : products;

            return products.find(product => product.id === id);
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
        return false;        
    }

    async createProduct(title, description, code, price, status, stock, category, thumbnail=['default.jpg']) {
        productsValidator.product(title, description, code, price, status, stock, category, thumbnail);
        let products = [];

        try {
            await fs.mkdir(this.directoryPath, { recursive: true });
            const data = await fs.readFile(this.filePath, 'utf-8');
            products = JSON.parse(data);
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }

        let id = uuidv4();
        products.push({ id, title, description, code, price, status, stock, category, thumbnail });
        await fs.writeFile(this.filePath, JSON.stringify(products, null, 2), 'utf-8');

        return { id, title, description, code, price, status, stock, category, thumbnail };
    }

    async deleteProduct(id) {
        try {
            let products = [];
            const data = await fs.readFile(this.filePath, 'utf-8');
            products = JSON.parse(data);
            products = products.filter(product => product.id !== id);
            await fs.writeFile(this.filePath, JSON.stringify(products, null, 2), 'utf-8');
            return true;
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
        return false;
    }

    async updateProduct(id, product) {
        productsValidator.product(product.title, product.description, product.code, product.price, product.status, product.stock, product.category ,product.thumbnail);
        try {
            let products = [];
            const data = await fs.readFile(this.filePath, 'utf-8');
            products = JSON.parse(data);

            const index = products.findIndex(product => product.id === id);
            if (index === -1) { return false; }
            products[index] = { id, ...product };

            await fs.writeFile(this.filePath, JSON.stringify(products, null, 2), 'utf-8');
            return true;
        } catch (error) {
            if (error.code !== 'ENOENT') {
                throw error;
            }
        }
        return false;
    }
}

export default Products;