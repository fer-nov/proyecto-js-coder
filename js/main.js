const nav = document.querySelector("#nav");
const abrir = document.querySelector("#abrir");
const cerrar = document.querySelector("#cerrar");

abrir.addEventListener("click", () => {
    nav.classList.add("visible");
})

cerrar.addEventListener("click", () => {
    nav.classList.remove("visible");
})

const pizzas = [
  { id: 1, nombre: "Pizza Muzarella", precio: 15000 },
  { id: 2, nombre: "Pizza Napolitana", precio: 16000 },
  { id: 3, nombre: "Pizza Fugazzeta", precio: 18000 },
  { id: 4, nombre: "Pizza especial", precio: 23000 },
  { id: 5, nombre: "Pizza Jamaica", precio: 29000 },
  { id: 6, nombre: "Pizza Madrileña", precio: 25000 },
  { id: 7, nombre: "Pizza Mexicana", precio: 25000 },
  { id: 8, nombre: "Pizza Munich", precio: 32000 },
  { id: 9, nombre: "Pizza Palmitos", precio: 29000 },
  { id: 10, nombre: "Pizza Pampeana", precio: 32000 },
  { id: 11, nombre: "Pizza Peperoni", precio: 25000 },
  { id: 12, nombre: "Pizza Primavera", precio: 25000 },
  { id: 13, nombre: "Empanada Árabe", precio: 3500 },
  { id: 14, nombre: "Empanada Cantimpalo", precio: 2500 },
  { id: 15, nombre: "Empanada Caprese", precio: 2500 },
  { id: 16, nombre: "Empanada Carne", precio: 3500 },
  { id: 17, nombre: "Empanada Jamón y Muzza", precio: 2500 },
  { id: 18, nombre: "Empanada Pollo", precio: 2500 },
  { id: 19, nombre: "Empanada Queso y Cebolla", precio: 2500},
  { id: 20, nombre: "Empanada Roq y Nuéz", precio: 2500 },
  { id: 21, nombre: "Empanada Vacío", precio: 3500 },
  { id: 22, nombre: "Empanada Osobuco", precio: 3500 },
  { id: 23, nombre: "Empanada Salteña", precio: 1500 },
  { id: 24, nombre: "Empanada Salteña Pollo", precio: 1500 }
];

let pedido = [];

const botonesComida = document.querySelectorAll('.agregarP');
const listaPedido = document.getElementById('lista-pedido');
const totalHTML = document.getElementById('total-general');

botonesComida.forEach(boton => {
  boton.addEventListener('click', (e) => {
    e.preventDefault();

    // agarro el div interno
    const card = boton.querySelector('div');
    const id = parseInt(card.id);

    const producto = pizzas.find(p => p.id === id);
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

}

// Eliminar pedido
listaPedido.addEventListener('click', (e) => {
  if (!e.target.classList.contains('btn-eliminar')) return;

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

