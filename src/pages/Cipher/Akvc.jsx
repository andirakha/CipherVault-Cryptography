import "./Cipher.style.css";
import { useRef, useContext, useState, useEffect } from "react";
import ChipertextField from "../../components/TextField/CipherTextField";
import PlainTextField from "../../components/TextField/PlainTextField";
import SideBar from "../../components/SideBar/SideBar";
import KeyField from "../../components/TextField/KeyField";
import { ThemeContext } from "../../context/ThemeContext";
import FieldOutput from "../../components/FieldOutput/FieldOutput";

const Akvc = () => {
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

    if (!/^[a-zA-Z]+$/.test(input.key)) {
      console.error("Kunci hanya boleh mengandung huruf alfabet.");
      alert("Key must only contain alphabetic characters");
      return;
    }

    fetch('http://localhost:8080/autokeyVigenere', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        method : "encrypt",
        plainText : input.plainText,
        key : input.key,
      })
    })
      .then(response => response.json())
      .then(data => {
        if (isChecked) {
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
          plainText : "",
          key: "",
          cipherText: data.cipherText,
      })
      })
      .catch(error => console.error('Terjadi kesalahan:', error));    
  }

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

    if (!/^[a-zA-Z]+$/.test(input.key)) {
      console.error("Kunci hanya boleh mengandung huruf alfabet.");
      alert("Key must only contain alphabetic characters");
      return;
    }
    fetch('http://localhost:8080/autokeyVigenere', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        method : "decrypt",
        cipherText : input.cipherText,
        key : input.key,
      })
    })
      .then(response => response.json())
      .then(data => {
        setInput({
          ...input,
          cipherText : "",
          key: "",
          plainText : data.plainText,
        })
      })
      .catch(error => console.error('Terjadi kesalahan:', error));
  }

  const autokey = useRef(null);

  const toggleDarkMode = () => {
    setDarkMode(!isDarkMode);
  };

  return (
    <div className="landing-container">
      {console.log(input.plainText)}
      <SideBar ref={autokey}  isDarkmode={isDarkMode}/>
      {/* Main Content */}
      <div className="main-content" ref={autokey} style={{ backgroundColor : isDarkMode ? "#303030" : "#E8EAF6"}}>
        <div className="navbar"  style={{ backgroundColor : isDarkMode ? "#3F51B5" : undefined}}>
          <h1 className="navbar-title">CipherVault</h1>
          <div className={`${"toggle-darkmode"} ${isDarkMode ? "toggle-darkmode-t" : "toggle-darkmode-f"}`} onClick={toggleDarkMode}>
            <span>Night Mode</span>
            <div className="slider" style={{ backgroundColor: isDarkMode ? "#3F51B5" : "#8590cf" }}>
            <i className={`bi ${isDarkMode ? "bi-moon" : "bi-sun"}`} style={{ marginLeft : isDarkMode ? "20px" : "0px", color: isDarkMode ? "#3F51B5" : "#8590cf"}}></i>
            </div>
          </div>
        </div>
        <div className="content" style={{ backgroundColor : isDarkMode ? "#282828" : undefined }}>
          <div className="content-title">
            <h2>Auto-Key Vigenere Cipher</h2>
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
              <KeyField handler={handleChange} value={input.key}/>
            </div>
            <ChipertextField 
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

export default Akvc;