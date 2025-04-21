import { useState, useEffect } from "react";
import styles from "./TextField.module.css";
import UploadButton from "../Button/UploadButton";
import DownloadButton from "../Button/DownloadButton";

export default function PlainTextField({ handler, value, encrypt, selectedFormat, setSelectedFormat }) {
    const [isEvcPath, setIsEvcPath] = useState(false);

    useEffect(() => {
        // Periksa apakah path adalah /evc
        const currentPath = window.location.pathname;
        setIsEvcPath(currentPath === "/evc");
    }, []);

    return (
        <div className={styles.textField}>
            <div className={styles.textTitle}>
                <h2>PlainText</h2>
                <select value={selectedFormat} onChange={(e) => setSelectedFormat(e.target.value)}>
                    <option value="text">Text</option>
                    {isEvcPath && <option value="binary">Binary</option>}
                </select>
            </div>
            <hr />

            <textarea
                className={styles.textInput}
                placeholder="Write plaintext here..."
                name="plainText"
                onChange={handler}
                value={value}
            />
            <hr />

            <div className={styles.textFooter}>
                <div className={styles.footerWrap}>
                    <UploadButton
                        text="Upload File"
                        icon="bi bi-paperclip"
                        accept={selectedFormat === "text" ? "text/*" : "*/*"}
                        onFileSelect={(file) => {
                            const reader = new FileReader();
                            if (selectedFormat === "text") {
                                reader.onload = (e) => {
                                    handler({ target: { name: "plainText", value: e.target.result } });
                                };
                                reader.readAsText(file); // Membaca file sebagai teks
                            } else if (selectedFormat === "binary") {
                                reader.onload = (e) => {
                                    const binaryData = new Uint8Array(e.target.result); // Membaca isi file sebagai buffer
                                    const metadata = `${file.name}|${file.type}|${file.size}|`; // Metadata dalam format string
                                    const metadataBytes = new TextEncoder().encode(metadata); // Konversi metadata ke biner
                                    const combinedData = new Uint8Array(metadataBytes.length + binaryData.length);
                                    combinedData.set(metadataBytes); // Tambahkan metadata di awal
                                    combinedData.set(binaryData, metadataBytes.length); // Tambahkan isi file setelah metadata
                                    handler({
                                        target: { name: "plainText", value: Array.from(combinedData).join(" ") },
                                    }); // Gabungkan metadata dan isi file sebagai string angka
                                };
                                reader.readAsArrayBuffer(file); // Membaca file sebagai array buffer
                            }
                        }}
                    />
                    <DownloadButton
                        text="Download"
                        icon="bi bi-download"
                        event={() => {
                            if (selectedFormat === "text") {
                                // Untuk file teks
                                if (!value || value.trim() === "") {
                                    alert("The file is empty. Please provide content before downloading");
                                    return;
                                }
                                const blob = new Blob([value], { type: "text/plain" });
                                const link = document.createElement("a");
                                link.href = URL.createObjectURL(blob);
                                link.download = "decrypted_text.txt"; // Nama file teks
                                link.click();
                            } else if (selectedFormat === "binary") {
                                if (!value || value.trim() === "") {
                                    alert("The file is empty. Please provide content before downloading");
                                    return;
                                }
                                // Untuk file biner
                                const byteArray = value.split(" ").map(Number); // Konversi string angka kembali ke byte array
                                const combinedData = new Uint8Array(byteArray);
                                
                                // Pisahkan metadata dan isi file
                                const separatorIndex = combinedData.indexOf(124); // ASCII '|' sebagai pemisah pertama
                                const secondSeparatorIndex = combinedData.indexOf(124, separatorIndex + 1); // ASCII '|' kedua
                                const thirdSeparatorIndex = combinedData.indexOf(124, secondSeparatorIndex + 1); // ASCII '|' ketiga
                                
                                let fileName = "default_file.bin"; // Default file name
                                let fileType = "application/octet-stream"; // Default file type
                                let fileData = combinedData; // Default to the entire data
                                
                                if (thirdSeparatorIndex !== -1) {
                                    const metadataBytes = combinedData.slice(0, thirdSeparatorIndex + 1); // Metadata hingga '|' ketiga
                                    fileData = combinedData.slice(thirdSeparatorIndex + 1); // Data file dimulai setelah '|' ketiga
                                
                                    // Decode metadata
                                    const metadata = new TextDecoder().decode(metadataBytes).split("|");
                                    fileName = metadata[0] || fileName;
                                    fileType = metadata[1] || fileType;
                                } else {
                                    alert("Invalid metadata or file content not found. Proceeding with default file settings"); // Inform the user
                                }
                                
                                // Buat file biner
                                const blob = new Blob([fileData], { type: fileType });
                                const link = document.createElement("a");
                                link.href = URL.createObjectURL(blob);
                                link.download = fileName; // Nama file dari metadata atau default
                                link.click();
                            }
                        }}
                    />
                </div>
                <DownloadButton text="Encrypt" icon="bi bi-lock" event={encrypt} />
            </div>
        </div>
    );
}