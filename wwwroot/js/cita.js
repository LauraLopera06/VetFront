class Cita {
    constructor(id, fecha, motivo, mascota_id, empleado_id, sede_id) {
        this.id = id || null;
        this.fecha = fecha || null;
        this.motivo = motivo || null;
        this.mascota_id = mascota_id || null;
        this.empleado_id = empleado_id || null;
        this.sede_id = sede_id || null;
    }
}

let cita = new Cita();
let registros = [];

const verificarDisponibilidad = async (empleado_id, fecha, cita_id = null) => {
    const response = await fetch(`${API_BASE_URL}/Cita/ConsultarPorEmpleadoYFecha?empleadoId=${empleado_id}&fecha=${fecha}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    const citas = await response.json();

    if (cita_id) {
        return citas.filter(c => c.id !== cita_id).length === 0;
    }

    return citas.length === 0;
};

const guardarFormulario = async () => {
    document.getElementById("btnGuardar").disabled = true;

    const id = document.getElementById('id').value;
    const fecha = document.getElementById('fecha').value;
    const empleado_id = document.getElementById('empleado_id').value;

    // Verificar disponibilidad
    const disponible = await verificarDisponibilidad(empleado_id, fecha, id || null);

    if (!disponible) {
        alert('El empleado seleccionado ya tiene una cita asignada en esta fecha. Por favor, elija otra fecha u otro empleado.');
        document.getElementById("btnGuardar").disabled = false;
        return;
    }

    cita = new Cita(
        id,
        fecha,
        document.getElementById('motivo').value,
        document.getElementById('mascota_id').value,
        empleado_id,
        document.getElementById('sede_id').value
    );

    if (cita.id) {
        await actualizarRegistro(cita);
    } else {
        await insertarRegistro(cita);
    }
}

const actualizarRegistro = async (cita) => {
    await fetch(`${API_BASE_URL}/Cita/Actualizar?idCita=${cita.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cita)
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

const insertarRegistro = async (cita) => {
    await fetch(`${API_BASE_URL}/Cita/Insertar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cita)
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
    fetch(`${API_BASE_URL}/Cita/ConsultarTodos`, {
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
            console.log('Citas consultadas correctamente:', data);
            data.forEach(function (item) {
                registros.push(new Cita(
                    item.id,
                    item.fecha,
                    item.motivo,
                    item.mascota_id,
                    item.empleado_id,
                    item.sede_id
                ));
            });
            mostrarDatos();
        })
        .catch(error => {
            console.error('Error consultando citas:', error);
        });
}

const mostrarDatos = () => {
    const tabla = document.getElementById("tablaCronograma");
    tabla.innerHTML = '';

    // Ordenar citas por fecha
    registros.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    // Agrupar por fecha
    const citasPorFecha = {};
    registros.forEach(registro => {
        const fecha = new Date(registro.fecha).toLocaleDateString();
        if (!citasPorFecha[fecha]) {
            citasPorFecha[fecha] = [];
        }
        citasPorFecha[fecha].push(registro);
    });

    for (const fecha in citasPorFecha) {
        const fechaRow = document.createElement("tr");
        fechaRow.className = "table-primary";
        fechaRow.innerHTML = `<th colspan="7">${fecha}</th>`;
        tabla.appendChild(fechaRow);

        citasPorFecha[fecha].forEach(registro => {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${registro.id}</td>
                <td>${new Date(registro.fecha).toLocaleTimeString()}</td>
                <td>${registro.motivo}</td>
                <td>${registro.mascota_id}</td>
                <td>${getNombreEmpleado(registro.empleado_id)}</td>
                <td>${getNombreSede(registro.sede_id)}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editarRegistro(${registro.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarRegistro(${registro.id})">Eliminar</button>
                </td>
            `;
            tabla.appendChild(fila);
        });
    }

    if (registros.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4">No hay citas programadas</td>
            </tr>
        `;
    }
}

const editarRegistro = async (id) => {
    const registro = registros.find(r => r.id === id);
    if (registro) {
        document.getElementById("id").value = registro.id;
        document.getElementById("fecha").value = registro.fecha;
        document.getElementById("motivo").value = registro.motivo;
        document.getElementById("mascota_id").value = registro.mascota_id;
        document.getElementById("empleado_id").value = registro.empleado_id;
        document.getElementById("sede_id").value = registro.sede_id;

        document.getElementById('formServicio').scrollIntoView({ behavior: 'smooth' });
    }
}

const eliminarRegistro = async (id) => {

    if (!confirm("¿Estás seguro de que deseas eliminar este registro?")) {
        return;
    }

    await fetch(`${API_BASE_URL}/Cita/Eliminar?idCita=${id}`, {
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

let empleadosCache = [];
let sedesCache = [];

const cargarEmpleados = async () => {
    registros = [];
    fetch(`${API_BASE_URL}/Empleado/ConsultarTodos`, {
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
                let opciones = '<option value="">Seleccione un empleado</option>';
                data.forEach(function (item) {
                    opciones += `<option value="${item.id}">${item.nombre}</option>`;
                });

                document.getElementById('empleado_id').innerHTML = opciones;
            }
        })
        .catch(error => {
            console.error('Error consultando empleado:', error);
        });
    empleadosCache = data;
}

const cargarSedes = async () => {
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
    sedesCache = data;
}

const getNombreEmpleado = (id) => {
    const empleado = empleadosCache.find(e => e.id == id);
    return empleado ? empleado.nombre : id;
}

const getNombreSede = (id) => {
    const sede = sedesCache.find(s => s.id == id);
    return sede ? sede.nombre : id;
}

window.onload = async () => {
    await cargarDatosFarmacia();
    await cargarEmpleados();
    await cargarSedes();
};