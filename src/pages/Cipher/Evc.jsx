import "./Cipher.style.css";
import { useRef, useState, useContext, useEffect } from "react";
import PlainTextField from "../../components/TextField/PlainTextField";
import KeyField from "../../components/TextField/KeyField";
import CipherTextField from "../../components/TextField/CipherTextField";
import SideBar from "../../components/SideBar/SideBar";
import { ThemeContext } from "../../context/ThemeContext";
import FieldOutput from "../../components/FieldOutput/FieldOutput";

const Evc = () => {
  const { isDarkMode, setDarkMode } = useContext(ThemeContext);
  const [ isChecked, setIsChecked ] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("text");
  const [input, setInput] = useState({
    plainText: "",
    key: "",
    cipherText: "",
  });

  const handleChange = (e) => {
      setInput({
          ...input, 
          [e.target.name] : e.target.value
      });
  }

  const handleClickEncrypt = () => {
    if (!input.plainText.trim()) {
      console.error("Plain text tidak boleh kosong.");
      alert("Plain text cannot be empty");
      return;
    }
  
    if (!input.key.trim()) {
      console.error("Kunci tidak boleh kosong.");
      alert("Key cannot be empty");
      return;
    }

    if (!/^[\x00-\xFF]*$/.test(input.key)) {
      console.error("Kunci hanya boleh berisi karakter ASCII hingga 255.");
      alert("Key must contain only ASCII characters (0-255)");
      return;
    }

    const isBinary = selectedFormat === "binary";
    const plainText = isBinary
      ? new Uint8Array(input.plainText.split(" ").map(Number)) // Konversi ke Uint8Array jika biner
      : input.plainText;
  
    // Log tipe data dan nilai plainText
    console.log("Tipe data plainText:", isBinary ? "Uint8Array" : typeof plainText);
    console.log("Isi plainText:", isBinary ? Array.from(plainText) : plainText);
  
    fetch("http://localhost:8080/extendedVigenere", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        method: "encrypt",
        plainText: isBinary ? Array.from(plainText) : plainText, // Kirim array byte jika biner
        key: input.key,
        format: selectedFormat, // Kirim format ke server
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.cipherText) {
          console.error("Server response does not contain cipherText:", data);
          return;
        }
        if (selectedFormat === "text" && isChecked) {
          let formattedText = "";
          for (let i = 0; i < data.cipherText.length; i++) {
            if (i % 5 === 0 && i !== 0) {
              formattedText += " ";
            }
            formattedText += data.cipherText[i];
          }
          console.log("isi formated text",formattedText)
          data.cipherText = formattedText;
        }
  
        setInput({
          ...input,
          plainText: "",
          key: "",
          cipherText: isBinary
            ? Array.isArray(data.cipherText)
              ? data.cipherText.join(" ") // Gabungkan array byte menjadi string angka
              : data.cipherText
            : data.cipherText,
        });
      })
      .catch((error) => console.error("Terjadi kesalahan:", error));
  };

  const handleClickDecrypt = () => {
    if (!input.cipherText.trim()) {
      console.error("Cipher text tidak boleh kosong.");
      alert("Cipher text cannot be empty");
      return;
    }
  
    if (!input.key.trim()) {
      console.error("Kunci tidak boleh kosong.");
      alert("Key cannot be empty");
      return;
    }

    if (!/^[\x00-\xFF]*$/.test(input.key)) {
      console.error("Kunci hanya boleh berisi karakter ASCII hingga 255.");
      alert("Key must contain only ASCII characters (0-255)");
      return;
    }

    if (selectedFormat === "text") {
      const text = input.cipherText;
      let allMultiplesAreSpaces = true;
      const targetIndices = [];
    
      // Cek semua index mulai dari 5, kelipatan 6 (5, 11, 17, ...)
      for (let i = 5; i < text.length; i += 6) {
        if (text[i] !== " ") {
          allMultiplesAreSpaces = false;
          break;
        }
        targetIndices.push(i); // simpan indeks yang perlu dihapus jika valid
      }
    
      if (allMultiplesAreSpaces) {
        let result = "";
        for (let i = 0; i < text.length; i++) {
          // Hapus hanya spasi pada indeks yang sudah dicek
          if (targetIndices.includes(i) && text[i] === " ") continue;
          result += text[i];
        }
        input.cipherText = result;
      }
    }    

    const isBinary = selectedFormat === "binary";
    const cipherText = isBinary
      ? new Uint8Array(input.cipherText.split(" ").map(Number)) // Convert to Uint8Array if binary
      : input.cipherText;
  
    fetch("http://localhost:8080/extendedVigenere", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        method: "decrypt",
        cipherText: isBinary ? Array.from(cipherText) : cipherText, // Send array byte if binary
        key: input.key,
        format: selectedFormat, // Send format to server
      }),
    })
      .then((response) => response.json())
      .then((data) => {

        if (!data.plainText) {
          console.error("Server response does not contain plainText:", data);
          return;
        }
  
        setInput({
          ...input,
          cipherText: "",
          key: "",
          plainText: isBinary
            ? Array.isArray(data.plainText)
              ? data.plainText.join(" ") // Join byte array into a string of numbers
              : data.plainText
            : data.plainText,
        });
      })
      .catch((error) => console.error("Terjadi kesalahan:", error));
  };

  const extended = useRef(null);

  const toggleDarkMode = () => {
    setDarkMode(!isDarkMode);
  };

  return (
    <div className="landing-container">
      <SideBar ref={extended}  isDarkmode={isDarkMode}/>
      {/* Main Content */}
      <div className="main-content" ref={extended} style={{ backgroundColor : isDarkMode ? "#303030" : "#E8EAF6"}}>
        <div className="navbar"  style={{ backgroundColor : isDarkMode ? "#3F51B5" : undefined}}>
          <h1 className="navbar-title">CipherVault</h1>
          <div className={`${"toggle-darkmode"} ${isDarkMode ? "toggle-darkmode-t" : "toggle-darkmode-f"}`} onClick={toggleDarkMode}>
            <span>Night Mode</span>
            <div className="slider" style={{ backgroundColor: isDarkMode ? "#3F51B5" : "#8590cf" }}>
            <i className={`bi ${isDarkMode ? "bi-moon" : "bi-sun"}`} style={{ marginLeft : isDarkMode ? "20px" : "0px", color: isDarkMode ? "#3F51B5" : "#8590cf"}}></i>
            </div>
          </div>
        </div>
        <div className="content"  style={{ backgroundColor : isDarkMode ? "#282828" : undefined }}>
          <div className="content-title">
            <h2>Extended Vigenere Cipher</h2>
          </div>
        </div>

        <div className="chiper">
          <div className="chiper-grid">
          <div className="plaintext-wrapper">
            <PlainTextField 
              value={input.plainText} 
              handler={handleChange} 
              encrypt={handleClickEncrypt} 
              selectedFormat={selectedFormat} 
              setSelectedFormat={setSelectedFormat} 
            />
            <FieldOutput isSelected={isChecked} setIsSelected={setIsChecked}/>
          </div>
            <div className="flex-container">
              <h1 className="icon-arrow">&#8596;</h1>
              <KeyField value={input.key} handler={handleChange}/>
            </div>
            <CipherTextField 
              value={input.cipherText} 
              handler={handleChange} 
              decrypt={handleClickDecrypt}
              selectedFormat={selectedFormat} 
              setSelectedFormat={setSelectedFormat} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Evc;
