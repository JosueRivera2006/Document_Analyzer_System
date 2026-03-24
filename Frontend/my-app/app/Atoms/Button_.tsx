import React from 'react';

interface ButtonProps {
    text: string;
    onClick?: (e: React.FormEvent) => void;
}

const Button_format = ({ text, onClick }: ButtonProps) => {
    return (
        <button onClick={onClick}  className=''>
            {text}
        </button>
    );
};

export default Button_format;