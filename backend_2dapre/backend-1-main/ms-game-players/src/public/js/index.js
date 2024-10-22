const socket = io();


/**
 * Create a product
 */
// Get ID from form
const productForm = document.getElementById('productForm');

// Add listener to submit
productForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // Get values from form
  const productData = {
    productName: document.getElementById('productName').value,
    description: document.getElementById('descriptionProduct').value,
    code: document.getElementById('codeProduct').value,
    price: parseInt(document.getElementById('priceProduct').value),
    status: Boolean(document.getElementById('statusProduct').value),
    stock: parseInt(document.getElementById('stockProduct').value),
    category: document.getElementById('categoryProduct').value,
    thumbnail: document.getElementById('thumbnailProduct').value.split(',').map(thumbnail => thumbnail.trim())
  };

  // Send data to the server
  socket.emit('addProduct', productData);

  // Clear the form after sending
  productForm.reset();
});


/**
 * Delete a product
 */
// Get ID from form
const deleteForm = document.getElementById('productDeleteForm');

// Add listener to submit
deleteForm.addEventListener('submit', (event) => {
  event.preventDefault();

  // Get ID from product
  const productId = document.getElementById('idProduct').value;

  // Send data delete to the server
  socket.emit('delProduct', productId);

  // Clear the form after sending
  deleteForm.reset();
});



/**
 * List products
 */
// Get container list of products
const productListContainer = document.getElementById('listProductsContainer');

// Render products
function renderProducts(products) {
    // Clean the list of products
    const headers = document.querySelector('.list-products-header');
    productListContainer.innerHTML = ''; 
    productListContainer.appendChild(headers);

    // Loop through products and render each one
    products.forEach(product => {
        const productRow = document.createElement('div');
        productRow.classList.add('list-products');
        
        productRow.innerHTML = `
            <div class="list-products-id">${product.id}</div>
            <div class="list-products-title">${product.title}</div>
            <div class="list-products-description">${product.description}</div>
            <div class="list-products-code">${product.code}</div>
            <div class="list-products-price">${product.price}</div>
            <div class="list-products-status">${product.status}</div>
            <div class="list-products-stock">${product.stock}</div>
            <div class="list-products-category">${product.category}</div>
            <div class="list-products-thumbnail">${product.thumbnail.join(', ')}</div>
        `;

        productListContainer.appendChild(productRow);
    });
}

// list products
socket.emit('getProducts');
socket.on('products', (products) => {
    renderProducts(products);
});

// Update list product when a new product is added
socket.on('productAdded', () => {
    socket.emit('getProducts');
});


// Update list product when a product is deleted
socket.on('productDeleted', () => {
    socket.emit('getProducts');
});