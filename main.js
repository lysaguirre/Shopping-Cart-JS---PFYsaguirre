let shoppingCartArray = [];
let total = 0;
let productContainer = document.querySelector(".shop-items");
let totalProduct = document.querySelector(".cart-total-title");
let btnCart = document.querySelector(".btnCart");
let cartNumber = document.querySelector(".cartNumber");
let purchaseBtn = document.querySelector(".btn-purchase");

// peticion de productos
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "e67997df9emsh0253a43b595399ap15e731jsnc2da2c696cd8",
    "X-RapidAPI-Host": "book4.p.rapidapi.com",
  },
};

let res = await fetch("https://api.escuelajs.co/api/v1/products/", options);
let data = await res.json();

//pintamos solo 20 productos
let productsArray = data.slice(1, 19);

//vaciar carrito
btnCart.addEventListener("click", () => {
  Swal.fire({
    title: "¿Seguro quiere vaciar su carrito?",

    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: `$terceario`,
    confirmButtonText: "Aceptar",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire("¡Listo!", "¡Carrito vacio!", "success");
      shoppingCartArray.length = 0;
      drawProducts();
      getTotal();
    }
  });
});

//imprimir productos
productsArray.forEach((product) => {
  productContainer.innerHTML += `
  <div class="card shop-item" style="width: 18rem;" id="${product.id}">
  <img src="${product.images}" class="card-img-top shop-item-image" alt="libro">
  <div class="card-body">
    <h5 class="card-title shop-item-title">${product.title}</h5>
    <p class="card-text shop-item-description">${product.description}</p>
  </div>
  <ul class="list-group list-group-flush">
 
    <li class="list-group-item shop-item-price">$${product.price}</li>
  </ul>
  <div class="card-body">
  <button type="button" class=" btn btn-dark shop-item-button">Agregar al carrito <i class="fa-solid fa-cart-shopping id="cart""></i> </button>
    
  </div>
</div>`;
});

//evento click en boton "Agregar al carrito"
let addBtns = document.querySelectorAll(".shop-item-button");

addBtns = [...addBtns];
let cartContainer = document.querySelector(".cart-items");

addBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    //dibujo productos en el carro

    //primero se busca id del producto
    let actualID = parseInt(e.target.parentNode.parentNode.id);

    // id para objeto actual
    let actualProduct = productsArray.find((item) => item.id == actualID);

    if (actualProduct.quantity === undefined) {
      actualProduct.quantity = 1;
    }
    // verificar que no se imprima nuevamente el producto sino que se sume

    let existe = false;
    shoppingCartArray.forEach((products) => {
      if (actualID == products.id) {
        existe = true;
      }
    });

    if (existe) {
      actualProduct.quantity++;
    } else {
      shoppingCartArray.push(actualProduct);
    }

    //Arreglo de compra actualizado en DOM
    drawProducts();

    //sweet alert
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Producto agregado con éxito",
      width: `500px`,
      showConfirmButton: false,
      timer: 1500,
      toast: true,
    });

    //actualizar total
    drawProducts();

    getTotal();

    updateNumberInInput();

    removeProducts();
  });
});

// funcion total para sumar items
function getTotal() {
  let sumTotal;
  let total = shoppingCartArray.reduce((sum, item) => {
    sumTotal = sum + item.quantity * item.price;
    return sumTotal;
  }, 0);
  totalProduct.innerText = `Total: $${total}`;
}
// imprimir tabla de productos
function drawProducts() {
  cartContainer.innerHTML = "";
  shoppingCartArray.forEach((item) => {
    cartContainer.innerHTML += `
    
    <div class="cart-row">
    <div class="cart-item cart-column">
      <img
        class="cart-item-image"
        src="${item.images}""
        width="100"
        height="100"
      />
      <span class="cart-item-title">${item.title}</span>
        </div>
        <span class="cart-price cart-column">$${item.price}</span>
        <div class="cart-quantity cart-column">
      <input
        class="cart-quantity-input"
        min="1"
        type="number"
        value="${item.quantity}"
      />
      <button class="btn btn-danger" type="button"><i class="fa-solid fa-trash"></i></button>
    </div> 
  </div>
  `;

    //contador del carrito
    cartNumber.innerText = shoppingCartArray.length;
  });

  removeProducts();
}

function updateNumberInInput() {
  let inputNumber = document.querySelectorAll(".cart-quantity-input");

  inputNumber = [...inputNumber];

  inputNumber.forEach((item) => {
    item.addEventListener("click", (event) => {
      //buscamos el titulo del producto
      let actualProductTitle =
        event.target.parentElement.parentElement.childNodes[1].innerText;
      let actualProductQuantity = parseInt(event.target.value);
      //producto con ese titulo
      let actualProductObject = shoppingCartArray.find(
        (item) => item.title == actualProductTitle
      );
      console.log(actualProductObject);
      // actualizar el valor por cantidad

      actualProductObject.quantity = actualProductQuantity;

      //actualizar valor total
      getTotal();
    });
  });
}

// funcion para borrar item
function removeProducts() {
  let removeBtns = document.querySelectorAll(".btn-danger");

  removeBtns = [...removeBtns];
  removeBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      //buscamos el titulo del producto
      let actualProductTitle =
        event.target.parentElement.parentElement.childNodes[1].innerText;
      //producto con ese titulo
      let actualProductObject = shoppingCartArray.find(
        (item) => item.title == actualProductTitle
      );
      //arreglo de cart con los productos a remover

      shoppingCartArray = shoppingCartArray.filter(
        (item) => item != actualProductObject
      );

      // empieza sweetAlert
      Swal.fire({
        position: "center",
        icon: "success",
        title: `Producto borrado con éxito`,
        showConfirmButton: false,
        timer: 400,
      });

      // termina sweetAlert
      drawProducts();
      getTotal();
      updateNumberInInput();
    });
  });
}

//boton comprar
