import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from "./pages/navbar";
import Home from "./pages/home";
import Message from "./pages/message";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/message' element={<Message />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
