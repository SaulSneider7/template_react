// npm install react-router-dom
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Header from "./components/header";
import Hero from "./components/hero";
import Contenido from "./components/contenido";
import Footer from "./components/footer";
//firebase
import app from "./firebase";


// Mis paginas
import Caracteristicas from "./pages/caracteristicas";
import Contacto from "./pages/contacto";
import ListaPeliculas from "./components/peliculas";
import Comunidad from "./components/comunidad";
import RutaPrivada from "./components/rutaprivada";

import Login from "./components/Login";
import RegistrarUsuario from "./components/RegistrarUsuario";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Hero />
        <Routes>
          <Route path="/" element={<Contenido />} />
          <Route path="/caracteristicas" element={<Caracteristicas />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/peliculas" element={<ListaPeliculas />} />
          <Route path="/prueba" element={
              <>
                <Login />
                <RegistrarUsuario />
              </>
            } />
          <Route path="/iniciar-sesion" element={<Login />} />
          <Route path="/registrar-usuario" element={<RegistrarUsuario />} />
          <Route path="/comunidad" element={
            <>
              <RutaPrivada>
                <Comunidad />
              </RutaPrivada>
            </>
          } />
        </Routes>

        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;