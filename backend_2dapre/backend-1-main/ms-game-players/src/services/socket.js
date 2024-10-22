import { Server } from 'socket.io';
import logger from '../core/logger.js';
import Products from './products.js';

const products = new Products();

export const initSocket = (httpServer) => {
    const socketServer = new Server(httpServer);
    console.log("Socket server initialized");

    socketServer.on('connection', socket => {
        logger.info(`New connection: ${socket.id}`);

        socket.on('getProducts', async () => {
            try {
                const productsList = await products.getProducts();
                socket.emit('products', productsList);
            } catch (error) {
                logger.error(`Error getting products: ${error}`);
            }   
        });

        socket.on('addProduct', async data => {
            try {
                logger.info(`New product: ${JSON.stringify(data)}`);
                const product = await products.createProduct(
                    data.productName,
                    data.description,
                    data.code,
                    data.price,
                    data.status,
                    data.stock,
                    data.category,
                    data.thumbnail);
                socketServer.emit('productAdded', product);
            } catch (error) {
                logger.error(`Error adding product: ${error}`);
            }
        });

        socket.on('delProduct', async id => {
            try {
                logger.info(`Delete product: ${id}`);
                const product = await products.deleteProduct(id);
                socketServer.emit('productDeleted', product);
            } catch (error) {
                logger.error(`Error deleting product: ${error}`);
            }
        })

        socket.on('disconnect', () => {
            logger.info(`Client disconnected: ${socket.id}`);
        });
    });
    
    return socketServer;
};