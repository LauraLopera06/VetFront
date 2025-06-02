class Medicamento {
    constructor(id, nombre, tipo, precio, proveedor_id, proveedor_name) {
        this.id = id || null;
        this.nombre = nombre || null;
        this.tipo = tipo || null;
        this.precio = precio || null;
        this.proveedor_id = proveedor_id || null;
        this.proveedor_name = proveedor_name || null;
    }
}

let medicamento = new Medicamento();
let registros = [];

const guardarFormulario = async () => {
    document.getElementById("btnGuardar").disabled = true;

    medicamento = new Medicamento(
        document.getElementById('id').value,
        document.getElementById('nombre').value,
        document.getElementById('tipo').value,
        document.getElementById('precio').value,
        document.getElementById('proveedor_id').value
    );

    if (medicamento.id) {
        await actualizarRegistro(medicamento);
    } else {
        await insertarRegistro(medicamento);
    }
}

const actualizarRegistro = async (medicamento) => {
    await fetch(`${API_BASE_URL}/Medicamento/Actualizar?idMedicamento=${medicamento.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(medicamento)
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

const insertarRegistro = async (medicamento) => {
    await fetch(`${API_BASE_URL}/Medicamento/Insertar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(medicamento)
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
    fetch(`${API_BASE_URL}/Medicamento/ConsultarTodos`, {
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
        console.log('Medicamentos consultadas correctamente:', data);
        data.forEach(function (item) {
            registros.push(new Medicamento(
                item.id,
                item.nombre,
                item.tipo,
                item.precio,
                item.proveedor_id,
                item.Proveedor.nombre
            ));
        });
        mostrarDatos();
    })
    .catch(error => {
        console.error('Error consultando medicamento:', error);
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
            <td>${registro.precio}</td>
            <td>${registro.proveedor_name}</td>
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
        document.getElementById("precio").value = registro.precio;
        document.getElementById("proveedor_id").value = registro.proveedor_id;
    }
}

const eliminarRegistro = async (id) => {

    if (!confirm("¿Estás seguro de que deseas eliminar este registro?")) {
        return;
    }
    
    await fetch(`${API_BASE_URL}/Medicamento/Eliminar?idMedicamento=${id}`, {
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

const cargarProveedores = async () => {
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

        if (data.length) {
            let opciones = '<option value="">Seleccione un proveedor</option>';
            data.forEach(function (item) {
                opciones += `<option value="${item.id}">${item.nombre}</option>`;
            });

            document.getElementById('proveedor_id').innerHTML = opciones;
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