import { Link } from 'react-router-dom';

import NavbarUsuario from './navbarUsuario';
import NavbarVisitante from './navbarVisitante';

function Header() {
    return (
        <>
            <NavbarVisitante />
            <NavbarUsuario />
        </>
    )
}

export default Header;