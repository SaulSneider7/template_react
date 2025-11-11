import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Comunidad() {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [cargando, setCargando] = useState(true);

    useEffect(()=>{
        const auth = getAuth();
        const user = auth.currentUser;
        // Escucha si el usuario inicia o cierra sesión
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setEmail(user.email);
                setNombre(user.displayName || "Usuario sin nombre");
            } else {
                setEmail("");
                setNombre("");
            }
            setCargando(false);
        });
        // Limpia la suscripción cuando el componente se desmonta
        return () => unsubscribe();
    }, []);

    if (cargando) {
        return <p className="text-center mt-10 text-gray-500">Cargando datos...</p>;
    }
    
    return (
        <div className="p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Bienvenido a la comunidad</h1>
            <p className="text-lg">Hola, <strong>{nombre}</strong></p>
            <p className="text-gray-600">Tu correo: {email}</p>

            <hr className="my-6" />
            <p className="text-gray-700">
                Aquí podrás interactuar con otros usuarios y compartir tus ideas.
            </p>
        </div>
    )
}
export default Comunidad;