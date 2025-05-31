class Sede {
    constructor(id, nombre, ciudad, direccion) {
        this.id = id || null;
        this.nombre = nombre || null;
        this.ciudad = ciudad || null;
        this.direccion = direccion || null;
    }
}

let sede = new Sede();
let registros = [];

const guardarFormulario = async () => {
    document.getElementById("btnGuardar").disabled = true;

    sede = new Sede(
        document.getElementById('id').value,
        document.getElementById('nombre').value,
        document.getElementById('ciudad').value,
        document.getElementById('direccion').value
    );

    if (sede.id) {
        await actualizarRegistro(sede);
    } else {
        await insertarRegistro(sede);
    }
}

const actualizarRegistro = async (sede) => {
    await fetch(`${API_BASE_URL}/Sede/Actualizar?idSede=${sede.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(sede)
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

const insertarRegistro = async (sede) => {
    await fetch(`${API_BASE_URL}/Sede/Insertar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(sede)
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
    fetch(`${API_BASE_URL}/Sede/ConsultarTodos`, {
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
        console.log('Sedes consultadas correctamente:', data);
        data.forEach(function (item) {
            registros.push(new Sede(
                item.id,
                item.nombre,
                item.ciudad,
                item.direccion
            ));
        });
        mostrarDatos();
    })
    .catch(error => {
        console.error('Error consultando sedes:', error);
    });
}

const mostrarDatos = () => {

    document.getElementById("tablaRegistros").innerHTML = '';
    registros.forEach(function (registro) {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${registro.id}</td>
            <td>${registro.nombre}</td>
            <td>${registro.ciudad}</td>
            <td>${registro.direccion}</td>
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
        document.getElementById("ciudad").value = registro.ciudad;
        document.getElementById("direccion").value = registro.direccion;
    }
}

const eliminarRegistro = async (id) => {

    if (!confirm("¿Estás seguro de que deseas eliminar este registro?")) {
        return;
    }
    
    await fetch(`${API_BASE_URL}/Sede/Eliminar?idSede=${id}`, {
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