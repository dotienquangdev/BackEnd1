const dashboardRoutes = require("./dashboard.route");
const systemConfig = require("../../config/system.js");
const productRoutes = require("./product.route.js");
const deleteProductRoutes = require("./deleteProduct.router.js");

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(PATH_ADMIN + "/dashboard", dashboardRoutes);
    app.use(PATH_ADMIN + "/products", productRoutes);
    app.use(PATH_ADMIN + "/deleteProducts", deleteProductRoutes);
}