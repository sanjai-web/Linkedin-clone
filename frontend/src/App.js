import React from 'react'
import Navbar from "./pages/navbar"
import Home from "./pages/home"
import Message from "./pages/message"
import { BrowserRouter,Routes, Route } from 'react-router-dom';
function App() {
  return (
    <div>
      <Navbar />
      <BrowserRouter>
     <Routes>
     <Route path='/' element={<Home />} />
     <Route path='/message' element={<Message />} />
     
     </Routes>
     
     </BrowserRouter>
    </div>
  )
}

export default App
