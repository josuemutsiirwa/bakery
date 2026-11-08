
// ======================================
// PETER'S BAKERY - SHOPPING CART
// ======================================

const CART_KEY = "petersBakeryCart";

// Get the cart from localStorage
function getCart() {
    try {
        const savedCart = localStorage.getItem(CART_KEY);
        return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
        console.error("Could not read the cart:", error);
        return [];
    }
}

// Save the cart
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Add a product to the cart
function addToCart(product) {
    const confirmed = confirm(
        "Do you want to add " + product.name + " to your cart?"
    );

    if (!confirmed) return;

    const cart = getCart();
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
    alert(product.name + " has been added to your cart!");

    displayCart();
}

// Remove a product from the cart
function removeFromCart(productId) {
    const cart = getCart();
    const product = cart.find(item => item.id === productId);

    if (!product) return;

    const confirmed = confirm(
        "Are you sure you want to remove " + product.name + " from your cart?"
    );

    if (!confirmed) return;

    const updatedCart = cart.filter(item => item.id !== productId);

    saveCart(updatedCart);
    alert(product.name + " has been removed from your cart.");

    displayCart();
}

// Change the quantity of a product
function updateQuantity(productId, newQuantity) {
    const quantity = Number(newQuantity);

    if (!Number.isInteger(quantity) || quantity < 1) {
        alert("Please enter a quantity of at least 1.");
        displayCart();
        return;
    }

    const cart = getCart();
    const product = cart.find(item => item.id === productId);

    if (!product) return;

    product.quantity = quantity;

    saveCart(cart);
    displayCart();
}

// Display the cart and calculate the total
function displayCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const totalElement = document.getElementById("cart-total");
    const emptyMessage = document.querySelector(".empty-cart-message");

    if (!cartItemsContainer || !totalElement) return;

    const cart = getCart();

    cartItemsContainer.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {
        if (emptyMessage) {
            emptyMessage.style.display = "block";
        }

        totalElement.textContent = "Ksh 0";
        return;
    }

    if (emptyMessage) {
        emptyMessage.style.display = "none";
    }

    cart.forEach(product => {
        const subtotal = product.price * product.quantity;
        total += subtotal;

        const productRow = document.createElement("div");
        productRow.className = "cart-item";

        const productName = document.createElement("h3");
        productName.textContent = product.name;

        const productPrice = document.createElement("p");
        productPrice.textContent =
            "Price: Ksh " + product.price.toLocaleString("en-KE");

        const quantityLabel = document.createElement("label");
        quantityLabel.textContent = "Quantity: ";

        const quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.min = "1";
        quantityInput.step = "1";
        quantityInput.value = product.quantity;
        quantityInput.className = "cart-quantity";
        quantityInput.setAttribute("aria-label", "Quantity for " + product.name);

        quantityInput.addEventListener("change", function () {
            updateQuantity(product.id, quantityInput.value);
        });

        const productSubtotal = document.createElement("p");
        productSubtotal.textContent =
            "Subtotal: Ksh " + subtotal.toLocaleString("en-KE");

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.textContent = "Remove";
        removeButton.className = "remove-cart-item";

        removeButton.addEventListener("click", function () {
            removeFromCart(product.id);
        });

        quantityLabel.appendChild(quantityInput);

        productRow.appendChild(productName);
        productRow.appendChild(productPrice);
        productRow.appendChild(quantityLabel);
        productRow.appendChild(productSubtotal);
        productRow.appendChild(removeButton);

        cartItemsContainer.appendChild(productRow);
    });

    totalElement.textContent = "Ksh " + total.toLocaleString("en-KE");
}

// Handle Add to Cart buttons and the Place Order button
document.addEventListener("DOMContentLoaded", function () {

    // Add to Cart buttons
    const addButtons = document.querySelectorAll(".product_card button");

    addButtons.forEach(button => {
        button.addEventListener("click", function () {

            const productCard = button.closest(".product_card");

            if (!productCard) return;

            const nameElement = productCard.querySelector("h3");
            const priceElement = productCard.querySelector("span");
            const imageElement = productCard.querySelector("img");

            if (!nameElement || !priceElement || !imageElement) {
                alert("Some product information is missing.");
                return;
            }

            const name = nameElement.textContent.trim();
            const price = Number(
                priceElement.textContent.replace(/[^\d]/g, "")
            );
            const image = imageElement.getAttribute("src");

            if (!name || !Number.isSafeInteger(price) || price <= 0) {
                alert("Sorry, this product has invalid information.");
                return;
            }

            const productId = image + "|" + name + "|" + price;

            addToCart({
                id: productId,
                name: name,
                price: price,
                image: image
            });
        });
    });

    // Display saved cart items
    displayCart();

    // Place Order button
    const placeOrderButton = document.getElementById("place-order-btn");
    const orderForm = document.getElementById("customer-order-form");

    if (placeOrderButton && orderForm) {

        placeOrderButton.addEventListener("click", function () {

            const cart = getCart();

            // Check whether the cart is empty
            if (cart.length === 0) {
                alert("Your cart is empty. Please add products before placing an order.");
                return;
            }

            // Validate required form fields
            if (!orderForm.reportValidity()) {
                return;
            }

            // Calculate the total
            const total = cart.reduce(
                (sum, product) => sum + product.price * product.quantity,
                0
            );

            // Ask the client to confirm the order
            const confirmed = confirm(
                "Are you sure you want to place your order?\n\n" +
                "Number of product types: " + cart.length + "\n" +
                "Total amount: Ksh " + total.toLocaleString("en-KE")
            );

            if (!confirmed) return;

            alert(
                "Thank you for your order!\n\n" +
                "Your order details have been checked successfully.\n\n" +
                "Total: Ksh " + total.toLocaleString("en-KE") +
                "\n\nPlease note: This website currently does not send orders to the bakery."
            );
        });
    }
});
