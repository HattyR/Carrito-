const CAR_PRODUCTOS = "cartProductsId";

document.addEventListener("DOMContentLoaded", () => {       // Ejecuta las funciones cuando se carga la página. 
    loadProducts();
    loadProductCart();
});

function getProductsDb() {
    const url = "../dbProducts.json";

    return fetch(url)
        .then(response => {                         // fetch saca los productos del JSON.
            return response.json();                 // Devuelve datos de los productos.
    })
        .then(result => {
            return result;                          // Devuelve datos de los productos.
    })
        .catch(err => {
            console.log(err);                       // Por si da error por consola.
    });
}

async function loadProducts() {                 // Asíncrona para que no devuelva una promesa.
    const products = await getProductsDb();     // Espera a que la función acabe para continuar.
    
    let html = "";                              // Teamplate para renderizar los productos.
    products.forEach(product => {               // Lo hace para cada uno de los productos.
        html += `                               
        <div class="col-3 product-container">
            <div class="card product">
                <img 
                    src="${product.image}"
                    class="card-img-top"
                    alt="${product.name}"
                />
                </div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.extraInfo}</p>
                    <p class="card-text">${product.price} $ / Unidad</p>
                    <button type="button" class="btn btn-primary btn-cart" onClick=(addProductCart(${product.id}))>Añadir al carrito</button>
                </div>
            </div>
        </div>
      `;
    });
    document.getElementsByClassName("products")[0].innerHTML = html;
}

function openCloseCart() {
    const containerCart = document.getElementsByClassName("cart-products")[0];
    containerCart.classList.forEach(item => {               // classList muestra todas las clases que tiene la constante (cart-products, hidden...)
        if(item === "hidden") {                             
            containerCart.classList.remove("hidden");       // Pasa de hidden a active. 
            containerCart.classList.add('active');          // ""
        }

        if(item === "active") {
            containerCart.classList.remove('active');       // Pasa de active a hidden. 
            containerCart.classList.add("hidden");
        }
    });
    
    
}

function addProductCart(idProduct) {
    let arrayProductsId = [];

    let localStorageItems = localStorage.getItem(CAR_PRODUCTOS);        // Guarda el id de los productos que están en el carrito. 

    if(localStorageItems === null) {                // Si no hay productos en el carrito. 
        arrayProductsId.push(idProduct);            // id del nuevo producto. 
        localStorage.setItem(CAR_PRODUCTOS, arrayProductsId);       // Guarda el id del producto en el array. 
    } else { 
        let productsId = localStorage.getItem(CAR_PRODUCTOS);
        if(productsId.length > 0) {                 // Si ya hay contenido en el localStorage...
            productsId += "," + idProduct;
        } else {                                    // localStorage está vacío. 
            productsId = productId;
        }
        localStorage.setItem(CAR_PRODUCTOS, productsId);
    }

    loadProductCart();
}

async function loadProductCart() {
    const products = await getProductsDb();       // Trae los productos de la base de datos. 

    // Convertimos el resultado del localStorage en un array.
    const localStorageItems = localStorage.getItem(CAR_PRODUCTOS);
    let html = "";

    if(!localStorageItems) {
        html = `
            <div class="cart-product empty">
                <p>Carrito Vacio</p>

            </div>
        `;
    } else {

    const idProductsSplit = localStorageItems.split(",")  ;         // split separa con coma y genera array.

    // Eliminamos los IDs duplicados 
    const idProductsCart = Array.from(new Set(idProductsSplit));    // Con esta función los ID duplicados. 
    
    
    idProductsCart.forEach(id => {
        products.forEach(product => {

            if(id == product.id) {
                const quantity = countDuplicatedId(id, idProductsSplit);
                const totalPrice = products.price * quantity;
                html += `
                    <div class="cart-product">
                        <img src="${product.image}" alt="${product.name}" />
                        <div class="cart-product-info">
                            <span class="quantity">${quantity}</span>
                            <p>${product.name}</p>
                            <p>${totalPrice.toFixed(2)}</p>
                            <p class="change-quantity">
                                <button onCick='increaseQuantity(${product.id})>-</button>
                                <button>+</button>
                            </p>
                            <p class="cart-product-delete">
                                <button onClick=(deleteProductCart(${product.id}))>Eliminar</button>
                            </p>
                        </div>
                    </div>
                `;
            }
        });
    });
    }


    document.getElementsByClassName('cart-products')[0].innerHTML = html;

}

function deleteProductCart(idProduct) {
    const idProductsCart = localStorage.getItem(CAR_PRODUCTOS);     // Trae todo los ID del carrito.
    const arrayIdProductsCart = idProductsCart.split(',');          // Guarda los ID en un array.
    const resultIdDelete = deleteAllIds(idProduct, arrayIdProductsCart);    // Guarda las ID que no se han eliminado. 


    if(resultIdDelete) {                
        let count = 0;
        let idsString = "";

        resultIdDelete.forEach(id => {          // Por cada iteración devuelve un ID.
            count++;
            if(count < resultIdDelete.length) { // Significa que no es el último
                idsString += id + ','           // Añade una coma porque no es el último.  
            } else {
                idsString += id;                // Es el último ID. 
            }
        });
        localStorage.setItem(CAR_PRODUCTOS, idsString);     
    }
    const idsLocalStorage = localStorage.getItem(CAR_PRODUCTOS);
    if(!idsLocalStorage) {
        localStorage.removeItem(CAR_PRODUCTOS);
    }
    loadProductCart();
}

function increaseQuantity(idProduct) {
    const idProductsCart = localStorage.getItem(CAR_PRODUCTOS);
    const arrayIdProductsCart = idProductsCart.split(",");
    arrayIdProductsCart.push(idProduct);

    let count = 0;
    let idsString = "";
    arrayIdProductsCart.forEach(id => {
        count++;
        if(count < arrayIdProductsCart.length) {
            idsString += id + ",";
        } else {
            idsString += id;
        }
    });
    localStorage.setItem(CAR_PRODUCTOS, idsString);
    loadProductCart();

}

function countDuplicatedId(value, arrayIds) {
    let count = 0;

    arrayIds.forEach(id => {
        if(value == id) {
            count ++;
        }
    });
    return count;
}

function deleteAllIds(id, arrayIds) {       // Retorna los id que no se han dado borrar. 
    return arrayIds.filter(itemId => {      //    
        return itemId != id;                // Retorna siempre que itemId sea diferente a id.
    });
}