/* CSE 121B: JavaScript Language Project - Winter 2023 */
/* Name: Jorge A. Chavez */

/*------------------------- Import modules ----------------------*/
/* Imports the "products.js" module which contains the available products for the online store. */
import products from "./products.js";

/*------------------------------ DOM ----------------------------*/
/* Selects the necessary DOM elements for the program */
const shopContent = document.querySelector("#shopContent");
const productInfo = document.querySelector(".product_info");
const openModalBtn = document.getElementById("open-modal-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const shoppingCartModal = document.getElementById("shopping-cart-modal");
const continueShoppingBtn = document.getElementById("continue-shopping-btn");
const lengthCart = document.querySelector(".counter_cart");
const emptyCartButton = document.querySelector("#empty-cart-btn");

/*------------------------ Global Variables -----------------------*/

let cart = [];
let totalCart = 0;

/*---------------------------- Functions ---------------------------*/

/* Create the Products */
function createProducts() {
  products.forEach((product) => {
    const content = document.createElement("div");
    content.className = `product_card producto-card-${product.id}`;
    content.innerHTML = `
    <div class="image_box">
      <img class="image-${product.id}" alt="Image ${product.name}" src="${product.img}">
    </div>
    <div class="text_product_container">
      <h3 class="product_name">${product.name}</h3>
      <p class="product_price">$${product.price.toFixed(2)}</p>  
    </div>
    `;
    shopContent.appendChild(content);
    const buyButton = document.createElement("button");
    buyButton.className = "button_buy btn btn-outline-primary col-10";
    buyButton.innerHTML = `<i class="fa fa-shopping-cart"></i> Add to Cart`;
    buyButton.addEventListener("click", () => {
      addToCart(product);
    });
    content.appendChild(buyButton);
  }); 
}

// Add products to Cart
function addToCart(product){
  if(!cart.some((element)=> element.id === product.id)){
    cart.push({
      id: product.id,
      img: product.img,
      name: product.name,
      price: product.price,
      stock: product.stock,
      quantity: 1,
    })
  }else{
    let cartFind = cart.find((element)=>element.id === product.id);
    let cartFindIndex = cart.findIndex((element)=>element.id === product.id);
    cart[cartFindIndex] = {...cartFind, quantity : cartFind.quantity+1};
    };
  counterCart();
}
createProducts();

/* Message Empty Function, to display a message in the modal of cart if the cart is empty */
const messageEmpty = () =>{
  let messageCartEmpty = document.createElement("div");
  messageCartEmpty.className = "message_empty";
  messageCartEmpty.innerHTML = `
    <h2>You Cart is Empty</h2>
    <p>Please add products!!</p>
    <img class="empty_cart" src="images/carro.png" alt="Shopping cart Empty Image">
  `;
  productInfo.appendChild(messageCartEmpty)
}

/* Counter Cart Function, a function counter to do a counter of quantity of the products in the cart */
const counterCart = () =>{
  lengthCart.style.display = "block";
  let sumOfQuantity = cart.reduce((item,product) =>{
    return item + product.quantity;
  },0)
  lengthCart.innerHTML = sumOfQuantity;
}

/* Empty Cart Function, Function to empty all products in cart*/
const emptyCart = () =>{
  cart = [];
  totalCart = 0;
  productInfo.innerHTML = "";
  counterCart();
  messageEmpty();
}

/* Function to update the total cart */
let updateTotalCart = () => {
  totalCart = 0;
  productInfo.querySelectorAll(".content_product_card").forEach((cartCard) => {
    totalCart += parseFloat(cartCard.querySelector(".subtotal_span").innerHTML);
  });
  productInfo.querySelector(".total_cart").innerHTML = `Total: $${totalCart.toFixed(2)}`;
};

/* Function to remove a product in cart */
const removeFromCart= (cartCard, id) => {
  const productIndex = cart.findIndex((product) => product.id === parseInt(id));
  cart.splice(productIndex, 1);
  cartCard.remove();
  updateTotalCart();
  counterCart();
  if (cart.length === 0){
    productInfo.querySelector(".total_cart").style.display = "none";
    messageEmpty();
  }
}

/* function to show the cart in the modal */
const ShowTheCart = () => {
  shoppingCartModal.style.display = "block";
  productInfo.innerHTML = '';
  if(cart.length===0){
    messageEmpty();
  }
  cart.forEach((product)=>{
    let cartCard = document.createElement("div");
    cartCard.className = "content_product_card";
    cartCard.setAttribute("data-id", product.id);
    cartCard.innerHTML = `
      <h4 class="nameproducto_card">${product.name}</h4>
      <p class="nameproducto_price">Unit: $${product.price?.toFixed(2)}</p>
      <div class="quantity-selector">
        <input type="number" value="${product.quantity}" min="1" max="${product.stock}">
      </div>
      <div>
        <p class="subtotal">Subtotal: $<span class="subtotal_span">${(product.price * product.quantity).toFixed(2)}</span></p>
      </div>
      <div class="remove-button">
        <i class="fas fa-trash-alt"></i>
      </div>
      `;
    productInfo.appendChild(cartCard);
    totalCart += product.price * product.quantity
    cartCard.querySelector(".quantity-selector input").addEventListener("input", function() {
      const quantity = this.value;
      product.quantity = parseInt(quantity);
      const totalPrice = quantity * product.price;
      cartCard.querySelector(".subtotal_span").innerHTML = `${totalPrice.toFixed(2)}`;
      updateTotalCart();
      counterCart();
    }); 
    cartCard.querySelector(".remove-button i").addEventListener("click", () => {
      const id = cartCard.getAttribute("data-id");
      removeFromCart(cartCard, id);
    });
  });
  if (totalCart > 0) {
    const totalBuy = document.createElement("div");
    totalBuy.className ="total_cart";
    totalBuy.innerHTML = `Total: $${totalCart.toFixed(2)}`;
    productInfo.appendChild(totalBuy);
  }
}

/* Function to render the cart */
const renderCart = () => {
  shoppingCartModal.style.display = "none";
  productInfo.innerHTML = "";
  totalCart = 0;
}

/*------------------------- EventListener ------------------*/

/* EventListener to open the modal */
openModalBtn.addEventListener("click", ShowTheCart);
/* EventListener to remove Product */
productInfo.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON" && event.target.textContent === "Remover") {
    const productId = event.target.closest(".content_product_card").getAttribute("data-id");
    removeFromCart(productId);
  }
});

/* EventListener to botton "Continue shop" */
continueShoppingBtn.addEventListener("click", renderCart);

/* EventListener to close the modal */
closeModalBtn.addEventListener("click", renderCart);

/* EventListener to close the modal clicking anywhere on the screen outside of the modal */
window.addEventListener("click", function(event) {
  if (event.target === shoppingCartModal) {
    renderCart();
  }
})
/* EventListener to botton "Empty Cart" */
emptyCartButton.addEventListener("click",emptyCart);

/* Get the Actual Year for Copyright */
let timeCopyright = new Date;
document.querySelector(".copyright").innerHTML = timeCopyright.getFullYear();