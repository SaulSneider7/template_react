import { useEffect, useRef, useState } from 'react'
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth'
import { db } from '../firebase'
import {
    collection,
    addDoc,
    onSnapshot,
    query,
    orderBy,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
} from 'firebase/firestore'

function Comunidad() {
    // usuario
    const [nombre, setNombre] = useState('')
    const [email, setEmail] = useState('')
    const [foto, setFoto] = useState('')
    const [uid, setUid] = useState('')
    const [cargando, setCargando] = useState(true)

    // editar perfil
    const [nuevoNombre, setNuevoNombre] = useState('')
    const [nuevaFoto, setNuevaFoto] = useState('')

    // posts
    const [contenidoPost, setContenidoPost] = useState('')
    const [posts, setPosts] = useState([])

    // editar post
    const [editandoID, setEditandoID] = useState(null)
    const [nuevoContenido, setNuevoContenido] = useState('')

    // comentarios por post
    const [comentariosPorPost, setComentariosPorPost] = useState({})
    const [inputComentarioPorPost, setInputComentarioPorPost] = useState({})

    const auth = getAuth()
    const comentariosUnsubsRef = useRef({}) // listeners de comentarios

    // formatear fecha
    const formatearFecha = (fecha) => {
        if (!fecha) return ''
        if (fecha.toDate) fecha = fecha.toDate()
        return fecha.toLocaleDateString('es-PE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    // detectar usuario
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUid(user.uid)
                setEmail(user.email)
                setNombre(user.displayName || 'Usuario sin nombre')
                setFoto(user.photoURL || '/user.webp')
                setNuevoNombre(user.displayName || '')
                setNuevaFoto(user.photoURL || '')
            } else {
                setUid('')
                setEmail('')
                setNombre('')
                setFoto('')
            }
            setCargando(false)
        })

        return () => unsubscribe()
    }, [])

    // escuchar posts
    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('fecha', 'desc'))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const lista = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
            setPosts(lista)
        })

        return () => unsubscribe()
    }, [])

    // escuchar comentarios por post
    useEffect(() => {
        posts.forEach((p) => {
            if (comentariosUnsubsRef.current[p.id]) return

            const q = query(
                collection(db, 'posts', p.id, 'comentarios'),
                orderBy('fecha', 'asc'),
            )
            const unsub = onSnapshot(q, (snap) => {
                const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
                setComentariosPorPost((prev) => ({ ...prev, [p.id]: lista }))
            })

            comentariosUnsubsRef.current[p.id] = unsub
        })

        return () => {
            Object.values(comentariosUnsubsRef.current).forEach((unsub) =>
                unsub(),
            )
        }
    }, [posts])

    // actualizar perfil
    const actualizarPerfil = async () => {
        const user = auth.currentUser
        if (!user) return alert('No hay un usuario activo')

        try {
            await updateProfile(user, {
                displayName: nuevoNombre || user.displayName,
                photoURL: nuevaFoto || user.photoURL,
            })

            alert('Perfil actualizado')
            setNombre(nuevoNombre || user.displayName)
            setFoto(nuevaFoto || user.photoURL)
        } catch (err) {
            console.error(err)
            alert('Error al actualizar: ' + err.message)
        }
    }

    // crear post
    const crearPost = async () => {
        if (contenidoPost.trim() === '') return
        await addDoc(collection(db, 'posts'), {
            contenido: contenidoPost,
            fecha: serverTimestamp(),
            autor: nombre,
            autorFoto: foto,
            autorUid: uid,
            likes: [],
        })
        setContenidoPost('')
    }

    // like
    const toggleLike = async (post) => {
        const ref = doc(db, 'posts', post.id)
        const actuales = post.likes || []
        const nuevos = actuales.includes(uid)
            ? actuales.filter((id) => id !== uid)
            : [...actuales, uid]
        await updateDoc(ref, { likes: nuevos })
    }

    // guardar edición post
    const guardarEdicion = async (id) => {
        await updateDoc(doc(db, 'posts', id), { contenido: nuevoContenido })
        setEditandoID(null)
    }

    // eliminar post
    const eliminarPost = async (id) => {
        if (!confirm('¿Eliminar este post?')) return
        await deleteDoc(doc(db, 'posts', id))
    }

    // agregar comentario
    const agregarComentario = async (postId) => {
        const texto = (inputComentarioPorPost[postId] || '').trim()
        if (!texto) return

        await addDoc(collection(db, 'posts', postId, 'comentarios'), {
            texto,
            autor: nombre,
            autorFoto: foto,
            autorUid: uid,
            fecha: serverTimestamp(),
        })

        setInputComentarioPorPost((prev) => ({ ...prev, [postId]: '' }))
    }

    // ⭐⭐⭐ EDITAR COMENTARIO ⭐⭐⭐
    const editarComentario = async (postId, comentario) => {
        const nuevoTexto = prompt('Editar comentario:', comentario.texto)
        if (!nuevoTexto || nuevoTexto.trim() === '') return

        await updateDoc(
            doc(db, 'posts', postId, 'comentarios', comentario.id),
            {
                texto: nuevoTexto,
            },
        )
    }

    // ⭐⭐⭐ ELIMINAR COMENTARIO ⭐⭐⭐
    const eliminarComentario = async (postId, comentario) => {
        if (!confirm('¿Eliminar comentario?')) return

        await deleteDoc(doc(db, 'posts', postId, 'comentarios', comentario.id))
    }

    if (cargando) return <p className="text-center mt-10">Cargando...</p>

    return (
        <div className="p-8 max-w-3xl mx-auto">
            {/* perfil */}
            <div className="text-center mb-8">
                <img
                    className="w-20 h-20 rounded-full mx-auto"
                    src={foto}
                    alt="foto"
                />
                <h1 className="text-3xl font-bold mt-3">
                    Bienvenido a la comunidad
                </h1>
                <p className="text-lg">
                    Hola, <strong>{nombre}</strong>
                </p>
                <p className="text-gray-600">{email}</p>
            </div>

            <hr className="my-6" />

            {/* editar perfil */}
            <h2 className="text-xl font-bold mb-2">Editar mis datos</h2>
            <input
                type="text"
                placeholder="Nuevo nombre"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                className="border p-2 rounded w-full mb-3"
            />
            <input
                type="text"
                placeholder="URL nueva foto"
                value={nuevaFoto}
                onChange={(e) => setNuevaFoto(e.target.value)}
                className="border p-2 rounded w-full mb-3"
            />
            <button
                className="bg-blue-600 text-white px-4 py-2 rounded w-full mb-6"
                onClick={actualizarPerfil}
            >
                Guardar cambios
            </button>

            <hr className="my-6" />

            {/* crear post */}
            <h2 className="text-xl font-bold mb-2">Crear publicación</h2>
            <textarea
                placeholder="¿Qué estás pensando?"
                value={contenidoPost}
                onChange={(e) => setContenidoPost(e.target.value)}
                className="w-full border p-3 rounded mb-3"
            />
            <button
                className="bg-green-600 text-white px-4 py-2 rounded w-full mb-6"
                onClick={crearPost}
            >
                Publicar
            </button>

            <hr className="my-6" />

            {/* posts */}
            <h2 className="text-xl font-bold mb-4">Publicaciones</h2>
            <div className="space-y-6">
                {posts.map((post) => {
                    const comentarios = comentariosPorPost[post.id] || []
                    const liked = (post.likes || []).includes(uid)

                    return (
                        <div
                            key={post.id}
                            className="bg-gray-100 p-4 rounded shadow"
                        >
                            {/* contenido del post */}
                            <div className="flex items-center gap-3">
                                <img
                                    src={post.autorFoto}
                                    className="w-10 h-10 rounded-full"
                                />
                                <div>
                                    <p className="font-semibold">
                                        {post.autor}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatearFecha(post.fecha)}
                                    </p>
                                </div>
                            </div>

                            {editandoID === post.id ? (
                                <>
                                    <textarea
                                        value={nuevoContenido}
                                        onChange={(e) =>
                                            setNuevoContenido(e.target.value)
                                        }
                                        className="w-full border p-2 rounded mt-3"
                                    />
                                    <button
                                        className="bg-blue-600 text-white px-3 py-1 rounded mt-2"
                                        onClick={() => guardarEdicion(post.id)}
                                    >
                                        Guardar
                                    </button>
                                    <button
                                        className="bg-gray-500 text-white px-3 py-1 rounded mt-2 ml-2"
                                        onClick={() => setEditandoID(null)}
                                    >
                                        Cancelar
                                    </button>
                                </>
                            ) : (
                                <p className="mt-3 text-gray-800">
                                    {post.contenido}
                                </p>
                            )}

                            <div className="flex gap-3 mt-3">
                                <button
                                    className={`px-3 py-1 rounded ${liked ? 'bg-red-500 text-white' : 'bg-gray-300'}`}
                                    onClick={() => toggleLike(post)}
                                >
                                    ❤️ {post.likes?.length || 0}
                                </button>

                                {post.autorUid === uid && (
                                    <>
                                        <button
                                            className="text-blue-600"
                                            onClick={() => {
                                                setEditandoID(post.id)
                                                setNuevoContenido(
                                                    post.contenido,
                                                )
                                            }}
                                        >
                                            Editar
                                        </button>

                                        <button
                                            className="text-red-600"
                                            onClick={() =>
                                                eliminarPost(post.id)
                                            }
                                        >
                                            Eliminar
                                        </button>
                                    </>
                                )}
                            </div>
                            {/* -------------------- COMENTARIOS ---------------------- */}
                            <div className="mt-4">
                                <h4 className="font-semibold mb-2">
                                    Comentarios ({comentarios.length})
                                </h4>

                                {comentarios.map((c) => (
                                    <div
                                        key={c.id}
                                        className="bg-white border p-2 rounded mb-2"
                                    >
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={
                                                    c.autorFoto || '/user.webp'
                                                }
                                                className="w-6 h-6 rounded-full"
                                            />
                                            <p className="font-semibold text-sm">
                                                {c.autor}
                                            </p>
                                            <p className="text-xs text-gray-500 ml-2">
                                                {formatearFecha(c.fecha)}
                                            </p>
                                        </div>

                                        <p className="ml-8 mt-1">{c.texto}</p>

                                        {/* botones solo si es mi comentario */}
                                        {c.autorUid === uid && (
                                            <div className="flex gap-2 mt-2 ml-8">
                                                <button
                                                    className="text-blue-600 text-sm"
                                                    onClick={() =>
                                                        editarComentario(
                                                            post.id,
                                                            c,
                                                        )
                                                    }
                                                >
                                                    Editar
                                                </button>

                                                <button
                                                    className="text-red-600 text-sm"
                                                    onClick={() =>
                                                        eliminarComentario(
                                                            post.id,
                                                            c,
                                                        )
                                                    }
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* input comentario */}
                                <textarea
                                    placeholder="Escribe un comentario..."
                                    value={
                                        inputComentarioPorPost[post.id] || ''
                                    }
                                    onChange={(e) =>
                                        setInputComentarioPorPost((prev) => ({
                                            ...prev,
                                            [post.id]: e.target.value,
                                        }))
                                    }
                                    className="w-full border p-2 rounded"
                                />

                                <button
                                    className="bg-green-600 text-white px-3 py-1 rounded mt-2"
                                    onClick={() => agregarComentario(post.id)}
                                >
                                    Comentar
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Comunidad
