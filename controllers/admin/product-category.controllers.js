const systemConfig = require("../../config/system");
const ProductCategory = require("../../models/product-category.model");
const mongoose = require("mongoose"); // 🛠 Thêm dòng này! 

// [GET] /admin/products-category  hiển thị danh mục
module.exports.index = async (req, res) => {

    let find = {
        deleted: false,
    };

    const records = await ProductCategory.find(find)

    res.render("admin/pages/products-category/index", {
        pageTitle: "Danh mục sản phẩm",
        records: records
    });
}
module.exports.create = async (req, res) => {
    res.render("admin/pages/products-category/create", {
        pageTitle: "Tạo danh mục sản phẩm",
    });
}
// [POST] /admin/products-category/create tạo mới 1 sản phẩm
module.exports.createPost = async (req, res) => {

    if (req.body.position == "") {
        const count = await ProductCategory.count();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    const record = new ProductCategory(req.body);
    await record.save();
    console.log(record);

    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    console.log("Lưu thành công!");
}