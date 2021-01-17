const CART_PRODUCTOS = "cartProductsId";                    // Guarda o recoge elementos del LocalStorage

document.addEventListener("DOMContentLoaded", () => {       // Ejecuta las funciones cuando se carga la página por completo. 
    loadProducts();
    loadProductCart();
});

function getProductsDb() {                                  // Obtener información de los productos.
    const url = "../dbProducts.json";

    return fetch(url)                                       // fetch saca los productos del JSON.
        .then(response => {                         
            return response.json();                         // Devuelve datos de los productos.
    })
        .then(result => {
            return result;                                  // Devuelve arrray con datos de los productos.
    })
        .catch(err => {
            console.log(err);                               // Por si da error por consola.
    });
}

async function loadProducts() {                             // Asíncrona para que no devuelva una promesa.
    const products = await getProductsDb();                 // Espera a que la función acabe para continuar.   
    let html = "";                                          // Teamplate para renderizar los productos.

    products.forEach(product => {                           // Lo hace para cada uno de los productos.
        html += `                               
            <div class="col-3 product-container">
                <div class="card product">
                    <img
                        src="${product.image}"
                        class="card-img-top"
                        alt="${product.name}"
                    />
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.extraInfo}</p>
                        <p class="card-text">${product.price} € / Unidad</p>
                        <button type="button" class="btn btn-primary btn-cart" onClick="addProductCart(${product.id})">Añadir al carrito</button>
                    </div>
                </div>
            </div>
        `;
    });
    document.getElementsByClassName("products")[0].innerHTML = html;                    // Carga el html en la página web.
}

function openCloseCart() {                      // Abre y cierra el carrito
    const containerCart = document.getElementsByClassName("cart-products")[0];  

    containerCart.classList.forEach(item => {                                           // classList muestra todas las clases que tiene la constante (cart-products, hidden...)

        if(item === "hidden") {                             
            containerCart.classList.remove("hidden");                                   // Pasa de hidden a active. 
            containerCart.classList.add('active');          
        }

        if(item === "active") {
            containerCart.classList.remove('active');                                   // Pasa de active a hidden. 
            containerCart.classList.add("hidden");
        }
    });
}

function addProductCart(idProduct) {                                                    // Añade los productos al carrito.
    let arrayProductsId = [];                                                           // Array de los ids de los productos que se añaden.
    let localStorageItems = localStorage.getItem(CART_PRODUCTOS);                       // Guarda el id de los productos que están en el carrito. 

    if(localStorageItems === null) {                                                    // Si no hay productos en el carrito. 
        arrayProductsId.push(idProduct);                                                // id del nuevo producto. 
        localStorage.setItem(CART_PRODUCTOS, arrayProductsId);                          // Guarda el id del producto en el array. 
    } else { 
        let productsId = localStorage.getItem(CART_PRODUCTOS);                          // Trae todos los productos del localStorage.

        if(productsId.length > 0) {                                                     // Si ya hay contenido en el localStorage...
            productsId += "," + idProduct;                                              // Añade a la variable producstId más ids
        } else {                                                                        // localStorage está vacío. 
            productsId = productId;                 
        }
        localStorage.setItem(CART_PRODUCTOS, productsId);
    }
    loadProductCart();
}

async function loadProductCart() {                                              // Carga los productos en el carrito. 
    const products = await getProductsDb();                                     // Trae los productos de la base de datos. 

    // Convertimos el resultado del localStorage en un array.
    const localStorageItems = localStorage.getItem(CART_PRODUCTOS);             // Items del localStorage.
    let html = "";

    if(!localStorageItems) {                                                    // Imprime que el carrito está vacío. 
        html = `
            <div class="cart-product empty">
                <p>Carrito vacio.</p>
            </div>
        `;
    } else {
    const idProductsSplit = localStorageItems.split(",")  ;                     // split separa con coma y genera un array.

    // Eliminamos los IDs duplicados 
    const idProductsCart = Array.from(new Set(idProductsSplit));                // Con esta función elimina los ID duplicados. 
       
    idProductsCart.forEach(id => {                                              // Devuelve el id de cada productos. Si se repite el id sólo lo cuenta una vez.
        products.forEach(product => {                                

            if(id == product.id) {                                              // Si el id del carrito existe en la base de datos...
                const quantity = countDuplicatesId(id, idProductsSplit);        // Cantidad de elementos en el carrito.
                const totalPrice = product.price * quantity;                    // Precio total de los productos.
                html += `
                    <div class="cart-product">
                        <img src="${product.image}" alt="${product.name}" />
                        <div class="cart-product-info">
                            <span class="quantity">${quantity}</span>
                            <p>${product.name}</p>
                            <p>${totalPrice.toFixed(2)} €</p>
                            <p class="change-quantity">
                                <button onClick="decreaseQuantity(${product.id})">-</button>
                                <button onClick="increaseQuantity(${product.id})">+</button>                         
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

function deleteProductCart(idProduct) {                                     // Elimina los productos del carrito.
    const idProductsCart = localStorage.getItem(CART_PRODUCTOS);            // Trae todo los ids del carrito.
    const arrayIdProductsCart = idProductsCart.split(',');                  // Guarda los ID en un array.
    const resultIdDelete = deleteAllIds(idProduct, arrayIdProductsCart);    // Guarda las ids que NO se han eliminado. 

    if(resultIdDelete) {                
        let count = 0;
        let idsString = "";

        resultIdDelete.forEach(id => {                                      // Por cada iteración devuelve un id.
            count++;

            if(count < resultIdDelete.length) {                             // Significa que no es el tamaño máximo.
                idsString += id + ','                                       // Añade una coma porque no es el último.  
            } else {
                idsString += id;                                            // Es el último id. 
            }
        });
        localStorage.setItem(CART_PRODUCTOS, idsString);     
    }
    const idsLocalStorage = localStorage.getItem(CART_PRODUCTOS);     

    if(!idsLocalStorage) {                                                  // Si idsLocalStorage está vacío. 
        localStorage.removeItem(CART_PRODUCTOS);                    
    }
    loadProductCart();
}

function increaseQuantity(idProduct) {                                      // Suma elementos al carrito.
    const idProductsCart = localStorage.getItem(CART_PRODUCTOS);
    const arrayIdProductsCart = idProductsCart.split(",");
    arrayIdProductsCart.push(idProduct);                                    // Añade al array un nuevo elemento.
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
    localStorage.setItem(CART_PRODUCTOS, idsString);
    loadProductCart();
}

function decreaseQuantity(idProduct) {                                      // Quita un elemento del carrito.
    const idProductsCart = localStorage.getItem(CART_PRODUCTOS);
    const arrayIdProductsCart = idProductsCart.split(",");
    const deleteItem = idProduct.toString();                                // Convierte el id en un string.
    let index = arrayIdProductsCart.indexOf(deleteItem);                    // Saca el index del id.

    if (index > -1) {                                                       // Significa que existe.
        arrayIdProductsCart.splice(index, 1);
    }

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
    localStorage.setItem(CART_PRODUCTOS, idsString);
    loadProductCart();
}

function countDuplicatesId(value, arrayIds) {
    let count = 0;

    arrayIds.forEach(id => {
        if(value == id) {                           
            count ++;
        }
    });
    return count;
}

function deleteAllIds(id, arrayIds) {           // Quita elementos de un array.
    return arrayIds.filter(itemId => {             
        return itemId != id;                    // Retorna los ids a los que NO se les ha dado borrar.
    });
}