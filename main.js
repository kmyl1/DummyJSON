const URL_API='https://dummyjson.com/products';
const contenedorGrid=document.getElementById('grid-productos');
const vistaInventario=document.getElementById('vista-inventario');
const vistaDetalle=document.getElementById('vista-detalle');
const contenidoDetalle=document.getElementById('contenido-detalle');
const botonVolver=document.getElementById('boton-volver');
const inputBusqueda=document.getElementById('input-busqueda');

let listaProductos=[];
async function obtenerProductos(){
    try {
        const respuesta = await fetch(URL_API);
        const datos = await respuesta.json();
        listaProductos = datos.products;
        dibujarProductos(listaProductos);
    } catch (error){
        console.error("Error al obtener los datos:", error);
    }
}
function dibujarProductos(productos){
    contenedorGrid.innerHTML='';
    
    productos.forEach(item =>{
        const tarjeta=document.createElement('div');
        tarjeta.className='tarjeta';
        tarjeta.innerHTML = `
            <div class="tarjeta-info">
                <h3>${item.title}</h3>
                <img src="${item.thumbnail}" alt="${item.title}" loading="lazy">
                <p class="precio">$${item.price}</p>
                <small style="color: #6366f1">${item.category.toUpperCase()}</small>
                <p class="rating">Calificacion: ★${item.rating}</p>
            </div>
        `;
        tarjeta.addEventListener('click', () => verDetalleProducto(item.id));
        contenedorGrid.appendChild(tarjeta);
    });
}

async function verDetalleProducto(id){
    try {
        const respuesta = await fetch(`${URL_API}/${id}`);
        const p = await respuesta.json();
        contenidoDetalle.innerHTML = `
            <img src="${p.images[0]}" class="img-detalle" alt="${p.title}">
            <div class="info-pro">
                <h2 style="font-size: 2rem; margin-top: 0;">${p.title}</h2>
                <p style="color: #94a3b8; line-height: 1.6;">${p.description}</p>
                <p class="precio" style="font-size: 2.5rem;">$${p.price}</p>
                <div style="margin: 20px 0;">
                    <p><strong>Marca:</strong> ${p.brand || 'N/A'}</p>
                    <p><strong>Stock:</strong> ${p.stock} unidades</p>
                    <p><strong>Calificacion:</strong> ${p.rating}</p>
                </div>
            </div>
        `;

        vistaInventario.classList.add('oculto');
        vistaDetalle.classList.remove('oculto');
        window.scrollTo(0, 0);
    } catch (error) {
        console.error("Error al cargar el detalle:", error);
    }
}
inputBusqueda.addEventListener('input', (evento) => {
    const busqueda = evento.target.value.toLowerCase();
    const filtrados = listaProductos.filter(p => 
        p.title.toLowerCase().includes(busqueda) || 
        p.category.toLowerCase().includes(busqueda)
    );
    dibujarProductos(filtrados);
});
botonVolver.addEventListener('click', () => {
    vistaDetalle.classList.add('oculto');
    vistaInventario.classList.remove('oculto');
});
obtenerProductos();