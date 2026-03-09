const nav = document.querySelector("#nav");
const abrir = document.querySelector("#abrir");
const cerrar = document.querySelector("#cerrar");

abrir.addEventListener("click", () => {
    nav.classList.add("visible");
})

cerrar.addEventListener("click", () => {
    nav.classList.remove("visible");
})



fetch("../js/productos.json")
  .then(Response => Response.json())
  .then(data => {
    productos = data;
    cargarPedido(productos);
  })

let pedido = [];

const botonesComida = document.querySelectorAll('.agregarP');
const listaPedido = document.getElementById('lista-pedido');
const totalHTML = document.getElementById('total-general');
const botonComprar = document.getElementById('boton-comprar')

botonesComida.forEach(boton => {
  boton.addEventListener('click', (e) => {
    e.preventDefault();

    Toastify({
        text: "Pedido agregado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #a0522d, #8b7bc9)",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: '1.5rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },
        onClick: function(){} // Callback after click
      }).showToast();

    // agarro el div interno
    const card = boton.querySelector('div');
    const id = parseInt(card.id);

    const producto = productos.find(p => p.id === id);
    if (!producto) return;

    const existente = pedido.find(p => p.id === id);

    if (existente) {
      existente.cantidad++;
    } else {
      pedido.push({
        ...producto,
        cantidad: 1
      });
      
    }
    //
    guardarPedido();
    renderPedido();
  });
});

function renderPedido() {
  listaPedido.innerHTML = '';
  let total = 0;

  pedido.forEach(p => {
    const subtotal = p.precio * p.cantidad;
    total += subtotal;

    const li = document.createElement('li');

    li.innerHTML = `
      <span>
        ${p.nombre} (x${p.cantidad}) 
        ${subtotal.toLocaleString('es-AR', {
          style: 'currency',
          currency: 'ARS'
        })}
      </span>
      <button class="btn-eliminar" data-id="${p.id}">🗑️</button>
    `;

    listaPedido.appendChild(li);
  });

  totalHTML.textContent = total.toLocaleString('es-AR', {
    //style: 'currency',
    currency: 'ARS'
  });

  // Dentro de renderPedido()
if (pedido.length === 0) {
    botonComprar.style.display = 'none';
} else {
    botonComprar.style.display = 'block';
}

}

// Eliminar pedido
listaPedido.addEventListener('click', (e) => {
  if (!e.target.classList.contains('btn-eliminar')) return;
  //-----------------------------//
  Toastify({
        text: "Pedido eliminado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #a0522d, #8b7bc9)",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: '1.5rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },
        onClick: function(){} // Callback after click
      }).showToast();
  //----------------------------//

  const id = parseInt(e.target.dataset.id);
  const producto = pedido.find(p => p.id === id);
  if (!producto) return;

  if (producto.cantidad > 1) {
    producto.cantidad--;
  } else {
    pedido = pedido.filter(p => p.id !== id);
  }
  //
  guardarPedido();
  renderPedido();

});

//
function cargarPedido() {
  const data = localStorage.getItem('pedido');
  if (data) {
    pedido = JSON.parse(data);
    renderPedido();
  }
}

cargarPedido();
// 
function guardarPedido() {
  localStorage.setItem('pedido', JSON.stringify(pedido));
}
//
function vaciarPedido() {
  pedido = [];
  localStorage.removeItem('pedido');
  renderPedido();
}
//
function actualizarPedido() {
  guardarPedido();
  renderPedido();
}
//
actualizarPedido();

botonComprar.addEventListener('click', () => {
    
    if (pedido.length === 0) {
        Toastify({
            text: "El carrito está vacío",
            style: { background: "linear-gradient(to right, #ff5f6d, #ffc371)" }
        }).showToast();
        return;
    }

    Swal.fire({
    title: "¡Compra confirmada!",
    text: "Hemos recibido tu pedido correctamente.",
    icon: "success",
    confirmButtonColor: "#a0522d"
    });

    vaciarPedido(); 
});

