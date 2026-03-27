"use client";
import React from "react";
import Button from "../Atoms/Button_";

const Navbar_: React.FC = () => {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Marca */}
        <div className="brand">
          <div className="brand-logo">DA</div>
          <div>
            <div className="brand-text-main">Document Analyzer</div>
            <div className="brand-text-sub">IA para resumir tus archivos</div>
          </div>
        </div>

        {/* Links / acciones */}
        <nav className="nav-links">
          <span>Cómo funciona</span>
          <span>Formatos</span>
          <span className="nav-link-pill">Beta privada</span>
          <Button text="Iniciar sesión" variant="primary" />
        </nav>
      </div>
    </header>
  );
};

export default Navbar_;