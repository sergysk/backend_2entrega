import express from 'express';
import { Server } from 'socket.io';
import __dirname from './path.js';
import Config from './core/config.js';
import handlebars from 'express-handlebars';
import productsRoute from './routes/products.js';
import cartsRoute from './routes/carts.js';
import swaggerDocs from './swagger/swagger.js';
import pruebasRoute from './routes/prueba.js';  


const app = express();
const PORT = Config.PORT;

app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars');   
app.set('views', __dirname + '/views');

// Ubicacion de carpeta public
app.use(express.static(__dirname + '/public/'))


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/healthy', (req, res) => {
    res.status(200).json({status: 'up'});
});

app.use('/api/products', productsRoute);
app.use('/api/carts', cartsRoute);
app.use('/prueba', pruebasRoute);

const httpServer = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    swaggerDocs(app, PORT);
});


const socketServer = new Server(httpServer);

socketServer.on('connection', (socket) => {
    socket.on('mensaje', (data) => {
        console.log(data);
    });
});