class Herramienta {
    constructor(id, nombre, tipo, proveedor_id) {
        this.id = id || null;
        this.nombre = nombre || null;
        this.tipo = tipo || null;
        this.proveedor_id = proveedor_id || null;
    }
}

let herramienta = new Herramienta();
let registros = [];

const guardarFormulario = async () => {
    document.getElementById("btnGuardar").disabled = true;

    herramienta = new Herramienta(
        document.getElementById('id').value,
        document.getElementById('nombre').value,
        document.getElementById('tipo').value,
        document.getElementById('proveedor_id').value
    );

    if (herramienta.id) {
        await actualizarRegistro(herramienta);
    } else {
        await insertarRegistro(herramienta);
    }
}

const actualizarRegistro = async (herramienta) => {
    await fetch(`${API_BASE_URL}/Herramienta/Actualizar?idHerramienta=${herramienta.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(herramienta)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    })
    .finally(() => {
        document.getElementById("btnGuardar").disabled = false;
        cargarDatos();
    });
}

const insertarRegistro = async (herramienta) => {
    await fetch(`${API_BASE_URL}/Herramienta/Insertar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(herramienta)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    })
    .finally(() => {
        document.getElementById("btnGuardar").disabled = false;
        cargarDatos();
    });
}

const cargarDatos = async () => {
    registros = [];
    fetch(`${API_BASE_URL}/Herramienta/ConsultarTodos`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.status !== 200) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Herramientas consultadas correctamente:', data);
        data.forEach(function (item) {
            registros.push(new Herramienta(
                item.id,
                item.nombre,
                item.tipo,
                item.proveedor_id
            ));
        });
        mostrarDatos();
    })
    .catch(error => {
        console.error('Error consultando herramienta:', error);
    });
}

const mostrarDatos = () => {

    document.getElementById("tablaRegistros").innerHTML = '';
    registros.forEach(function (registro) {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${registro.id}</td>
            <td>${registro.nombre}</td>
            <td>${registro.tipo}</td>
            <td>${registro.proveedor_id}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarRegistro(${registro.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarRegistro(${registro.id})">Eliminar</button>
            </td>
        `;
        document.getElementById("tablaRegistros").appendChild(fila);
    })
}

const editarRegistro = async (id) => {
    const registro = registros.find(r => r.id === id);
    if (registro) {
        document.getElementById("id").value = registro.id;
        document.getElementById("nombre").value = registro.nombre;
        document.getElementById("tipo").value = registro.tipo;
        document.getElementById("proveedor_id").value = registro.proveedor_id;
    }
}

const eliminarRegistro = async (id) => {

    if (!confirm("¿Estás seguro de que deseas eliminar este registro?")) {
        return;
    }
    
    await fetch(`${API_BASE_URL}/Herramienta/Eliminar?idHerramienta=${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        alert("Eliminado");
        cargarDatos();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

window.onload = async () => {
    await cargarDatos();
};