import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Button from "./page/Button";
import Success from "./page/Success";
import ConnectMvp from "./page/ConnectMvp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Button />}></Route>
        <Route path="/success" element={<Success />}></Route>
        <Route path="/map" element={<ConnectMvp />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
