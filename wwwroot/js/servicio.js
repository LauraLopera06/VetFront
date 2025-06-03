class Servicio {
    constructor(id, fecha_ingreso, fecha_salida, mascota_id, empleado_id, empleado_nombre, consultorio_id, tipoServicio_id, tipoServicio_nombre) {
        this.id = id || null;
        this.fecha_ingreso = fecha_ingreso || null;
        this.fecha_salida = fecha_salida || null;
        this.mascota_id = mascota_id || null;
        this.empleado_id = empleado_id || null;
        this.empleado_nombre = empleado_nombre || null;
        this.consultorio_id = consultorio_id || null;
        this.tipoServicio_id = tipoServicio_id || null;
        this.tipoServicio_nombre = tipoServicio_nombre || null;
    }
}

let servicio = new Servicio();
let registros = [];

const guardarFormulario = async () => {
    document.getElementById("btnGuardar").disabled = true;

    const toSqlDate = (datetimeStr) => {
        if (!datetimeStr) return null;
        const date = new Date(datetimeStr);
        return date.toISOString().split('T')[0];
    };

    servicio = new Servicio(
        document.getElementById('id').value,
        toSqlDate(document.getElementById('fecha_ingreso').value),
        toSqlDate(document.getElementById('fecha_salida').value),
        document.getElementById('mascota_id').value,
        document.getElementById('empleado_id').value,
        document.getElementById('consultorio_id').value,
        document.getElementById('tipoServicio_id').value,
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
        })
        .catch(error => {
            console.error('Error:', error);
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
    fetch(`${API_BASE_URL}/Servicio/ConsultarTodos`, {
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
            console.log('Servicios consultadas correctamente:', data);
            data.forEach(function (item) {
                registros.push(new Servicio(
                    item.id,
                    item.fecha_ingreso,
                    item.fecha_salida,
                    item.mascota_id,
                    item.empleado_id,
                    item.Empleado.nombre,
                    item.consultorio_id,
                    item.tipoServicio_id,
                    item.TipoServicio.nombre
                ));
            });
            mostrarDatos();
        })
        .catch(error => {
            console.error('Error consultando servicios:', error);
        });
}

const mostrarDatos = () => {

    document.getElementById("tablaRegistros").innerHTML = '';
    registros.forEach(function (registro) {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${registro.id}</td>
            <td>${registro.fecha_ingreso}</td>
            <td>${registro.fecha_salida}</td>
            <td>${registro.mascota_id}</td>
            <td>${registro.empleado_nombre}</td>
            <td>${registro.consultorio_id}</td>
            <td>${registro.tipoServicio_nombre}</td>
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
        document.getElementById("fecha_ingreso").value = registro.fecha_ingreso;
        document.getElementById("fecha_salida").value = registro.fecha_salida;
        document.getElementById("mascota_id").value = registro.mascota_id;
        document.getElementById("empleado_id").value = registro.empleado_id;
        document.getElementById("consultorio_id").value = registro.consultorio_id;
        document.getElementById("tipoServicio_id").value = registro.tipoServicio_id;
    }
}

const eliminarRegistro = async (id) => {

    if (!confirm("¿Estás seguro de que deseas eliminar este registro?")) {
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
            alert("Eliminado");
            cargarDatos();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

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
}

const cargarTipoServicios = async () => {
    registros = [];
    fetch(`${API_BASE_URL}/TipoServicio/ConsultarTodos`, {
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
                let opciones = '<option value="">Seleccione un tipo de servicio</option>';
                data.forEach(function (item) {
                    opciones += `<option value="${item.id}">${item.nombre}</option>`;
                });

                document.getElementById('tipoServicio_id').innerHTML = opciones;
            }
        })
        .catch(error => {
            console.error('Error consultando tipo de servicio:', error);
        });
}


window.onload = async () => {
    await cargarDatos();
    await cargarTipoServicios();
    await cargarEmpleados();
};