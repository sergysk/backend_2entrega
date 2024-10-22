class ProdutcsValidator {
    product(title, description, code, price, status, stock, category, thumbnail) {
        if (!title || !description || !code || !price || !status || !stock || !category) {
            throw new Error('All fields (title, description, code, price, status, stock, category) are required to create a product and except thumbnail');
        }

        if (typeof title !== 'string' || typeof description !== 'string' || typeof code !== 'string' || typeof category !== 'string') {
            throw new Error('title, description, code and category must be strings');
        }

        if (typeof price !== 'number' || typeof stock !== 'number') {
            throw new Error('price and stock must be numbers');
        }

        if (typeof status !== 'boolean') {
            throw new Error('status must be a boolean');
        }

        if (price <= 0 || stock <= 0) {
            throw new Error('Price and stock must be greater than 0');
        }
 
        if (thumbnail && (!Array.isArray(thumbnail) || !thumbnail.every(item => typeof item === 'string'))) {
            throw new Error('thumbnail must be an array of strings');
        }
    }
}

export default ProdutcsValidator;