import {useState, useEffect} from "react";
import {getAuth} from "firebase/auth";
import {db} from "../firebase";

function Comunidad() {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [cargando, setCargando] = useState(true);

    useEffect(()=>{
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            setEmail(user.email);

            if (user.displayName) {
                setNombre(user.displayName);
                setCargando(false);
            }
        }
    }, []);
    
    return (
        <div>
            <h1>{nombre} Bienvenido a la Comunidad</h1>
            <p>Tu correo con el que ingresaste es: {email}</p>
            <hr />
            <p>.....</p>
        </div>
    )
}
export default Comunidad;