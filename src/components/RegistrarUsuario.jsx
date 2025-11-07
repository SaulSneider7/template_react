import { useState } from "react"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";


function RegistrarUsuario() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //funcion registrar
  const registrar= async() => {
    const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log("Cuenta creada con exito");
            // onRegister(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("Error al registrar el usuario");
            console.log(errorCode);
            console.log(errorMessage);            
        });
  }

    return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Crear Cuenta
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
          className="w-full border border-gray-300 rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={ (e) => setPassword(e.target.value)}
        />

        <button
          onClick={registrar}
          className="w-full mt-3 bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition"
        >
          Registrarse
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          ¿Ya tienes una cuenta?
        </p>
      </div>
    </div>
  );
}

export default RegistrarUsuario;