import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";

function Comunidad() {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [foto, setFoto] = useState("");
    const [cargando, setCargando] = useState(true);

    const [nuevoNombre, setNuevoNombre] = useState("");
    const [nuevaFoto, setNuevaFoto] = useState("");

    const auth = getAuth();

    useEffect(()=>{
        
        const user = auth.currentUser;
        // Escucha si el usuario inicia o cierra sesión
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setEmail(user.email);
                setNombre(user.displayName || "Usuario sin nombre");
                setFoto(user.photoURL || "user.webp");

                setNuevoNombre(user.displayName || "");
                setNuevaFoto(user.photoURL || "");
            } else {
                setEmail("");
                setNombre("");
                setFoto("");
            }
            setCargando(false);
        });
        // Limpia la suscripción cuando el componente se desmonta
        return () => unsubscribe();
    }, []);

    //Funcion para editar mis datos
    const actualizarPerfil = async() => {
        const user = auth.currentUser;
        if (!user) return alert("No hay un usuario activo");
        await updateProfile(user,{
            displayName: nuevoNombre || user.displayName,
            photoURL: nuevaFoto || user.photoURL
        })
        alert("Perfil actualizado");
        setNombre(nuevoNombre);
        setFoto(nuevaFoto);
    }


    if (cargando) {
        return <p className="text-center mt-10 text-gray-500">Cargando datos...</p>;
    }
    
    return (
        <div className="p-8 text-center">
            <img className="w-20 h-20" src={foto} alt="" />
            <h1 className="text-3xl font-bold mb-4">Bienvenido a la comunidad</h1>
            <p className="text-lg">Hola, <strong>{nombre}</strong></p>
            <p className="text-gray-600">Tu correo: {email}</p>

            <hr className="my-6" />

            <h2>Formulario para editar mis datos</h2>
            <input 
                type="text" 
                placeholder="actualizar mi nombre" 
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}    
            />
            <input 
                type="text" 
                placeholder="actualizar mi foto" 
                value={nuevaFoto}
                onChange={(e) => setNuevaFoto(e.target.value)}
            />
            <button className="bg-blue-500 text-white font-bold mx-2 py-2 px-4 rounded" onClick={actualizarPerfil}>Actualizar perfil</button>

            <hr className="my-6" />
            <p className="text-gray-700">
                Aquí podrás interactuar con otros usuarios y compartir tus ideas.
            </p>
            
        </div>
    )
}
export default Comunidad;