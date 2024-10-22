import 'dotenv/config';

const Config = {
    PORT: process.env.PORT || 8080,
    DIRECTORY_DATA: process.env.DIRECTORY_DATA || '../data',
    PRODUCTS_FILE: process.env.PRODUCTS_FILE || '../data/products.json',
    CARTS_FILE: process.env.CARTS_FILE || '../data/carts.json',
    LIMIT_LIST_PRODUCTS: process.env.LIMIT_LIST_PRODUCTS || 10,
    LIMIT_LIST_CARTS: process.env.LIMIT_LIST_PRODUCTS || 10,
    HOST_DOMAIN: process.env.HOST_DOMAIN || 'http://localhost',
}

export default Config;