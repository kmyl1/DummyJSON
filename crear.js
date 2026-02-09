document.getElementById('form-crear').addEventListener('submit', async (e) => {
    e.preventDefault();
    const producto ={
        title: document.getElementById('titulo').value,
        price: parseFloat(document.getElementById('precio').value),
        category: document.getElementById('categoria').value,
        description: document.getElementById('descripcion').value
    };

    try {
        const res = await fetch('https://dummyjson.com/products/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(producto)
        });
        if(res.ok) {
            const data = await res.json();
            alert(`Producto "${data.title}" creado exitosamente!`);
            window.location.href = 'index.html';
        }
    } catch(error) {
        console.error("Error al crear: ", error);
        alert("Hubo un error al conectar con el servidor");
    }
});