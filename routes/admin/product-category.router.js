const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer(); // upload

const controller = require("../../controllers/admin/product-category.controllers.js");
const validate = require("../../validates/admin/products-category.validate.js");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares.js");

router.get("/", controller.index);
router.get("/create", controller.create);

router.post(
    "/create",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
);

module.exports = router; 