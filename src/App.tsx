import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Button from "./page/Button";
import SignUpSuccess from "./page/SignUpSuccess";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Button />}></Route>
        <Route path="/sign-up/success" element={<SignUpSuccess />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
