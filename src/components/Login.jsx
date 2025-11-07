import { useState } from "react";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

//Proveedor de Google
const provider = new GoogleAuthProvider();


function Login() {
  //Iniciar sesion con email y password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //--------------------------------------------------
  const navigate = useNavigate();

  //funcion para iniciar con correo y contraseña
  const iniciarSesion = async() => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log("Se inicio sesion");
            navigate("/");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Error al iniciar sesion");
        });
    }
    //--------------------------------------------------

    const iniciarSesionGoogle = () => {
        // Documentacion de Firebase
        const auth = getAuth();
        signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            console.log("Iniciaste sesion con Google");
            navigate("/");
            
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.log("Error al iniciar con Google");
            console.log(error);
        });
    }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Iniciar Sesión
        </h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full border border-gray-300 rounded-md p-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={iniciarSesion}
          className="w-full mt-3 bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
        >
          Ingresar
        </button>

        <button
          className="w-full flex mt-3 items-center justify-center border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition"
          onClick={iniciarSesionGoogle}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          <span className="text-gray-700 font-medium">
            Ingresar con Google
          </span>
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          ¿No tienes una cuenta?
        </p>
        <button
          className="w-full border border-blue-600 text-blue-600 py-2 rounded-md mt-2 hover:bg-blue-50 transition"
        >
          Crear cuenta
        </button>
      </div>
    </div>
  );
}

export default Login;
