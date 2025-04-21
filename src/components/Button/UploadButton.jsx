import { useState } from "react";
import styles from "./Button.module.css";

export default function UploadButton({ text, icon, accept, onFileSelect }) {
    const [inputKey, setInputKey] = useState(Date.now()); // Key dinamis untuk mereset input

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && onFileSelect) {
            onFileSelect(file);
        }
        setInputKey(Date.now()); // Reset input setelah file dipilih
    };

    return (
        <label className={styles.uploadBtn}>
            <input 
                key={inputKey} // Key dinamis untuk memaksa re-render
                type="file" 
                style={{ display: "none" }} 
                accept={accept} 
                onChange={handleFileChange} 
            />
            {text}
            <i className={icon}></i>
        </label>
    );
}