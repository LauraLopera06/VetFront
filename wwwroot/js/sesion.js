const validarSesion = () => {
    if (!localStorage.getItem('token')) {
        localStorage.clear();
        if (window.location.pathname != '/Login') {
            window.location.href = '/Login';
        }
    }
}

const cerrarSesion = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
}

validarSesion();