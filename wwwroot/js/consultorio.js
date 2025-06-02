class Consultorio {
    constructor(id, nombre, sede_id) {
        this.id = id || null;
        this.nombre = nombre || null;
        this.sede_id = sede_id || null;

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
}

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
            console.error('Error:', error);
        })
        .finally(() => {
            document.getElementById("btnGuardar").disabled = false;
            cargarDatos();
        });
}

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
            console.error('Error:', error);
        })
        .finally(() => {
            document.getElementById("btnGuardar").disabled = false;
            cargarDatos();
        });
}

const cargarDatos = async () => {
    registros = [];
    // Primero cargamos las sedes para llenar el dropdown
    const sedesResponse = await fetch(`${API_BASE_URL}/Sede/ConsultarTodos`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (sedesResponse.ok) {
        const sedes = await sedesResponse.json();
        llenarDropdownSedes(sedes);
    } else {
        console.error("Error cargando sedes");
    }

    // Luego cargamos los consultorios
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
            console.log('Consultorios consultados correctamente:', data);
            data.forEach(function (item) {
                registros.push(new Consultorio(
                    item.id,
                    item.nombre,
                    item.sede_id,
                    item.nombre_sede // asumiendo que la API retorna también el nombre de la sede para mostrarlo
                ));
            });
            mostrarDatos();
        })
        .catch(error => {
            console.error('Error consultando consultorios:', error);
        });
}

const llenarDropdownSedes = (sedes) => {
    const select = document.getElementById('sede_id');
    select.innerHTML = '<option value="">Seleccione una sede</option>';
    sedes.forEach(sede => {
        const option = document.createElement('option');
        option.value = sede.id;
        option.textContent = sede.nombre;
        select.appendChild(option);
    });
}

const mostrarDatos = () => {
    const tabla = document.getElementById("tablaRegistrosConsultorio");
    tabla.innerHTML = '';

    registros.forEach(function (registro) {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${registro.id}</td>
            <td>${registro.nombre}</td>
            <td>${registro.nombre_sede || ''}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editarRegistroConsultorio(${registro.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="eliminarRegistroConsultorio(${registro.id})">Eliminar</button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

const editarRegistro = async (id) => {
    const registro = registros.find(r => r.id === id);
    if (registro) {
        document.getElementById("id").value = registro.id;
        document.getElementById("nombre").value = registro.nombre;
        document.getElementById("sede_id").value = registro.sede_id;
    }
}

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
            alert("Consultorio eliminado");
            cargarDatos();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

window.onload = async () => {
    await cargarDatos();
};
