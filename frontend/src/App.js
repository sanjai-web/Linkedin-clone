import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./pages/navbar";
import Home from "./pages/home";
import Login from "./pages/login";
import Chat from "./pages/chat";
import Signup from "./pages/signup";
import Dash from "./pages/dashbord"

function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashbord" element={<Dash />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
