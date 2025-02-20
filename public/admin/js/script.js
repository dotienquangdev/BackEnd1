// Button Status 
const buttonStatus = document.querySelectorAll("[button-status]");
console.log(buttonStatus);

if (buttonStatus.length > 0) {
    let url = new URL(window.location.href);
    // console.log(url);

    buttonStatus.forEach(button => {
        console.log(button);
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");

            if (status) {
                // http://localhost:3000/admin/products?status=active
                // sau dấu    ?   ở ủl bên trên gọi là Params 
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
            }
            // console.log(url);
            // console.log(url.href);
            window.location.href = url.href;
            // console.log(status);
        });
    })
}

// End

// Form search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;
        if (keyword) {
            // http://localhost:3000/admin/products?status=active
            // sau dấu    ?   ở ủl bên trên gọi là Params 
            url.searchParams.set("keyword", keyword);
        } else {
            url.searchParams.delete("keyword");
        }
        // console.log(e.target.elements.keyword.value);
        window.location.href = url.href;
    });
}
//end

// End form search
const buttonsPagination = document.querySelectorAll("[button-pagination]")
console.log(buttonsPagination);
if (buttonsPagination) {
    let url = new URL(window.location.href);
    buttonsPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");
            // console.log(page);
            url.searchParams.set("page", page);
            window.location.href = url.href;
        })
        // console.log(button);
    })
}
// End

//CheckBox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

    inputCheckAll.addEventListener("click", () => {
        // console.log(inputCheckAll.checked);
        if (inputCheckAll.checked) {
            inputsId.forEach(input => {
                input.checked = true;
            });
            // console.log("check tat ca");
        } else {
            inputsId.forEach(input => {
                input.checked = false;
            });
        }
    });
    // console.log(inputCheckAll);
    // console.log(inputsId);
    inputsId.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;
            // console.log(countChecked);
            // console.log(inputsId.length);
            if (countChecked == inputsId.length) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        });
    })
}
//End

//Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]");
console.log(formChangeMulti);
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();

        const checkboxMulti = document.querySelector("[checkbox-multi]");
        const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");


        // chọn nhiều sản phẩm và xóa 1 lúc 
        const typeChange = e.target.elements.type.value;
        // console.log(typeChange);
        if (typeChange == "delete-all") {
            const isConfirm = confirm("Bạn có chắc muốn xóa những sản phẩm này không!");

            if (!isConfirm) {
                return;
            }
        }
        //End
        // console.log(e);
        // console.log(inputsChecked);
        if (inputsChecked.length > 0) {
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");

            inputsChecked.forEach(input => {
                const id = input.value;

                if (typeChange == "change-position") {
                    const position = input
                        .closest("tr")
                        .querySelector("input[name='position']").value;

                    // console.log(`${id}-${position}`);
                    // console.log(position);
                    ids.push(`${id}-${position}`);

                } else {
                    ids.push(id);
                }
            })

            // console.log(ids.join(", "));
            inputIds.value = ids.join(", ");

            formChangeMulti.submit();
        } else {
            alert("Vui lòng chọn ít nhất 1 bản ghi");
        }
    });
}

//End

//Show Alert và ẩn phần tử đó đi

const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));
    const clodeAlert = showAlert.querySelector("[close-alert]");
    // console.log(showAlert);
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);

    clodeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    })
}
//end



//Upload image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
    const uploadImageInput = document.querySelector("[upload-image-input]");
    const uploadImagePreview = document.querySelector("[upload-image-preview]");
    const clearButton = document.querySelector(".clear-button");

    uploadImageInput.addEventListener("change", (e) => {
        console.log(e);
        const file = e.target.files[0];
        if (file) {
            uploadImagePreview.src = URL.createObjectURL(file);

        }
    });
    // Khi ấn nút X, xóa ảnh đã chọn
    clearButton.addEventListener("click", (e) => {
        e.preventDefault(); // Ngăn chặn reload trang nếu là nút submit
        uploadImageInput.value = ""; // Xóa file đã chọn
        uploadImagePreview.src = ""; // Ẩn ảnh hiển thị
        // alert("Xoa thanh cong")
    });
}

//end