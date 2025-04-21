import React from "react";
import "./Cipher.style.css";
import { useRef, useState, useContext, useEffect } from "react";
import KeyIcon from "../../assets/key.png";
import SideBar from "../../components/SideBar/SideBar";
import ChipertextField from "../../components/TextField/CipherTextField";
import PlainTextField from "../../components/TextField/PlainTextField";
import { ThemeContext } from "../../context/ThemeContext";
import FieldOutput from "../../components/FieldOutput/FieldOutput";

const Hc = () => {
  const { isDarkMode, setDarkMode } = useContext(ThemeContext);
  const [ isChecked, setIsChecked ] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("text");
  const [input, setInput] = useState({
    plainText: "",
    key: "",
    cipherText: "",
  });
  const [matrixSize, setMatrixSize] = useState(2); // Ukuran default 2x2
  const [matrixValues, setMatrixValues] = useState(() =>
    Array(2).fill(null).map(() => Array(2).fill(''))
  );

  const handleMatrixSizeChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (value >= 2 && value <= 100) { // Mengoreksi batas input
      setMatrixSize(value);
      setMatrixValues(Array.from({ length: value }, () => Array(value).fill(""))); // Membuat array 2D baru
    } else {
      e.target.value = "";
      alert("Masukkan angka antara 2 hingga 100");
    }
  };
  
  const handleMatrixValueChange = (row, col, value) => {
    setMatrixValues((prev) => {
      return prev.map((rowArr, rowIndex) =>
        rowIndex === row
          ? rowArr.map((cell, colIndex) => (colIndex === col ? value : cell)) // Hanya ubah nilai yang diperlukan
          : rowArr
      );
    });
  };

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const handleClickEncrypt = () => {
    if (!input.plainText.trim()) {
      console.error("Plain text tidak boleh kosong.");
      alert("Plain text cannot be empty");
      return;
    }
  
    if (hasEmptyCell) {
      console.error("Kunci tidak boleh kosong.");
      alert("Key cannot be empty");
      return;
    }

    if (!isMatrixInvertibleMod26(matrixValues)) {
      alert("Invalid key. Determinant is 0 or not relatively prime to 26");
      return;
    }

    fetch("http://localhost:8080/hillCipher", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        method: "encrypt",
        plainText: input.plainText,
        key: JSON.stringify(matrixValues),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
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
          plainText: "",
          key: "",
          cipherText: data.cipherText,
        });
        clearMatrixValues();
      })
      .catch((error) => console.error("Terjadi kesalahan:", error));
  };

  const handleClickDecrypt = () => {
    if (!input.cipherText.trim()) {
      console.error("Cipher text tidak boleh kosong.");
      alert("Cipher text cannot be empty");
      return;
    }
  
    if (hasEmptyCell) {
      console.error("Kunci tidak boleh kosong.");
      alert("Key cannot be empty");
      return;
    }

    if (!isMatrixInvertibleMod26(matrixValues)) {
      alert("Invalid key. Determinant is 0 or not relatively prime to 26");
      return;
    }

    fetch("http://localhost:8080/hillCipher", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        method: "decrypt",
        cipherText: input.cipherText,
        key: JSON.stringify(matrixValues),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setInput({
          ...input,
          cipherText: "",
          key: "",
          plainText: data.plainText,
        });
        clearMatrixValues();
      })
      .catch((error) => console.error("Terjadi kesalahan:", error));
  };

  const hillCipher = useRef(null);

  const toggleDarkMode = () => {
    setDarkMode(!isDarkMode);
  };

  const clearMatrixValues = () => {
    const cleared = matrixValues.map(row => row.map(() => ''));
    setMatrixValues(cleared);
  };  

  // FPB (GCD)
  const fpb = (a, b) => {
    while (b !== 0) [a, b] = [b, a % b];
    return a;
  };

  // Hitung determinan rekursif (untuk matriks nxn)
  const determinant = (matrix) => {
    const n = matrix.length;

    if (n === 1) return matrix[0][0];
    if (n === 2)
      return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

    let det = 0;
    for (let col = 0; col < n; col++) {
      const subMatrix = matrix
        .slice(1)
        .map((row) => row.filter((_, j) => j !== col));
      const sign = col % 2 === 0 ? 1 : -1;
      det += sign * matrix[0][col] * determinant(subMatrix);
    }

    return det;
  };

  // Validasi kunci Hill Cipher agar determinan ≠ 0 dan relatif prima dengan 26
  const isMatrixInvertibleMod26 = (matrix) => {
    const det = ((determinant(matrix) % 26) + 26) % 26; // normalisasi ke 0-25
    return det !== 0 && fpb(det, 26) === 1;
  };

  const hasEmptyCell = matrixValues.some(row => row.some(cell => cell === ""));

  return (
    <div
      className="landing-container"
      style={{ backgroundColor: isDarkMode ? "#303030" : "#E8EAF6" }}
    >
      <SideBar ref={hillCipher} isDarkmode={isDarkMode} />
      {/* Main Content */}
      <div className="main-content" ref={hillCipher}>
        <div
          className="navbar"
          style={{ backgroundColor: isDarkMode ? "#3F51B5" : undefined }}
        >
          <h1 className="navbar-title">CipherVault</h1>
          <div
            className={`${"toggle-darkmode"} ${
              isDarkMode ? "toggle-darkmode-t" : "toggle-darkmode-f"
            }`}
            onClick={toggleDarkMode}
          >
            <span>Night Mode</span>
            <div
              className="slider"
              style={{
                backgroundColor: isDarkMode ? "#3F51B5" : "#8590cf",
              }}
            >
              <i
                className={`bi ${
                  isDarkMode ? "bi-moon" : "bi-sun"
                }`}
                style={{
                  marginLeft: isDarkMode ? "20px" : "0px",
                  color: isDarkMode ? "#3F51B5" : "#8590cf",
                }}
              ></i>
            </div>
          </div>
        </div>
        <div
          className="content"
          style={{ backgroundColor: isDarkMode ? "#282828" : undefined }}
        >
          <div className="content-title">
            <h2>Hill Cipher</h2>
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
            <div className="flex-container small-gap">
              <h1 className="icon-arrow">&#8596;</h1>
              <div
                style={{
                  background: "white",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
                  border: "1px solid #989898",
                  maxWidth: "241px",
                  maxHeight: "243px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px",
                  }}
                >
                  <img src={KeyIcon} className="icon-key" alt="Key" />
                  <h2>Key</h2>
                  <input
                    type="number"
                    value={matrixSize}
                    placeholder="Matrix Size"
                    min="2"
                    max="100"
                    onChange={handleMatrixSizeChange}
                    style={{
                      width: "130px",
                      border: "1px solid black",
                      borderRadius: "4px",
                      textAlign: "center",
                      marginLeft: "auto",
                      paddingLeft: "15px",
                    }}
                  />
                </div>
                <hr />
                {/* Grid untuk input matriks */}
                <div
                  style={{
                    height: "195px",
                    width: "240px",
                    overflow: "auto",
                  }}
                >
                  <div
                    style={{
                      paddingTop: "4px",
                      paddingLeft: "4px",
                      paddingRight: "4px",
                      paddingBottom: "4px",
                      display: "grid",
                      gridTemplateColumns: `repeat(${matrixSize}, minmax(40px, 1fr))`,
                      gap: "4px",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    {matrixValues.flat().map((cell, index) => {
                      const rowIndex = Math.floor(index / matrixSize);
                      const colIndex = index % matrixSize;

                      return (
                        <input
                          key={`${rowIndex}-${colIndex}`}
                          type="text"
                          value={cell}
                          min={0}
                          max={25}
                          onChange={(e) => {
                            let value = e.target.value;
                          
                            // Cek apakah input hanya angka (atau kosong)
                            if (/^\d*$/.test(value)) {
                              let numValue = Math.max(0, Math.min(25, Number(value)));
                              handleMatrixValueChange(rowIndex, colIndex, numValue);
                            }
                          }}
                          style={{
                            minWidth: "40px",
                            minHeight: "40px",
                            textAlign: "center",
                            border: "1px solid #000000",
                            borderRadius: "4px",
                            
                          }}
                        />
                      );
                    })}
                  </div>

                </div>
                
              </div>
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

export default Hc;