import { getAuth } from "firebase/auth";
import app from "../firebase";
import { Navigate } from "react-router-dom";

function RutaPrivada({ children }) {
    const auth = getAuth(app);
    const user = auth.currentUser;

    // Si no existe un usuario
    if (!user) {
        return <Navigate to="/iniciar-sesion" />
    }
    return children;
}
export default RutaPrivada;
