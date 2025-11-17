import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import { db } from "../firebase";
import {collection,addDoc,onSnapshot,query,orderBy,updateDoc,deleteDoc,doc} from "firebase/firestore";

function Comunidad() {
    // Estados del usuario logueado
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [foto, setFoto] = useState("");
    const [uid, setUid] = useState("");
    const [cargando, setCargando] = useState(true);

    // Formulario para editar perfil
    const [nuevoNombre, setNuevoNombre] = useState("");
    const [nuevaFoto, setNuevaFoto] = useState("");

    // Crear posts
    const [contenidoPost, setContenidoPost] = useState("");
    const [posts, setPosts] = useState([]);

    // Editar posts
    const [editandoID, setEditandoID] = useState(null);
    const [nuevoContenido, setNuevoContenido] = useState("");

    const auth = getAuth();

    // Funcion para formatear la fecha de Firestore
    const formatearFecha = (fecha) => {
        if (!fecha) return "";
        const d = fecha.toDate();
        return d.toLocaleDateString("es-PE", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    // Recuperar datos del usuario autenticado en Firebase
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUid(user.uid);
                setEmail(user.email);
                setNombre(user.displayName || "Usuario sin nombre");
                setFoto(user.photoURL || "user.webp");

                // Rellenar los inputs del formulario
                setNuevoNombre(user.displayName || "");
                setNuevaFoto(user.photoURL || "");
            } else {
                // Si no hay usuario
                setUid("");
                setEmail("");
                setNombre("");
                setFoto("");
            }
            setCargando(false);
        });
        return () => unsubscribe(); // limpiar listener
    }, []);

    // Escuchar cambios en los posts en tiempo real desde Firestore
    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("fecha", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const lista = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setPosts(lista); // actualizar posts en pantalla
        });
        return () => unsubscribe();
    }, []);

    // Actualizar información del usuario (nombre y foto)
    const actualizarPerfil = async () => {
        const user = auth.currentUser;
        if (!user) return alert("No hay un usuario activo");

        await updateProfile(user, {
            displayName: nuevoNombre || user.displayName,
            photoURL: nuevaFoto || user.photoURL
        });

        alert("Perfil actualizado");

        // Actualizar en pantalla
        setNombre(nuevoNombre);
        setFoto(nuevaFoto);
    };

    // Crear un nuevo post en Firestore
    const crearPost = async () => {
        if (contenidoPost.trim() === "") return;

        await addDoc(collection(db, "posts"), {
            contenido: contenidoPost,
            fecha: new Date(),
            autor: nombre,
            autorFoto: foto,
            autorUid: uid
        });

        setContenidoPost(""); // limpiar textarea
    };

    // Guardar edición del contenido de un post
    const guardarEdicion = async (id) => {
        await updateDoc(doc(db, "posts", id), {
            contenido: nuevoContenido
        });

        setEditandoID(null);
        setNuevoContenido("");
    };

    // Eliminar un post
    const eliminarPost = async (id) => {
        if (confirm("¿Deseas eliminar este post?")) {
            await deleteDoc(doc(db, "posts", id));
        }
    };

    if (cargando) {
        return <p>Cargando datos...</p>;
    }

    return (
        <div>
            {/* Información del usuario */}
            <div>
                <img src={foto} alt="foto" className="w-12 h-12 rounded-full" />
                <h1>Bienvenido a la comunidad</h1>
                <p>Hola, <strong>{nombre}</strong></p>
                <p>{email}</p>
            </div>

            <hr />

            {/* Formulario para editar perfil */}
            <h2>Editar mis datos</h2>

            <input
                type="text"
                placeholder="Actualizar nombre"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
            />

            <input
                type="text"
                placeholder="URL de nueva foto"
                value={nuevaFoto}
                onChange={(e) => setNuevaFoto(e.target.value)}
            />

            <button onClick={actualizarPerfil}>Guardar cambios</button>

            <hr />

            {/* Crear post */}
            <h2>Crear una publicación</h2>

            <textarea
                placeholder="¿Qué estás pensando?"
                value={contenidoPost}
                onChange={(e) => setContenidoPost(e.target.value)}
            ></textarea>

            <button onClick={crearPost}>Publicar</button>

            <hr />

            {/* Listado de publicaciones */}
            <h2>Publicaciones</h2>

            <div>
                {posts.map((post) => (
                    <div key={post.id}>

                        {/* Información del autor */}
                        <div>
                            <img src={post.autorFoto} className="w-10 h-10" />
                            <div>
                                <p>{post.autor}</p>
                                <p>{formatearFecha(post.fecha)}</p>
                            </div>
                        </div>

                        {/* Modo edición o modo lectura */}
                        {editandoID === post.id ? (
                            <div>
                                <textarea
                                    value={nuevoContenido}
                                    onChange={(e) => setNuevoContenido(e.target.value)}
                                />
                                <button onClick={() => guardarEdicion(post.id)}>Guardar</button>
                                <button onClick={() => setEditandoID(null)}>Cancelar</button>
                            </div>
                        ) : (
                            <p>{post.contenido}</p>
                        )}

                        {/* Botones solo para el autor del post */}
                        {post.autorUid === uid && editandoID !== post.id && (
                            <div>
                                <button
                                    onClick={() => {
                                        setEditandoID(post.id);
                                        setNuevoContenido(post.contenido);
                                    }}
                                >
                                    Editar
                                </button>

                                <button onClick={() => eliminarPost(post.id)}>Eliminar</button>
                            </div>
                        )}

                    </div>
                ))}
            </div>
        </div>
    );
}

export default Comunidad;
