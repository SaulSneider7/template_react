import { Link } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";

import './header.css'

function NavbarUsuario() {
    const auth = getAuth();
    //Funcion para cerrar sesion
    const cerrarSesion = async() => {
        await signOut(auth);
    }

    return (
        <header>
            <div className="container">
                <h1 className="logo">Bienvenido!!</h1>
                <nav>
                    <ul>
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/caracteristicas">Características</Link></li>
                        <li><Link to="/contacto">Contacto</Link></li>
                        <li><Link to="/peliculas">Peliculas</Link></li>
                        <li><Link to="/comunidad">Comunidad</Link></li>
                        <li><button onClick={cerrarSesion}>Cerrar sesion</button></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default NavbarUsuario;