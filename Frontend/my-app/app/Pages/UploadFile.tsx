"use client";

import { useRef, useState } from "react";
import Button from "../Atoms/Button_";
import axios from "axios";

export default function UploadFile() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [activeTab, setActiveTab] = useState<'file' | 'text'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textContent, setTextContent] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const allowed = ["txt", "csv", "md", "pdf", "docx", "pptx"];


  const handleButtonClick = () => fileInputRef.current?.click();

  const processFileSelection = (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !allowed.includes(extension)) {
      alert("Formato no soportado. Usa PDF, DOCX, TXT, CSV, MD o PPTX.");
      return;
    }
    setSelectedFile(file);
    setResult(null); 
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processFileSelection(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    if (event.dataTransfer.files.length > 0) {
      processFileSelection(event.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmitFile = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('archivo', selectedFile);

    try {
      const response = await axios.post('http://localhost:8000/resumir', formData);
      setResult(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar el archivo. Asegúrate de que el backend esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitText = async () => {
    if (!textContent.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:8000/resumir/texto', {
        texto: textContent,
        nombre: documentName || 'Documento_Texto'
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar el texto.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format: 'txt' | 'docx' | 'pptx' | 'pdf') => {
    let fileToUpload = selectedFile;

    if (activeTab === 'text' && textContent) {
      const blob = new Blob([textContent], { type: 'text/plain' });
      fileToUpload = new File([blob], `${documentName || 'texto_copiado'}.txt`, { type: 'text/plain' });
    }

    if (!fileToUpload) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('archivo', fileToUpload);

    let endpoint = 'http://localhost:8000/resumir/exportar';
    if (format !== 'txt') {
      endpoint += `/${format}`;
    }

    try {
      const response = await axios.post(endpoint, formData, { responseType: 'blob' });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Resumen.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
      alert(`Error al generar el archivo ${format.toUpperCase()}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="hero">
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
          y obtén un resumen claro, listo para estudiar o compartir.
        </p>

        {/* RESULTS CARD */}
        {result && (
          <div style={{ marginTop: "2rem", padding: "1.5rem", background: "rgba(255,255,255,0.05)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
            <h2 style={{ fontSize: "1.4rem", marginBottom: "0.5rem" }}>{result.titulo}</h2>

            <div style={{ fontSize: "0.85rem", color: "#aaa", marginBottom: "1rem" }}>
              Idioma: <strong>{result.idioma_detectado.toUpperCase()}</strong> |
              Palabras: <strong>{result.palabras_resumen}</strong> (De {result.palabras_originales})
            </div>

            <p style={{ lineHeight: "1.6", fontSize: "0.95rem", whiteSpace: "pre-wrap" }}>
              {result.resumen}
            </p>

            <div style={{ marginTop: "1.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {result.palabras_clave?.map((word: string) => (
                <span key={word} style={{ background: "#007bff", color: "white", padding: "4px 10px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: "bold" }}>
                  #{word}
                </span>
              ))}
            </div>

            {/* DOWNLOAD BUTTONS ROW */}
            <div style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <span style={{ width: "100%", fontSize: "0.85rem", color: "#aaa", marginBottom: "0.5rem" }}>Descargar resumen:</span>
              <button onClick={() => handleDownload('pdf')} disabled={loading} className="tab" style={{ padding: "5px 10px", fontSize: "0.8rem" }}>📄 PDF</button>
              <button onClick={() => handleDownload('docx')} disabled={loading} className="tab" style={{ padding: "5px 10px", fontSize: "0.8rem" }}>📝 DOCX</button>
              <button onClick={() => handleDownload('pptx')} disabled={loading} className="tab" style={{ padding: "5px 10px", fontSize: "0.8rem" }}>📊 PPTX</button>
              <button onClick={() => handleDownload('txt')} disabled={loading} className="tab" style={{ padding: "5px 10px", fontSize: "0.8rem" }}>📋 TXT</button>
            </div>
          </div>
        )}
      </div>

      <div className="upload-card">
        <div className="tab-container">
          <button
            className={`tab ${activeTab === 'file' ? 'tab-active' : ''}`}
            onClick={() => { setActiveTab('file'); setResult(null); }}
          >
            📁 Subir archivo
          </button>
          <button
            className={`tab ${activeTab === 'text' ? 'tab-active' : ''}`}
            onClick={() => { setActiveTab('text'); setResult(null); }}
          >
            📝 Pegar texto
          </button>
        </div>

        {activeTab === 'file' ? (
          <>
            <div className="upload-card-header">
              <div>
                <div className="upload-card-title">Sube tu archivo</div>
                <div className="upload-card-subtitle">Arrastra y suelta o usa el botón.</div>
              </div>
              <div className="dropzone-icon">{loading ? "⏳" : "↑"}</div>
            </div>

            <div
              className={`dropzone ${isDragOver ? 'dropzone-active' : ''}`}
              onClick={handleButtonClick}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
            >
              <div className="dropzone-title">
                {isDragOver ? 'Suelta el archivo aquí' : 'Arrastra tu archivo aquí'}
              </div>
              <div className="dropzone-text">Formatos permitidos: PDF, DOCX, TXT, CSV, MD, PPTX</div>
              <div style={{ pointerEvents: 'none', marginTop: '10px' }}>
                <Button text="Elegir archivo" variant="ghost" />
              </div>
            </div>

            {selectedFile && (
              <div className="file-meta">
                <span className="file-name" style={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: "150px" }}>
                  {selectedFile.name}
                </span>
                <div className="file-actions">
                  <span className="file-chip">{loading ? "Procesando..." : "Listo"}</span>
                  <button className="remove-file-btn" onClick={handleRemoveFile}>✕</button>
                </div>
              </div>
            )}

            {selectedFile && (
              <div style={{ marginTop: '1rem', pointerEvents: loading ? 'none' : 'auto', opacity: loading ? 0.6 : 1 }}>
                <Button text={loading ? "Analizando..." : "Analizar documento"} variant="primary" onClick={handleSubmitFile} />
              </div>
            )}

            <input ref={fileInputRef} type="file" className="file-input-hidden" onChange={handleFileChange} accept=".txt,.csv,.md,.pdf,.docx,.pptx" style={{ display: 'none' }} />
          </>
        ) : (
          <>
            <div className="upload-card-header">
              <div>
                <div className="upload-card-title">Pega tu texto</div>
                <div className="upload-card-subtitle">Copia y pega el texto que quieres resumir.</div>
              </div>
              <div className="dropzone-icon">{loading ? "⏳" : "📝"}</div>
            </div>

            <div className="text-input-container">
              <input type="text" placeholder="Nombre del documento (opcional)" 
              value={documentName} 
              onChange={(e) => setDocumentName(e.target.value)} 
              className="document-name-input" 
              style={{ width: '100%', marginBottom: '10px', padding: '8px', borderRadius: '4px' }} />
              <textarea placeholder="Pega aquí el texto que quieres resumir..." 
              value={textContent} 
              onChange={(e) => setTextContent(e.target.value)} 
              className="text-input" 
              rows={8} style={{ width: '100%', padding: '8px', borderRadius: '4px' }} />
            </div>

            {textContent.trim() && (
              <div className="file-meta" style={{ marginTop: '10px' }}>
                <span className="file-name">
                  {documentName || 'Documento de texto'} ({textContent.trim().split(/\s+/).length} palabras)
                </span>
                <span className="file-chip">{loading ? "Procesando..." : "Listo"}</span>
              </div>
            )}

            {textContent.trim() && (
              <div style={{ marginTop: '1rem', pointerEvents: loading ? 'none' : 'auto', opacity: loading ? 0.6 : 1 }}>
                <Button text={loading ? "Analizando..." : "Analizar texto"} variant="primary" onClick={handleSubmitText} />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}