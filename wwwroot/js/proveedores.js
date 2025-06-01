class Proveedor {
    constructor(id, nombre, contacto, telefono, email) {
        this.id = id || null;
        this.nombre = nombre || null;
        this.contacto = contacto || null;
        this.telefono = telefono || null;
        this.email = email || null;
    }
}

let proveedor = new Proveedor();
let registros = [];

const guardarFormulario = async () => {
    document.getElementById("btnGuardar").disabled = true;

    proveedor = new Proveedor(
        document.getElementById('id').value,
        document.getElementById('nombre').value,
        document.getElementById('contacto').value,
        document.getElementById('telefono').value,
        document.getElementById('email').value
    );

    if (proveedor.id) {
        await actualizarRegistro(proveedor);
    } else {
        await insertarRegistro(proveedor);
    }
}

const actualizarRegistro = async (proveedor) => {
    await fetch(`${API_BASE_URL}/Proveedor/Actualizar?idProveedor=${proveedor.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(proveedor)
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

const insertarRegistro = async (proveedor) => {
    await fetch(`${API_BASE_URL}/Proveedor/Insertar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(proveedor)
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
    fetch(`${API_BASE_URL}/Proveedor/ConsultarTodos`, {
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
            console.log('Proveedores consultados correctamente:', data);
            data.forEach(function (item) {
                registros.push(new Proveedor(
                    item.id,
                    item.nombre,
                    item.contacto,
                    item.telefono,
                    item.email
                ));
            });
            mostrarDatos();
        })
        .catch(error => {
            console.error('Error consultando proveedores:', error);
        });
}

const mostrarDatos = () => {

    document.getElementById("tablaRegistros").innerHTML = '';
    registros.forEach(function (registro) {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${registro.id}</td>
            <td>${registro.nombre}</td>
            <td>${registro.contacto}</td>
            <td>${registro.telefono}</td>
            <td>${registro.email}</td>
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
        document.getElementById("contacto").value = registro.contacto;
        document.getElementById("telefono").value = registro.telefono;
        document.getElementById("email").value = registro.email;
    }
}

const eliminarRegistro = async (id) => {

    if (!confirm("¿Estás seguro de que deseas eliminar este registro?")) {
        return;
    }

    await fetch(`${API_BASE_URL}/Proveedor/Eliminar?idProveedor=${id}`, {
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