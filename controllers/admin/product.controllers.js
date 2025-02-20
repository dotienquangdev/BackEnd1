const Product = require("../../models/product.model");
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

// [GET] /admin/products hiển thị danh sách
module.exports.index = async (req, res) => {
    // console.log(req.query.status);

    // Đoạn bộ lọc
    const filterStatus = filterStatusHelper(req.query);
    console.log(filterStatus);

    let find = {
        deleted: false
    };

    if (req.query.status) {
        find.status = req.query.status;
    }
    //tính năng Tìm kiếm
    const objectSearch = searchHelper(req.query);

    // let keyword = "";
    if (objectSearch.regex) {
        // keyword = req.query.keyword;
        // const regex = new RegExp(keyword, "i");
        find.title = objectSearch.regex;
    }

    // //Phân trang
    const countProducts = await Product.countDocuments(find);
    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 4
    },
        req.query,
        countProducts
    );

    // console.log(objectPagination.skip);
    const products = await Product.find(find)
        .sort({ position: "desc" }) // hàm này để sắp xép vị trí position "desv" là giảm dần còn "asc" la tăng dần
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);
    // .limit để lấy ra đúng 4 sản phẩm ở trang đó thôi
    // .skip là để bỏ qua các sản phẩm trước đó
    // console.log(products);
    //truyền re view
    res.render("admin/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword, // để trả về giao diện
        pagination: objectPagination
    });
}

// [PATCH] /admin/products/change-status/:status/:id sửa từ hoạt động sang ko hoạt động và ngược lại
module.exports.changeStatus = async (req, res) => {
    // console.log(req.params);
    const status = req.params.status;
    const id = req.params.id;
    await Product.updateOne({ _id: id }, { status: status });


    req.flash("success", "Cập nhật trạng thái sản phẩm thành công");
    // res.send(`${status} - ${id}`);
    // res.redirect(`/admin/products`);  //redirect là để khi ấn từ dừng hoạt động sang Hoạt Động nó sẽ chuyển hướng về trang hiện tại
    res.redirect(`back`);  // back là để cho nó dừng laị ở trang đó

}
// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    // console.log(req.body);
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    switch (type) {
        case "active":
            await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
            req.flash("success", `Cập nhật trạng thái hoạt động của ${ids.length} sản phẩm thành công`);
            break;
        case "inactive":
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
            req.flash("success", `Cập nhật trạng thái dừng hoạt động của ${ids.length} sản phẩm thành công`);
            break;
        case "delete-all":
            await Product.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                deletedAt: new Date(),
            });
            req.flash("success", `Đã xóa thành công ${ids.length} sản phẩm`);
            break;
        case "change-position":
            // console.log(ids);
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                // console.log(id);
                // console.log(position);
                await Product.updateOne({ _id: id }, {
                    position: position
                });
            }
            req.flash("success", `Đã thay đổi vị trí của ${ids.length} sản phẩm`);
            break;

        default:
            break;
    }

    // console.log(type);
    // console.log(ids);
    res.redirect("back");
}

// // [DELETE] /admin/products/delete/:id Xóa cứng
// module.exports.daleteItem = async (req, res) => {
//     // console.log(req.params);
//     const id = req.params.id;
//     await Product.deleteOne({ _id: id });
//     res.redirect(`back`);  // back là để cho nó dừng laị ở trang đó
// }

// [DELETE] Xóa mềm 
module.exports.deleteItem = async (req, res) => {
    // console.log(req.params);
    const id = req.params.id;

    await Product.updateOne({ _id: id }, {
        deleted: true,
        deletedAt: new Date()
    });
    req.flash("success", `Đã xóa thành công  sản phẩm`);
    res.redirect(`back`);  // back là để cho nó dừng laị ở trang đó
}

// [GET] /admin/products/create tạo mới 1 sản phẩm
module.exports.create = async (req, res) => {
    res.render("admin/pages/products/create.pug", {
        pageTitle: "Thêm mới sản phẩm",
    });
}

// [POST] /admin/products/create tạo mới 1 sản phẩm
module.exports.createPost = async (req, res) => {



    if (req.body.title.length < 8 || req.body.length == "") {
        req.flash("error", `Tiêu đề phải lớn hơn = 8 ký tự !`);
        res.redirect("black");
        return;
    }
    // Chuyển các phầntuwf từ string về Double
    console.log(req.file);
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if (req.body.position == "") {
        const countProducts = await Product.count();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    // tâoj mới và lưusản phẩm vào database Mongodb
    const product = new Product(req.body);
    await product.save();
    // console.log(req.body);
    res.redirect(`${systemConfig.prefixAdmin}/products`)
}

// [GET] /admin/products/edit:id sửa 1 sản phẩm
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id,
        }
        const product = await Product.findOne(find);// ham find sẽ tìm nhiều bản ghi , còn findOne chỉ tìm 1 bản ghi

        // console.log(product);   // console.log(req.params.id);
        res.render("admin/pages/products/edit.pug", {
            pageTitle: "Chỉnh Sửa sản phẩm",
            product: product
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
}

// [PATCH] /admin/products/edit:id sửa 1 sản phẩm và lưu nó
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;
    // console.log(id);
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }
    // tâoj mới và lưusản phẩm vào database Mongodb
    try {
        await Product.updateOne({ _id: id }, req.body);
        req.flash("success", "Cập nhật sản phẩm thành công !")

        // setTimeout(() => {
        //     res.redirect(`${systemConfig.prefixAdmin}/products`)
        // }, 5000)
    } catch (error) {
        req.flash("error", "Cập nhật thất bại!")
    }

    // console.log(req.body);
    res.redirect("back")
}



//Detail
// [GET] /admin/products/edit:id sửa 1 sản phẩm
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id,
        }
        const product = await Product.findOne(find);// ham find sẽ tìm nhiều bản ghi , còn findOne chỉ tìm 1 bản ghi

        console.log(product);   // console.log(req.params.id);
        res.render("admin/pages/products/detail", {
            pageTitle: product.title,
            product: product
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`)
    }
}
//end