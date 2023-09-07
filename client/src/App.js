import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./guard/AuthProvider";
import Login from "./components/Login";
import Products from "./components/Products";
import { EditFormProvider } from "./components/EditFormContext";

function PrivateRoute({ element, path }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated()) {
    return element;
  } else {
    return <Navigate to="/" />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <EditFormProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/product"
              element={<PrivateRoute element={<Products />} />}
            />
          </Routes>
        </BrowserRouter>
      </EditFormProvider>
    </AuthProvider>
  );
}
