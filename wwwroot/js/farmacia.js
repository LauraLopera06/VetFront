class Farmacia {
    constructor(id, nombre, telefono, direccion, sede_id) {
        this.id = id || null;
        this.nombre = nombre || null;
        this.telefono = telefono || null;
        this.direccion = direccion || null;
        this.sede_id = sede_id || null;
    }
}

let farmacia = new Farmacia();
let registros = [];

const guardarFormularioFarmacia = async () => {
    document.getElementById("btnGuardarFarmacia").disabled = true;

    farmacia = new Farmacia(
        document.getElementById('id').value,
        document.getElementById('nombre').value,
        document.getElementById('telefono').value,
        document.getElementById('direccion').value,
        document.getElementById('sede_id').value
    );

    if (farmacia.id) {
        await actualizarRegistroFarmacia(farmacia);
    } else {
        await insertarRegistroFarmacia(farmacia);
    }
}

const actualizarRegistroFarmacia = async (farmacia) => {
    await fetch(`${API_BASE_URL}/Farmacia/Actualizar?idFarmacia=${farmacia.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(farmacia)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        })
        .finally(() => {
            document.getElementById("btnGuardarFarmacia").disabled = false;
            cargarDatosFarmacia();
        });
}

const insertarRegistroFarmacia = async (farmacia) => {
    await fetch(`${API_BASE_URL}/Farmacia/Insertar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(farmacia)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        })
        .finally(() => {
            document.getElementById("btnGuardarFarmacia").disabled = false;
            cargarDatosFarmacia();
        });
}

const cargarDatosFarmacia = async () => {
    registros = [];
    fetch(`${API_BASE_URL}/Farmacia/ConsultarTodos`, {
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
            console.log('Farmacias consultadas correctamente:', data);
            data.forEach(function (item) {
                registros.push(new Farmacia(
                    item.id,
                    item.nombre,
                    item.telefono,
                    item.direccion,
                    item.sede_id
                ));
            });
            mostrarDatosFarmacia();
        })
        .catch(error => {
            console.error('Error consultando farmacias:', error);
        });
}

const mostrarDatosFarmacia = () => {
    document.getElementById("tablaRegistrosFarmacia").innerHTML = '';
    registros.forEach(function (registro) {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${registro.id}</td>
            <td>${registro.nombre}</td>
            <td>${registro.telefono}</td>
            <td>${registro.direccion}</td>
            <td>${registro.sede_id}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarRegistroFarmacia(${registro.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarRegistroFarmacia(${registro.id})">Eliminar</button>
            </td>
        `;
        document.getElementById("tablaRegistrosFarmacia").appendChild(fila);
    });
}

const editarRegistroFarmacia = async (id) => {
    const registro = registros.find(r => r.id === id);
    if (registro) {
        document.getElementById("id").value = registro.id;
        document.getElementById("nombre").value = registro.nombre;
        document.getElementById("telefono").value = registro.telefono;
        document.getElementById("direccion").value = registro.direccion;
        document.getElementById("sede_id").value = registro.sede_id;
    }
}

const eliminarRegistroFarmacia = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta farmacia?")) {
        return;
    }

    await fetch(`${API_BASE_URL}/Farmacia/Eliminar?idFarmacia=${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            alert("Farmacia eliminada");
            cargarDatosFarmacia();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

window.onload = async () => {
    await cargarDatosFarmacia();
};

