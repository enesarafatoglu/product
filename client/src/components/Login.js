import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../guard/AuthProvider";
import "./login.css";
import { FaUser, FaLock } from "react-icons/fa";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState(""); //hata mesajı state'i

  const handleSubmit = async (event) => {
    event.preventDefault(); // olaylari blokluyor
    const success = await login(username, password);

    if (username === "" || password === "") {
      setErrorMessage("Lütfen kullanıcı adı veya şifre giriniz.");
      return;
    }

    if (success) {
      navigate("/product");
    } else {
      setErrorMessage("Kullanıcı adı veya şifre hatalı.");
      setUsername("");
      setPassword("");
    }
    console.log(success);
  };

  return (
    <div className="login">
      <h1>Login</h1>
      <form>
        <label htmlFor="username">
          <FaUser />
        </label>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          id="username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="password">
          <FaLock />
        </label>
        <input
          type="password"
          name="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          id="password"
          required
        />
        <input type="submit" value="Login" onClick={handleSubmit} />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
}
