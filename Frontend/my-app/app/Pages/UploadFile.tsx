"use client";

import { useRef, useState } from "react";
import Button from "../Atoms/Button_";

export default function UploadFile() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'file' | 'text'>('file');
  const [textContent, setTextContent] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

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

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);

    const files = event.dataTransfer.files;
    if (files.length === 0) return;

    // Solo tomar el primer archivo
    const file = files[0];
    const extension = file.name.split(".").pop()?.toLowerCase();
    
    if (!extension || !allowed.includes(extension)) {
      alert("Formato no soportado. Usa PDF, DOCX, TXT, CSV, MD o PPTX.");
      return;
    }

    setSelectedFile(file);
    console.log("File dropped:", file.name);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    // Limpiar el input file
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextContent(event.target.value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentName(event.target.value);
  };

  const handleSubmitFile = async () => {
    if (!selectedFile) {
      alert('Por favor selecciona un archivo primero.');
      return;
    }

    const formData = new FormData();
    formData.append('archivo', selectedFile);

    try {
      const response = await fetch('http://localhost:8000/resumir', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al procesar el archivo');
      }

      const result = await response.json();
      console.log('Resultado del resumen:', result);
      // Aquí puedes manejar el resultado como quieras
      alert('¡Archivo procesado exitosamente! Revisa la consola para ver el resultado.');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar el archivo. Revisa la consola para más detalles.');
    }
  };

  const handleSubmitText = async () => {
    if (!textContent.trim()) {
      alert('Por favor ingresa algún texto para resumir.');
      return;
    }

    const payload = {
      texto: textContent,
      nombre: documentName || 'documento_texto'
    };

    try {
      const response = await fetch('http://localhost:8000/resumir/texto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Error al procesar el texto');
      }

      const result = await response.json();
      console.log('Resultado del resumen:', result);
      // Mensaje de resultado
      alert('¡Texto procesado exitosamente! Revisa la consola para ver el resultado.');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar el texto. Revisa la consola para más detalles.');
    }
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
          Donde tus archivos y textos se convierten en
          <span className="highlight"> resúmenes inteligentes</span>
        </h1>

        <p className="hero-subtitle">
          Sube PDFs, presentaciones, documentos largos o pega texto directamente 
          y obtén un resumen claro, listo para estudiar o compartir. Ideal para 
          tareas, papers y reportes.
        </p>

        <div style={{ display: "flex", gap: "0.9rem", marginBottom: "1.6rem" }}>
          <Button text="Subir documento" variant="primary" onClick={handleButtonClick} />
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
        {/* Pestañas */}
        <div className="tab-container">
          <button 
            className={`tab ${activeTab === 'file' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('file')}
          >
            📁 Subir archivo
          </button>
          <button 
            className={`tab ${activeTab === 'text' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('text')}
          >
            📝 Pegar texto
          </button>
        </div>

        {activeTab === 'file' ? (
          <>
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
              className={`dropzone ${isDragOver ? 'dropzone-active' : ''}`}
              onClick={handleButtonClick}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="dropzone-title">
                {isDragOver ? 'Suelta el archivo aquí' : 'Arrastra tu archivo aquí'}
              </div>
              <div className="dropzone-text">
                Formatos permitidos: PDF, DOCX, TXT, CSV, MD, PPTX
              </div>
              <Button text="Elegir archivo" variant="ghost" />
            </div>

            {selectedFile && (
              <div className="file-meta">
                <span className="file-name">{selectedFile.name}</span>
                <div className="file-actions">
                  <span className="file-chip">Listo para analizar</span>
                  <button 
                    className="remove-file-btn"
                    onClick={handleRemoveFile}
                    title="Quitar archivo"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}

            {selectedFile && (
              <div style={{ marginTop: '1rem' }}>
                <Button text="Analizar documento" variant="primary" onClick={handleSubmitFile} />
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              className="file-input-hidden"
              onChange={handleFileChange}
              accept=".txt,.csv,.md,.pdf,.docx,.pptx"
            />
          </>
        ) : (
          <>
            <div className="upload-card-header">
              <div>
                <div className="upload-card-title">Pega tu texto</div>
                <div className="upload-card-subtitle">
                  Copia y pega el texto que quieres resumir.
                </div>
              </div>
              <div className="dropzone-icon">📝</div>
            </div>

            <div className="text-input-container">
              <input
                type="text"
                placeholder="Nombre del documento (opcional)"
                value={documentName}
                onChange={handleNameChange}
                className="document-name-input"
              />
              <textarea
                placeholder="Pega aquí el texto que quieres resumir..."
                value={textContent}
                onChange={handleTextChange}
                className="text-input"
                rows={8}
              />
            </div>

            {textContent.trim() && (
              <div className="file-meta">
                <span className="file-name">
                  {documentName || 'Documento de texto'} ({textContent.split(' ').length} palabras)
                </span>
                <span className="file-chip">Listo para analizar</span>
              </div>
            )}

            {textContent.trim() && (
              <div style={{ marginTop: '1rem' }}>
                <Button text="Analizar texto" variant="primary" onClick={handleSubmitText} />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}