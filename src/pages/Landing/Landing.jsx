import styles from "./Landing.module.css";
import { useRef, useContext } from "react";
import SideBar from "../../components/SideBar/SideBar";
import { ThemeContext } from "../../context/ThemeContext";

const Landing = () => {
  const { isDarkMode, setDarkMode } = useContext(ThemeContext);

  const landingPage = useRef(null);

  const toggleDarkMode = () => {
    setDarkMode(!isDarkMode);
  };


  return (
    <div className={styles.landingContainer}>
      <SideBar ref={landingPage}  isDarkmode={isDarkMode}/>
      {/* Main Content */}
      <div className={styles.mainContent} ref={landingPage} style={{ backgroundColor : isDarkMode ? "#303030" : "#E8EAF6"}}>
        <div className={styles.navbar} style={{ backgroundColor : isDarkMode ? "#3F51B5" : "" }}>
          <h1 className={styles.navbarTitle}>CipherVault</h1>
          <div className={`${styles.toggleDarkmode} ${isDarkMode ? styles.toggleDarkmodeT : styles.toggleDarkmodeF}`} onClick={toggleDarkMode}>
            <span>Night Mode</span>
            <div className={styles.slider} style={{ backgroundColor: isDarkMode ? "#3F51B5" : "#8590cf" }}>
              <i className={`bi ${isDarkMode ? "bi-moon" : "bi-sun"}`} style={{ marginLeft : isDarkMode ? "20px" : "0px", color: isDarkMode ? "#3F51B5" : "#8590cf"}}></i>
            </div>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle} style={{ backgroundColor : isDarkMode ? "#282828" : undefined }}>
            <h2>Welcome to CipherVault</h2>
          </div>
          <div className={styles.contentText} style={{ color : isDarkMode ? "white" : "#8590CF", transition: "0.3s ease" }}>
            <p>
              Explore encryption and decryption with six powerful cryptographic algorithms.
              Our platform provides easy-to-use tools to encrypt and decrypt messages while learning the fundamentals of cryptography.
            </p>
            <br />
            <p>Try these six encryption and decryption methods :</p>
          </div>
          <div className={styles.cipherCards}>
            <div className={styles.cipherCard}>
              <h2 className={styles.chiperTitle} style={{ backgroundColor: isDarkMode ? "#3F51B5" : undefined }}>Vigenere Cipher Standard</h2>
              <p className={styles.chiperText}>
                Vigenere Cipher (Standard) adalah cipher polialfabetik yang mengenkripsi teks dengan menggeser huruf berdasarkan kata kunci berulang.
              </p>
            </div>
            <div className={styles.cipherCard}>
              <h2 className={styles.chiperTitle} style={{ backgroundColor: isDarkMode ? "#3F51B5" : undefined }}>Auto-Key Vigenere Cipher</h2>
              <p className={styles.chiperText}>
                Auto-Key Vigenere Cipher adalah varian Vigenere yang lebih aman karena menggunakan sebagian teks asli sebagai kelanjutan kunci, mengurangi pola berulang.
              </p>
            </div>
            <div className={styles.cipherCard}>
              <h2 className={styles.chiperTitle} style={{ backgroundColor: isDarkMode ? "#3F51B5" : undefined }}>Extended Vigenere Cipher</h2>
              <p className={styles.chiperText}>
                Extended Vigenere Cipher mendukung 256 karakter ASCII, memungkinkan enkripsi huruf, angka, dan simbol untuk fleksibilitas lebih luas.
              </p>
            </div>
            <div className={styles.cipherCard}>
              <h2 className={styles.chiperTitle} style={{ backgroundColor: isDarkMode ? "#3F51B5" : undefined }}>Affine Cipher</h2>
              <p className={styles.chiperText}>
                Affine Cipher menggunakan persamaan matematika (ax + b) mod 26 untuk mengenkripsi huruf, dengan keamanannya bergantung pada pemilihan a yang memiliki invers modular.
              </p>
            </div>
            <div className={styles.cipherCard}>
              <h2 className={styles.chiperTitle} style={{ backgroundColor: isDarkMode ? "#3F51B5" : undefined }}>Playfair Cipher</h2>
              <p className={styles.chiperText}>
                Playfair Cipher mengenkripsi pasangan huruf menggunakan tabel 5x5 berbasis kata kunci, membuatnya lebih sulit dipecahkan dibanding cipher substitusi tunggal.
              </p>
            </div>
            <div className={styles.cipherCard}>
              <h2 className={styles.chiperTitle} style={{ backgroundColor: isDarkMode ? "#3F51B5" : undefined }}>Hill Cipher</h2>
              <p className={styles.chiperText}>
                Hill Cipher mengenkripsi blok huruf menggunakan perkalian matriks modulo 26, menjadikannya lebih tahan terhadap analisis frekuensi dibanding cipher sederhana.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;