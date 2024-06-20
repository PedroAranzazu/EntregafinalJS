let carrito = [];

async function obtenerProductos() {
    try {
        const response = await fetch('./product.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const productos = await response.json();

       
        const productosMezclados = _.shuffle(productos.products);

        localStorage.setItem('productos', JSON.stringify(productosMezclados));
        
        renderizarProductos(productosMezclados);
    } catch (error) {
        console.error(`Hubo un error: ${error.message}`);
    }
}

function renderizarProductos(productos) {
    const contenedorProductos = document.getElementById('productos-container');
    contenedorProductos.innerHTML = ''; 

    productos.forEach(producto => {
        const divProducto = document.createElement('div');
        divProducto.className = 'card mb-3';
        divProducto.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${producto.name}</h5>
                <p class="card-text">Precio: $${producto.price.toFixed(2)}</p>
                <p class="card-text">Stock: ${producto.stock}</p>
                <button class="btn btn-primary" onclick="abrirModalProducto(${producto.id})">Ver detalles del producto</button>
                <button class="btn btn-primary mt-2" onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
            </div>
        `;
        contenedorProductos.appendChild(divProducto);
    });
}

function abrirModalProducto(productId) {
    const productos = JSON.parse(localStorage.getItem('productos'));
    const producto = productos.find(p => p.id === productId);
    
    const modalProductName = document.getElementById('modal-product-name');
    const modalProductPrice = document.getElementById('modal-product-price');
    const modalProductStock = document.getElementById('modal-product-stock');

    modalProductName.textContent = producto.name;
    modalProductPrice.textContent = `Precio: $${producto.price.toFixed(2)}`;
    modalProductStock.textContent = `Stock: ${producto.stock}`;

    const productoModal = new bootstrap.Modal(document.getElementById('productoModal'));
    productoModal.show();
}

function agregarAlCarrito(productId) {
    const productos = JSON.parse(localStorage.getItem('productos'));
    const producto = productos.find(p => p.id === productId);
    
    const productoEnCarrito = carrito.find(p => p.id === productId);
    if (productoEnCarrito) {
        productoEnCarrito.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));

    actualizarCarrito();
}

function actualizarCarrito() {
    const carritoList = document.getElementById('carrito-list');
    carritoList.innerHTML = '';

    let total = 0;

    carrito.forEach(producto => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.innerHTML = `
            <div>
                ${producto.name} - Cantidad: ${producto.cantidad}
                <span class="badge bg-primary rounded-pill">$${(producto.price * producto.cantidad).toFixed(2)}</span>
            </div>
            <div>
                <button class="btn btn-sm btn-outline-primary" onclick="cambiarCantidad(${producto.id}, 1)">+</button>
                <button class="btn btn-sm btn-outline-danger" onclick="cambiarCantidad(${producto.id}, -1)">-</button>
            </div>
        `;
        carritoList.appendChild(listItem);
        total += producto.price * producto.cantidad;
    });

    document.getElementById('total-price').textContent = total.toFixed(2);

    const carritoModal = new bootstrap.Modal(document.getElementById('carritoModal'));
    carritoModal.show();
}

function cambiarCantidad(productId, cantidad) {
    const producto = carrito.find(p => p.id === productId);
    if (producto) {
        producto.cantidad += cantidad;
        if (producto.cantidad <= 0) {
            carrito = carrito.filter(p => p.id !== productId);
        }
        localStorage.setItem('carrito', JSON.stringify(carrito));
        actualizarCarritoSinModal();
    }
}

function actualizarCarritoSinModal() {
    const carritoList = document.getElementById('carrito-list');
    carritoList.innerHTML = '';

    let total = 0;

    carrito.forEach(producto => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.innerHTML = `
            <div>
                ${producto.name} - Cantidad: ${producto.cantidad}
                <span class="badge bg-primary rounded-pill">$${(producto.price * producto.cantidad).toFixed(2)}</span>
            </div>
            <div>
                <button class="btn btn-sm btn-outline-primary" onclick="cambiarCantidad(${producto.id}, 1)">+</button>
                <button class="btn btn-sm btn-outline-danger" onclick="cambiarCantidad(${producto.id}, -1)">-</button>
            </div>
        `;
        carritoList.appendChild(listItem);
        total += producto.price * producto.cantidad;
    });

    document.getElementById('total-price').textContent = total.toFixed(2);
}

function cargarCarrito() {
    const carritoAlmacenado = JSON.parse(localStorage.getItem('carrito'));
    if (carritoAlmacenado) {
        carrito = carritoAlmacenado;
        actualizarCarritoSinModal();
    }
}

window.onload = () => {
    obtenerProductos();
    cargarCarrito();
};