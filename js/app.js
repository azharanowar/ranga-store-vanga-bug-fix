const arr = [];

const loadProducts = (url) => {
   fetch(url)
      .then((res) => res.json())
      .then((data) => {
         arr.push(data);
         showProducts(data);
      });
};

loadProducts('https://fakestoreapi.com/products');

// show all product in UI
const showProducts = (products) => {
   
   setInnerText('total_products', products.length);

   document.getElementById("all-products").innerHTML = "";

   const allProducts = products.slice(0, 10).map((pd) => pd);
   for (const product of allProducts) {
      const image = product.image;
      const div = document.createElement('div');
      div.classList.add('product');
      div.innerHTML = `<div class="single-product">
      <div>
    <img class="product-image" src=${image}></img>
      </div>
      <h3>${product.title}</h3>
      <p>Category: ${product.category}</p>
      <h2>Price: $ ${product.price}</h2>

      <button onclick="showProductDetails(${product.id})" id="details-btn"    data-bs-toggle="modal"
      data-bs-target="#exampleModal" class="btn btn-outline-secondary mb-2 rounded-1 mt-1">Details</button>
      
      <button onclick="addToCart(${product.id},${product.price})" id="addToCart-btn" class="buy-now btn btn-success border-0 w-100 rounded-0 bg-main py-2">Add to cart</button>
      `;
      document.getElementById('all-products').appendChild(div);
   }
};

let count = 0;

const addToCart = (id, price) => {
   count = count + 1;
   updatePrice(id, price);

   updateTaxAndCharge();
   document.getElementById('total-Products').innerText = count;

   updateTotal();
};

const showProductDetails = (product_id) => {
   // console.log(product_id);
   fetch(`https://fakestoreapi.com/products/${product_id}`)
      .then((res) => res.json())
      .then((data) => showProductDetailsInModal(data));
};

const showProductDetailsInModal = (product_details) => {
   console.log(product_details);
   setInnerText('exampleModalLabel', product_details.title);
   setInnerText('product_id', product_details.id);
   setInnerText('modal_body', product_details.description);
   setInnerText('rating', product_details.rating.rate);
};

const getInputValue = (id) => {
   const element = document.getElementById(id).innerText;
   const converted = Number(element);
   return converted;
};

// main price update function
const updatePrice = (id, value) => {
   const convertedOldPrice = getInputValue("price");
   const convertPrice = Number(value);
   const total = convertedOldPrice + convertPrice;
   setInnerText('price', total.toFixed(2));
};

// set innerText function
const setInnerText = (id, value) => {
   document.getElementById(id).innerText = value;
};

// update delivery charge and total Tax
const updateTaxAndCharge = () => {
   const priceConverted = getInputValue('price');
   let deliveryAmount = 0;
   let taxAmount = 0;
   if (priceConverted < 200) {
      deliveryAmount = 30;
      taxAmount = priceConverted * 0.2; // 20% tax
   }
   else if (priceConverted < 400) {
      deliveryAmount = 40;
      taxAmount = priceConverted * 0.3; // 30% tax
   }
   else {
      deliveryAmount = 60;
      taxAmount = priceConverted * 0.4; // 40% tax
   }

   setInnerText('delivery-charge', deliveryAmount.toFixed(2));
   setInnerText('total-tax', taxAmount.toFixed(2));
};

//grandTotal update function
const updateTotal = () => {
   const grandTotal =
      getInputValue('price') +
      getInputValue('delivery-charge') +
      getInputValue('total-tax');
   document.getElementById('total').innerText = grandTotal.toFixed(2);
};

// search by category
document.getElementById("search-btn").addEventListener("click", function () {
   const inputField = document.getElementById("input-value").value;
   if (inputField) {
      const searchedProduct = arr[0].find((p) =>
         p.category.startsWith(`${inputField}`)
      );
      showProducts(searchedProduct);
   }
 });


