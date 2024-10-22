import express from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import { initSocket } from './services/socket.js';

import Config from './core/config.js';
import productsRoute from './routes/products.js';
import cartsRoute from './routes/carts.js';
import realTimeProducts from './routes/realtimeproducts.js';
import home from './routes/home.js';
import swaggerDocs from './swagger/swagger.js';


const app = express();
const PORT = Config.PORT;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handlebars
app.engine('handlebars', handlebars.engine(
    // partials config ref: https://handlebarsjs.com/guide/partials.html#basic-partials
    {
        layoutsDir: __dirname+'/views/layouts',
        partialsDir: __dirname+'/views/partials',
    }
));
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname+'/public'));


// Endpoints
app.use('/healthy', (req, res) => {
    res.status(200).json({status: 'up'});
});

app.use('/api/products', productsRoute);
app.use('/api/carts', cartsRoute);
app.use('/realtimeproducts', realTimeProducts);
app.use('/', home);

const httpServer = app.listen(PORT,() => { console.log(`Server is running on port ${PORT}`); swaggerDocs(app, PORT);});
initSocket(httpServer);