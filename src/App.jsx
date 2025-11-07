// npm install react-router-dom
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

//importamos firebase
import app from './firebase'
//Autentication
import { getAuth, signOut } from 'firebase/auth';

import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Header from "./components/header";
import Hero from "./components/hero";
import Contenido from "./components/contenido";
import Footer from "./components/footer";

// Mis paginas
import Caracteristicas from "./pages/caracteristicas";
import Contacto from "./pages/contacto";
import ListaPeliculas from "./components/peliculas";

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
            <Route path="/login" element={<Login />} />
            <Route path="/registrar" element={<RegistrarUsuario />} />

        </Routes>

        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;