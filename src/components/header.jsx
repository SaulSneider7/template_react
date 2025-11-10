import { Link } from 'react-router-dom';

import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import app from '../firebase'; 

import NavbarUsuario from './navbarUsuario';
import NavbarVisitante from './navbarVisitante';

function Header() {
    const [usuario, setUsuario] = useState(null)

    useEffect(()=>{
        const auth = getAuth(app);

        //Detectar usuario
        const unsubscribe = onAuthStateChanged(auth, (user)=>{
            if (user) {
                setUsuario(user)
            } else {
                setUsuario(null)
            }
        });
        return () => unsubscribe();
    },[]);

    //Navbar dinamico
    if (usuario) {
        return <NavbarUsuario />
    }else{
        return <NavbarVisitante />
    }
}

export default Header;