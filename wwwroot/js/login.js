function manejarLogin(event) {
    event.preventDefault();

    const data = {
        Usuario: document.getElementById("usuario").value,
        Clave: document.getElementById("contrasena").value
    }
    fetch(`${API_BASE_URL}/Login/Login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.status !== 200) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(response => {

            if (Array.isArray(response)) {
                response = response[0];
            }

            if (response.Autenticado !== true) {
                throw new Error('Credenciales incorrectas');
            }
            console.log('Login exitoso:', response);
            localStorage.setItem('token', response.Token);
            localStorage.setItem('usuario', response.Usuario);
            localStorage.setItem('PaginaInicio', response.PaginaInicio);
            window.location.href = response.PaginaInicio;
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error);
        })
}