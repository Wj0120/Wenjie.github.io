<script>
let cart = [];

function addToCart(itemName, price) {
  cart.push({ name: itemName, price: price });
}

function openCartModal() {
  const cartModal = document.getElementById('cartModal');
  cartModal.style.display = 'block';
  displayCartItems();
}

function closeCartModal() {
  const cartModal = document.getElementById('cartModal');
  cartModal.style.display = 'none';
}

function displayCartItems() {
  const cartItemsList = document.getElementById('cartItems');
  cartItemsList.innerHTML = '';
  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - RM ${item.price}`;
    cartItemsList.appendChild(li);
  });
}

function checkout() {
  // Implement checkout logic here (e.g., proceed to payment)
  alert('Checkout functionality coming soon!');
}
</script>