import { Link } from 'react-router-dom';

import './header.css'

function Header() {
    return (
        <header>
            <div className="container">
                <h1 className="logo">Mi Pagina</h1>
                <nav>
                    <ul>
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/caracteristicas">Características</Link></li>
                        <li><Link to="/contacto">Contacto</Link></li>
                        <li><Link to="/peliculas">Peliculas</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header;