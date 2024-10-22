class CartsValidator {
    addProductToCart(productId, quantity) {
        if (quantity <= 0) {
            throw new Error('quantity must be greater than 0');
        }
        
        if (!productId || !quantity) {
            throw new Error('productId and quantity are required');
        }

        if (typeof productId !== 'string' || typeof quantity !== 'number') {
            throw new Error('productId must be a string and quantity must be a number');
        }

    }
}

export default CartsValidator;