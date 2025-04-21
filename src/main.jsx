import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext"; // Import ThemeProvider
import Landing from './pages/Landing/Landing.jsx';
import Vcs from "./pages/Cipher/Vcs.jsx";
import Akvc from "./pages/Cipher/Akvc.jsx";
import Evc from "./pages/Cipher/Evc.jsx";
import Ac from "./pages/Cipher/Ac.jsx";
import Pc from "./pages/Cipher/Pc.jsx";
import Hc from "./pages/Cipher/Hc.jsx";

createRoot(document.getElementById('root')).render(
  <ThemeProvider> {/* Bungkus aplikasi dengan ThemeProvider */}
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/vcs" element={<Vcs />} />
        <Route path="/akvc" element={<Akvc />} />
        <Route path="/evc" element={<Evc />} />
        <Route path="/ac" element={<Ac />} />
        <Route path="/pc" element={<Pc />} />
        <Route path="/hc" element={<Hc />} />
      </Routes>
    </Router>
  </ThemeProvider>
);