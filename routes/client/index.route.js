const productRouter = require("./product.route.js");
const homeRoutes = require("./home.router.js");
module.exports = (app) => {
    app.use("/", homeRoutes);
    app.use("/products", productRouter)
}