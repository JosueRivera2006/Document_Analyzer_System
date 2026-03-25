'use client';
import { useRef, useState } from 'react';
import Button_format from "../Atoms/Button_";

export default function UploadFile() {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const allowed = ["txt", "csv", "md", "pdf", "docx", "pptx"];

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    }
    const handleFileChange = (event: any) => {
        const file = event.target.files?.[0];
        if (file) {
            const extension = file.name.split(".").pop()?.toLowerCase();
            if (!extension || !allowed.includes(extension)) {
                alert("Error : Mondongo");
                return;
            }
            setSelectedFile(file);
            console.log("File captured:", file.name);
        }
    };
    return (
        <div className="bg-white min-h-screen flex justify-center items-center">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".txt,.csv,.md,.pdf,.docx,.pptx"
                style={{ display: 'none' }}
            />
            <div className="flex flex-col items-center gap-4 text-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Sube tus documentos
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Formatos permitidos: PDF, DOCX, TXT
                    </p>
                </div>

                <Button_format text="Select PDF files" onClick={handleButtonClick} />
                
                {selectedFile && (
                    <p className="text-xs text-green-600 font-medium">
                        Selecionado: {(selectedFile as File).name}
                    </p>
                )}
            </div>
        </div>
    )
}


