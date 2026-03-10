import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import BrandingPage from "./Pages/BrandingPage";
import CameraCapture from "./Pages/CameraCapture";
import AdminDashboard from "./Pages/AdminDashboard";
import CharacterSelection from "./Pages/CharacterSelection";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-dashboard" />} />
        <Route path="/:eventId" element={<BrandingPage />} />
        <Route path="/CameraCapture/:eventId" element={<CameraCapture />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/Characters" element={<CharacterSelection />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
