const URL_API = 'https://dummyjson.com/products';
const urlParams = new URLSearchParams(window.location.search);
const idProducto = urlParams.get('id');
const formulario = document.getElementById('form-editar');
const mensajeCargando = document.getElementById('cargando-msg');

document.addEventListener('DOMContentLoaded', async () =>{
    if (!idProducto){
        alert("Id de producto no valido");
        window.location.href = 'index.html';
        return;
    }

    try {
        const respuesta = await fetch(`${URL_API}/${idProducto}`);
        if (!respuesta.ok) throw new Error("Producto no encontrado");
        
        const producto = await respuesta.json();
        
        document.getElementById('edit-titulo').value = producto.title;
        document.getElementById('edit-precio').value = producto.price;
        document.getElementById('edit-desc').value = producto.description;
        mensajeCargando.classList.add('oculto');
        formulario.classList.remove('oculto');

    } catch (error) {
        console.error("Error:", error);
        mensajeCargando.textContent = "Error al conectar con la api";
    }
});

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    const datosActualizados = {
        title: document.getElementById('edit-titulo').value,
        price: parseFloat(document.getElementById('edit-precio').value),
        description: document.getElementById('edit-desc').value
    };
    try {
        const respuesta = await fetch(`${URL_API}/${idProducto}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosActualizados)
        });

        if (respuesta.ok) {
            alert("Cambios guardados correctamente");
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error("Error en el envio: ", error);
    }
});