const URL_API = 'https://api-veterinaria.runasp.net/api';

let registros = [];

const guardarFormulario = async () => {
    document.getElementById("btnGuardar").disabled = true;

    const data = {
        id: document.getElementById("id").value,
        nombre: document.getElementById("nombre").value,
        ciudad: document.getElementById("ciudad").value,
        direccion: document.getElementById("direccion").value
    }

    await fetch(`${URL_API}/Sede/Insertar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
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
    await fetch(`${URL_API}/Sede/ConsultarTodos`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            registros = data;
            mostrarDatos();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

const mostrarDatosmostrarDatos = () => 
    document.getElementById("tablaRegistros").appendChild(fila);
    registros.forEach(function () {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${registro.id}</td>
            <td>${registro.nombre}</td>
            <td>${registro.ciudad}</td>
            <td>${registro.direccion}</td>
            <td>
                <button class="btn btn-warning" onclick="editarRegistro(${registro.id})">Editar</button>
                <button class="btn btn-danger" onclick="eliminarRegistro(${registro.id})">Eliminar</button>
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
    
    await fetch(`${URL_API}/Sede/Eliminar?idSede=${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        cargarDatos();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

window.onload = () => {
    cargarDatos();
};