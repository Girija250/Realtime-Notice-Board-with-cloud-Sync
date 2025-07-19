import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NoticeBoard from "./NoticeBoard";
import Login from "./Login";
import Signup from "./Signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NoticeBoard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
