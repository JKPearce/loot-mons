import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Inventory from "./components/Inventory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventory" element={<Inventory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
