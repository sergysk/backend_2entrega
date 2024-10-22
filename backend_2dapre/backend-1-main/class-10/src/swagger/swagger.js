import Config from "../core/config.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Metadata
const metadata = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Shopping Cart API",
            version: "1.0.0",
            description: "API for a shopping cart",
            contact: {
                name: "Harold Flores",
                email: "jefe99.jeb@gmail.com",
            },
        },
    },
    apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(metadata);
const swaggerDocs = (app, port) => {
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get("/api/docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });

    console.log(`Swagger docs running on port ${Config.HOST_DOMAIN}:${port}/api/docs`);
}

export default swaggerDocs;