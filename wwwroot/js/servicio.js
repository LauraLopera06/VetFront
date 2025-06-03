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

let servicioActual = new Servicio();
let registros = [];
let tiposServicio = [];
let mascotas = [];
let empleados = [];

// Cargar datos al iniciar
document.addEventListener('DOMContentLoaded', async () => {
    await cargarDatosAdicionales();
    await cargarTiposServicio();
    await cargarDatos();
});

// Función para cargar tipos de servicio
async function cargarTiposServicio() {
    try {
        const response = await fetch(`${API_BASE_URL}/TipoServicio/ConsultarTodos`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Error al cargar tipos de servicio');

        tiposServicio = await response.json();
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
        document.getElementById('tipoServicio_id').innerHTML = '<option value="">Error al cargar tipos</option>';
    }
}

// Función para cargar todos los registros
async function cargarDatos() {
    try {
        const response = await fetch(`${API_BASE_URL}/Servicio/ConsultarTodos`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Error al cargar servicios');

        registros = await response.json();
        mostrarDatos();
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('tablaRegistros').innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-danger py-4">
                    Error al cargar los servicios
                </td>
            </tr>
        `;
    }
}

async function cargarDatosAdicionales() {
    try {
        // Cargar mascotas
        const responseMascotas = await fetch(`${API_BASE_URL}/Mascota/ConsultarTodos`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        mascotas = await responseMascotas.json();

        // Cargar empleados
        const responseEmpleados = await fetch(`${API_BASE_URL}/Empleado/ConsultarTodos`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        empleado = await responseEmpleados.json();
    } catch (error) {
        console.error('Error cargando datos adicionales:', error);
    }
}

// Mostrar datos en la tabla
function mostrarDatos() {
    const tbody = document.getElementById('tablaRegistros');

    if (registros.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted py-4">
                    No hay servicios registrados
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = '';

    registros.forEach(servicio => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${servicio.id}</td>
            <td>${formatearFecha(servicio.fecha_ingreso)}</td>
            <td>${formatearFecha(servicio.fecha_salida)}</td>
            <td>${servicio.mascota_id} - ${obtenerNombreMascota(servicio.mascota_id)}</td>
            <td>${servicio.empleado_id} - ${obtenerNombreEmpleado(servicio.empleado_id)}</td>
            <td>${servicio.consultorio_id}</td>
            <td>${obtenerNombreTipoServicio(servicio.tipoServicio_id)}</td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editarServicio(${servicio.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="confirmarEliminar(${servicio.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Funciones auxiliares
function formatearFecha(fecha) {
    if (!fecha) return '';
    return new Date(fecha).toLocaleString();
}

function obtenerNombreTipoServicio(id) {
    const tipo = tiposServicio.find(t => t.id == id);
    return tipo ? tipo.nombre : id;
}

function obtenerNombreMascota(id) {
    const mascota = mascotas.find(m => m.id == id);
    return mascota ? mascota.nombre : `Mascota ${id}`;
}

function obtenerNombreEmpleado(id) {
    const empleado = empleados.find(e => e.id == id);
    return empleado ? `${empleado.nombre}`.trim() : `Empleado ${id}`;
}

// Funciones del formulario
function limpiarFormulario() {
    document.getElementById('formServicio').reset();
    document.getElementById('id').value = '';
    servicioActual = new Servicio();
    document.getElementById('fecha_ingreso').focus();
}

async function editarServicio(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/Servicio/ConsultarXId?id=${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Error al cargar servicio');

        const servicio = await response.json();
        servicioActual = servicio;

        // Llenar formulario
        document.getElementById('id').value = servicio.id;
        document.getElementById('fecha_ingreso').value = servicio.fecha_ingreso.slice(0, 16);
        document.getElementById('fecha_salida').value = servicio.fecha_salida.slice(0, 16);
        document.getElementById('mascota_id').value = servicio.mascota_id;
        document.getElementById('empleado_id').value = servicio.empleado_id;
        document.getElementById('consultorio_id').value = servicio.consultorio_id;
        document.getElementById('tipoServicio_id').value = servicio.tipoServicio_id;

        // Hacer scroll al formulario
        document.getElementById('formServicio').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar servicio para edición');
    }
}

// Función principal que decide si guardar o actualizar
const guardarFormulario = async () => {
    document.getElementById("btnGuardar").disabled = true;
    document.getElementById("btnGuardar").innerHTML = '<i class="fas fa-spinner fa-spin"></i> Guardando...';

    try {
        // Crear objeto servicio
        const servicio = new Servicio(
            document.getElementById('id').value || null,
            document.getElementById('fecha_ingreso').value,
            document.getElementById('fecha_salida').value,
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
    } catch (error) {
        console.error('Error en guardarFormulario:', error);
        alert('Error al procesar el formulario: ' + error.message);
    }
}

// Función para insertar nuevo registro
const insertarRegistro = async (servicio) => {
    await fetch(`${API_BASE_URL}/Servicio/Insertar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(servicio)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            console.log('Servicio creado:', data);
            alert('Servicio creado correctamente');
            limpiarFormulario();
        })
        .catch(error => {
            console.error('Error al insertar:', error);
            alert('Error al crear servicio: ' + error.message);
        })
        .finally(() => {
            document.getElementById("btnGuardar").disabled = false;
            document.getElementById("btnGuardar").innerHTML = '<i class="fas fa-save"></i> Guardar';
            cargarDatos();
        });
}

// Función para actualizar registro existente
const actualizarRegistro = async (servicio) => {
    await fetch(`${API_BASE_URL}/Servicio/Actualizar?id=${servicio.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(servicio)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            return response.json();
        })
        .then(data => {
            console.log('Servicio actualizado:', data);
            alert('Servicio actualizado correctamente');
            limpiarFormulario();
        })
        .catch(error => {
            console.error('Error al actualizar:', error);
            alert('Error al actualizar servicio: ' + error.message);
        })
        .finally(() => {
            document.getElementById("btnGuardar").disabled = false;
            document.getElementById("btnGuardar").innerHTML = '<i class="fas fa-save"></i> Guardar';
            cargarDatos();
        });
}

async function confirmarEliminar(id) {
    if (!confirm('¿Está seguro de eliminar este servicio?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/Servicio/Eliminar?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error('Error al eliminar servicio');

        alert('Servicio eliminado correctamente');
        await cargarDatos();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar servicio: ' + error.message);
    }
}