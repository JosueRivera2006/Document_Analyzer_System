import React from 'react';

interface ButtonProps {
    text: string;
    onClick?: (e: React.FormEvent) => void;
}

const Button_format = ({ text, onClick }: ButtonProps) => {
    return (
        <button onClick={onClick}  className="bg-gray-700 text-white text-2xl font-bold px-12 py-4 rounded-lg shadow-md">
            {text}
        </button>
    );
};

export default Button_format;