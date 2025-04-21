import { useState, useEffect } from "react";
import styles from "./TextField.module.css";
import UploadButton from "../Button/UploadButton";
import DownloadButton from "../Button/DownloadButton";

export default function CipherTextField({ handler, value, decrypt,  selectedFormat, setSelectedFormat }) {
    const [isEvcPath, setIsEvcPath] = useState(false);

    useEffect(() => {
        // Periksa apakah path adalah /evc
        const currentPath = window.location.pathname;
        setIsEvcPath(currentPath === "/evc");
    }, []);


    return (
        <div className={styles.textField}>
            <div className={styles.textTitle}>
                <h2>CipherText</h2>
                <select value={selectedFormat} onChange={(e) => setSelectedFormat(e.target.value)}>
                    <option value="text">Text</option>
                    {isEvcPath && <option value="binary">Binary</option>}
                </select>
            </div>
            <hr />

            <textarea className={styles.textInput} placeholder="Write ciphertext here..." name="cipherText" onChange={handler} value={value}/>
            <hr />

            <div className={styles.textFooter}>
                <div className={styles.footerWrap}>
                    <UploadButton
                        text="Upload File"
                        icon="bi bi-paperclip"
                        accept={selectedFormat === "text" ? "text/*" : ".bin"}
                        onFileSelect={(file) => {
                            const reader = new FileReader();
                            if (selectedFormat === "text") {
                                reader.onload = (e) => {
                                    handler({ target: { name: "cipherText", value: e.target.result } });
                                };
                                reader.readAsText(file); // Membaca file sebagai teks
                            } else if (selectedFormat === "binary") {
                                reader.onload = (e) => {
                                    const binaryData = new Uint8Array(e.target.result); // Membaca isi file sebagai buffer
                                    handler({
                                        target: { name: "cipherText", value: Array.from(binaryData).join(" ") },
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
                                link.download = "encrypted_text.txt"; // Nama file teks
                                link.click();
                            } else if (selectedFormat === "binary") {
                                if (!value || value.trim() === "") {
                                    alert("The file is empty. Please provide content before downloading");
                                    return;
                                }
                                // Untuk file biner
                                const byteArray = value.split(" ").map(Number); // Konversi string angka kembali ke byte array
                                const combinedData = new Uint8Array(byteArray);

                                // Buat file biner tanpa metadata
                                const blob = new Blob([combinedData], { type: "application/octet-stream" });
                                const link = document.createElement("a");
                                link.href = URL.createObjectURL(blob);
                                link.download = "encrypted_file.bin"; // Nama file tetap
                                link.click();
                            }
                        }}
                    />
                </div>
                <DownloadButton text="Decrypt" icon="bi bi-unlock" event={decrypt}/>
            </div>
        </div>
    );
}
