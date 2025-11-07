import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import NavbarUsuario from './navbarUsuario';
import NavbarVisitante from './navbarVisitante';

import './header.css'

function Header() {
    const [usuario, setUsuario] = useState(null);
    const auth = getAuth();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
        setUsuario(user);
        });
        return () => unsub();
    }, [auth]);

    if (usuario) {
        return <NavbarUsuario />;
    } else {
        return <NavbarVisitante />;
    }
}

export default Header;