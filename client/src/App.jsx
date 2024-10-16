import { useState } from "react";
import "./App.css";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { Routes, Route, Link } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Link to="/signup">Register</Link>
      <Link to="/login">Login</Link>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
