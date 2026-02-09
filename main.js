const URL_API = 'https://dummyjson.com/products';
let skip = 0;
const limit = 10;
let totalProductos = 0;
const contenedorGrid = document.getElementById('grid-productos');
const selectCategoria = document.getElementById('select-categoria');
const selectOrden = document.getElementById('select-orden');
const inputBusqueda = document.getElementById('input-busqueda');
const infoPag = document.getElementById('info-paginacion');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');

async function cargarCategorias() {
    try {
        const res = await fetch(`${URL_API}/category-list`);
        const categorias = await res.json();
        categorias.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
            selectCategoria.appendChild(option);
        });
    } catch (err) { console.error("Error categorias: ", err); }
}

async function cargarProductos(){
    contenedorGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Cargando el inventario... </p>';
    let url = `${URL_API}?limit=${limit}&skip=${skip}`;
    if (inputBusqueda.value){
        url = `${URL_API}/search?q=${inputBusqueda.value}&limit=${limit}&skip=${skip}`;
    } else if(selectCategoria.value){
        url = `${URL_API}/category/${selectCategoria.value}?limit=${limit}&skip=${skip}`;
    }
    if (selectOrden.value) {
        const [sortBy, order] = selectOrden.value.split('-');
        url += `&sortBy=${sortBy}&order=${order}`;
    }

    try{
        const res = await fetch(url);
        const data = await res.json();
        totalProductos = data.total;
        contenedorGrid.innerHTML = ''; 
        if(data.products.length === 0){
            contenedorGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">No se encontraron productos</p>';
        }else{
            dibujarProductos(data.products);
        }
        actualizarPaginacion();
    }catch (err) {
        contenedorGrid.innerHTML = '<p style="color:red; text-align:center;">Error al conectar con el servidor</p>';
    }
}

function dibujarProductos(productos) {
    contenedorGrid.innerHTML = '';
    productos.forEach(item => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta';
        tarjeta.innerHTML = `
            <div class="acciones-admin">
                <button class="btn-admin" onclick="event.stopPropagation(); window.location.href='editar.html?id=${item.id}'">✏️</button>
                <button class="btn-admin btn-del" onclick="event.stopPropagation(); eliminarProducto(${item.id}, this)">🗑️</button>

            </div>
            <div class="tarjeta-info">
                <h3>${item.title}</h3>
                <img src="${item.thumbnail}" alt="${item.title}" loading="lazy">
                <p class="precio">$${item.price}</p>
                <small style="color: #6366f1">${item.category.toUpperCase()}</small>
                <p class="rating">Calificacion: ★${item.rating}</p>
            </div>
        `;

        tarjeta.onclick = () => verDetalleProducto(item.id);
        contenedorGrid.appendChild(tarjeta);
    });
}


function actualizarPaginacion() {
    const paginaActual = Math.floor(skip / limit) + 1;
    const totalPaginas = Math.ceil(totalProductos / limit) || 1;
    
    infoPag.textContent = `Pagina ${paginaActual} de ${totalPaginas}`;
    btnPrev.disabled = skip === 0;
    btnNext.disabled = (skip + limit) >= totalProductos;
}
btnNext.onclick = () =>{ skip += limit; cargarProductos(); };
btnPrev.onclick = () =>{ skip -= limit; cargarProductos(); };

inputBusqueda.onkeypress = (e) =>{
    if (e.key==='Enter'){
        skip = 0; cargarProductos();
    }
};

selectCategoria.onchange = () =>{
    inputBusqueda.value = '';
    skip = 0;
    cargarProductos();
};

selectOrden.onchange = () => { cargarProductos(); };

async function eliminarProducto(id, boton){
    const confirmar = confirm("Seguro que desea retirar este producto?");
    if (confirmar){
        try {
            const res = await fetch(`${URL_API}/${id}`,{ method: 'DELETE'});
            
            if (res.ok){
                const tarjeta = boton.closest('.tarjeta');
                tarjeta.style.transform = 'scale(0.8)';
                tarjeta.style.opacity = '0';
                tarjeta.style.transition = '0.3s all ease';
                
                setTimeout(() =>{
                    tarjeta.remove();
                    if (contenedorGrid.children.length === 0) {
                        contenedorGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Inventario vacio</p>';
                    }
                }, 300);
                console.log(`Producto ${id} eliminado`);
            }
        } catch (err) {
            alert("No se pudo eliminar el producto");
        }
    }
}

async function verDetalleProducto(id) {
    const res = await fetch(`${URL_API}/${id}`);
    const p = await res.json();
    document.getElementById('contenido-detalle').innerHTML = `
        <img src="${p.thumbnail}" class="img-detalle">
        <div>
            <h2>${p.title}</h2>
            <p>${p.description}</p>
            <p class="precio">$${p.price}</p>
            <p><strong>Stock:</strong> ${p.stock}</p>
        </div>
    `;
    document.getElementById('vista-inventario').classList.add('oculto');
    document.getElementById('vista-detalle').classList.remove('oculto');
}

document.getElementById('boton-volver').onclick = () => {
    document.getElementById('vista-detalle').classList.add('oculto');
    document.getElementById('vista-inventario').classList.remove('oculto');
};

cargarCategorias();
cargarProductos();