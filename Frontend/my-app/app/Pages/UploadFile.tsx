"use client";

import { useRef, useState } from "react";
import Button from "../Atoms/Button_";

export default function UploadFile() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const allowed = ["txt", "csv", "md", "pdf", "docx", "pptx"];

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !allowed.includes(extension)) {
      alert("Formato no soportado. Usa PDF, DOCX, TXT, CSV, MD o PPTX.");
      return;
    }

    setSelectedFile(file);
    console.log("File captured:", file.name);
  };

  return (
    <section className="hero">
      {/* Columna izquierda: copy */}
      <div>
        <span className="badge">
          <span>⚡</span>
          <span>Analiza documentos en segundos</span>
        </span>

        <h1 className="hero-title">
          Donde tus archivos se convierten en
          <span className="highlight"> resúmenes inteligentes</span>
        </h1>

        <p className="hero-subtitle">
          Sube PDFs, presentaciones o documentos largos y obtén un resumen
          claro, listo para estudiar o compartir. Ideal para tareas, papers y
          reportes.
        </p>

        <div style={{ display: "flex", gap: "0.9rem", marginBottom: "1.6rem" }}>
          <Button text="Subir documento" variant="primary" onClick={handleButtonClick} />
          <Button text="Ver ejemplo de resumen" variant="ghost" />
        </div>

        <div className="hero-stats">
          <div>
            <strong>+100</strong>
            Documentos probados
          </div>
          <div>
            <strong>IA</strong>
            Resúmenes precisos
          </div>
          <div>
            <strong>Multi-formato</strong>
            PDF, DOCX, PPTX, TXT…
          </div>
        </div>
      </div>

      {/* Columna derecha: tarjeta de subida */}
      <div className="upload-card">
        <div className="upload-card-header">
          <div>
            <div className="upload-card-title">Sube tu archivo</div>
            <div className="upload-card-subtitle">
              Arrastra y suelta o usa el botón. Tamaño máximo 10 MB.
            </div>
          </div>
          <div className="dropzone-icon">↑</div>
        </div>

        <div
          className="dropzone"
          onClick={handleButtonClick}
        >
          <div className="dropzone-title">Arrastra tu archivo aquí</div>
          <div className="dropzone-text">
            Formatos permitidos: PDF, DOCX, TXT, CSV, MD, PPTX
          </div>
          <Button text="Elegir archivo" variant="ghost" />
        </div>

        {selectedFile && (
          <div className="file-meta">
            <span className="file-name">{selectedFile.name}</span>
            <span className="file-chip">Listo para analizar</span>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          className="file-input-hidden"
          onChange={handleFileChange}
        />
      </div>
    </section>
  );
}