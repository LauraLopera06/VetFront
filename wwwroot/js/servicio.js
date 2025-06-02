class Servicio {
    constructor(id, fecha_ingreso, fecha_salida, mascota_id, empleado_id, consultorio_id, tipoServicio_id) {
        this.id = id || null;
        this.fecha_ingreso = fecha_ingreso || null;
        this.fecha_salida = fecha_salida || null;
        this.mascota_id = mascota_id || null;
        this.empleado_id = empleado_id || null;
        this.consultorio_id = consultorio_id || null;
        this.tipoServicio_id = tipoServicio_id || null;
    }
}

let servicio = new Servicio();
let registros = [];

const guardarFormulario = async () => {
    document.getElementById("btnGuardar").disabled = true;

    servicio = new Servicio(
        document.getElementById('id').value || null,
        document.getElementById('ingreso').value,
        document.getElementById('salida').value,
        document.getElementById('mascota_id').value,
        document.getElementById('empleado_id').value,
        document.getElementById('consultorio_id').value,
        document.getElementById('tipoServicio_id').value
    );

    if (servicio.id) {
        await actualizarRegistro(servicio);
    } else {
        await insertarRegistro(servicio);
    }
}

const actualizarRegistro = async (servicio) => {
    await fetch(`${API_BASE_URL}/Servicio/Actualizar?idServicio=${servicio.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(servicio)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            alert("Servicio actualizado correctamente");
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error al actualizar el servicio");
        })
        .finally(() => {
            document.getElementById("btnGuardar").disabled = false;
            cargarDatos();
        });
}

const insertarRegistro = async (servicio) => {
    await fetch(`${API_BASE_URL}/Servicio/Insertar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(servicio)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            alert("Servicio creado correctamente");
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error al crear el servicio");
        })
        .finally(() => {
            document.getElementById("btnGuardar").disabled = false;
            cargarDatos();
        });
}

const cargarDatos = async () => {
    registros = [];
    await fetch(`${API_BASE_URL}/Servicio/ConsultarTodos`, {
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
            console.log('Servicios consultados correctamente:', data);
            data.forEach(function (item) {
                registros.push(new Servicio(
                    item.id,
                    item.fecha_ingreso,
                    item.fecha_salida,
                    item.mascota_id,
                    item.empleado_id,
                    item.consultorio_id,
                    item.tipoServicio_id
                ));
            });
            mostrarDatos();
        })
        .catch(error => {
            console.error('Error consultando servicios:', error);
        });

    // Cargar tipos de servicio para el select
    await cargarTiposServicio();
}

const mostrarDatos = () => {
    document.getElementById("tablaRegistros").innerHTML = '';
    registros.forEach(function (registro) {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${registro.id}</td>
            <td>${formatDateTime(registro.fecha_ingreso)}</td>
            <td>${formatDateTime(registro.fecha_salida)}</td>
            <td>${registro.mascota_id}</td>
            <td>${registro.empleado_id}</td>
            <td>${registro.consultorio_id}</td>
            <td>${obtenerNombreTipoServicio(registro.tipoServicio_id)}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarRegistro(${registro.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarRegistro(${registro.id})">Eliminar</button>
            </td>
        `;
        document.getElementById("tablaRegistros").appendChild(fila);
    });
}

const editarRegistro = async (id) => {
    const registro = registros.find(r => r.id === id);
    if (registro) {
        document.getElementById("id").value = registro.id;
        document.getElementById("ingreso").value = formatDateTimeForInput(registro.fecha_ingreso);
        document.getElementById("salida").value = formatDateTimeForInput(registro.fecha_salida);
        document.getElementById("mascota_id").value = registro.mascota_id;
        document.getElementById("empleado_id").value = registro.empleado_id;
        document.getElementById("consultorio_id").value = registro.consultorio_id;
        document.getElementById("tipoServicio_id").value = registro.tipoServicio_id;

        // Hacer scroll al formulario
        document.querySelector('.card').scrollIntoView({ behavior: 'smooth' });
    }
}

const eliminarRegistro = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este servicio?")) {
        return;
    }

    await fetch(`${API_BASE_URL}/Servicio/Eliminar?idServicio=${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            alert("Servicio eliminado correctamente");
            cargarDatos();
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Error al eliminar el servicio");
        });
}

// Funciones auxiliares
async function cargarTiposServicio() {
    try {
        const response = await fetch(`${API_BASE_URL}/TipoServicio/ConsultarTodos`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Error al cargar los tipos de servicio');
        }

        const tiposServicio = await response.json();
        const select = document.getElementById('tipoServicio_id');
        select.innerHTML = '<option value="">Seleccione un tipo</option>';

        tiposServicio.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.id;
            option.textContent = tipo.nombre;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudieron cargar los tipos de servicio');
    }
}

function obtenerNombreTipoServicio(id) {
    const select = document.getElementById('tipoServicio_id');
    for (let i = 0; i < select.options.length; i++) {
        if (select.options[i].value == id) {
            return select.options[i].text;
        }
    }
    return id; // Si no se encuentra, devolver el ID
}

function formatDateTime(dateTimeString) {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleString();
}

function formatDateTimeForInput(dateTimeString) {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toISOString().slice(0, 16);
}

window.onload = async () => {
    await cargarDatos();
};