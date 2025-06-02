const validarSesion = () => {
    if (!localStorage.getItem('token')) {
        localStorage.clear();
        if (window.location.pathname != '/Login') {
            window.location.href = '/Login';
        }
    }

    if (localStorage.getItem('usuario')) {
        const usuario = localStorage.getItem('usuario');
        document.getElementById('sesionMenu').innerHTML = `
            <li class="nav-item">
                <a class="nav-link text-dark" href="/Home">Panel</a>
            </li>
            <li class="nav-item">
                <a class="nav-link text-dark" href="/Login"><span class="text-uppercase">${usuario}</span> <small>(salir)</small></a>
            </li>`;
    } else {
        document.getElementById('sesionMenu').innerHTML = `
        <li class="nav-item">
            <a class="nav-link text-dark" asp-area="" asp-controller="Login" asp-action="Login">Login</a>
        </li>
        `;
    }
}

const cerrarSesion = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
}

validarSesion();