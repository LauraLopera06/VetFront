class Consultorio {
    constructor(id, nombre, sede_id, sede_nombre) {
        this.id = id || null;
        this.nombre = nombre || null;
        this.sede_id = sede_id || null;
        this.sede_nombre = sede_nombre || null;
    }
}

let consultorio = new Consultorio();
let registros = [];

const guardarFormulario = async () => {
    document.getElementById("btnGuardar").disabled = true;

    consultorio = new Consultorio(
        document.getElementById('id').value,
        document.getElementById('nombre').value,
        document.getElementById('sede_id').value
    );

    if (consultorio.id) {
        await actualizarRegistro(consultorio);
    } else {
        await insertarRegistro(consultorio);
    }
};

const actualizarRegistro = async (consultorio) => {
    await fetch(`${API_BASE_URL}/Consultorio/Actualizar?idConsultorio=${consultorio.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(consultorio)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error al actualizar:', error);
        })
        .finally(() => {
            document.getElementById("btnGuardar").disabled = false;
            cargarDatos();
        });
};

const insertarRegistro = async (consultorio) => {
    await fetch(`${API_BASE_URL}/Consultorio/Insertar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(consultorio)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error al insertar:', error);
        })
        .finally(() => {
            document.getElementById("btnGuardar").disabled = false;
            cargarDatos();
        });
};

const cargarDatos = async () => {
    registros = [];
    fetch(`${API_BASE_URL}/Consultorio/ConsultarTodos`, {
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
            console.log('Consultorios cargados:', data);
            data.forEach(item => {
                registros.push(new Consultorio(
                    item.id,
                    item.nombre,
                    item.sede_id,
                    item.Sede.nombre
                ));
            });
            mostrarDatos();
        })
        .catch(error => {
            console.error('Error al cargar consultorios:', error);
        });
};

const mostrarDatos = () => {
    document.getElementById("tablaRegistros").innerHTML = '';
    registros.forEach(registro => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${registro.id}</td>
            <td>${registro.nombre}</td>
            <td>${registro.sede_nombre}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarRegistro(${registro.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarRegistro(${registro.id})">Eliminar</button>
            </td>
        `;
        document.getElementById("tablaRegistros").appendChild(fila);
    });
};

const editarRegistro = (id) => {
    const registro = registros.find(r => r.id == id);
    if (registro) {
        document.getElementById("id").value = registro.id;
        document.getElementById("nombre").value = registro.nombre;
        document.getElementById("sede_id").value = registro.sede_id;
    }
};

const eliminarRegistro = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este consultorio?")) {
        return;
    }

    await fetch(`${API_BASE_URL}/Consultorio/Eliminar?idConsultorio=${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            alert("Eliminado correctamente");
            cargarDatos();
        })
        .catch(error => {
            console.error('Error al eliminar:', error);
        });
};

const cargarProveedores = async () => {
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

            if (data.length) {
                let opciones = '<option value="">Seleccione una sede</option>';
                data.forEach(function (item) {
                    opciones += `<option value="${item.id}">${item.nombre}</option>`;
                });

                document.getElementById('sede_id').innerHTML = opciones;
            }
        })
        .catch(error => {
            console.error('Error consultando medicamento:', error);
        });
}

window.onload = async () => {
    await cargarDatos();
    await cargarProveedores();
};

