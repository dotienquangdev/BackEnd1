
//Restore Item
const buttonsRestore = document.querySelectorAll("[button-restore]");
if (buttonsRestore.length > 0) {
    const formDeleteItem = document.querySelector("#form-restore-item");
    const path = formDeleteItem.getAttribute("data-path");


    buttonsRestore.forEach(button => {
        button.addEventListener("click", () => {
            // console.log(button);
            const isConfirm = confirm("Bạn có muốn khôi phục sản phẩm này!");

            if (isConfirm) {
                const id = button.getAttribute("data-id");
                // console.log(id);
                const action = `${path}/${id}?_method=DELETE`;
                // console.log(action);
                formDeleteItem.action = action;

                formDeleteItem.submit();
            }
        });
    })
}
//end