import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import AddTeam from "./components/AddTeam";
import ChangePassword from "./components/ChangePassword";
import ForgotPassword from "./components/ForgotPassword";
import Home from "./components/Home";
import Inventory from "./components/Inventory";
import LogIn from "./components/LogIn";
import Nav from "./components/Nav";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./components/Profile";
import SignUp from "./components/SignUp";
import SubmitReplay from "./components/SubmitReplay";
import Teams from "./components/Teams";
import { useAuth } from "./contexts/AuthContext";
import { InventoryProvider } from "./contexts/InventoryContext";
import { PokedexProvider } from "./contexts/PokedexContext";
import { TeamsProvider } from "./contexts/TeamContext";

function App() {
  const { currentUser } = useAuth();

  return (
    <>
      <PokedexProvider>
        <InventoryProvider>
          <TeamsProvider>
            <Nav />
            <Routes>
              <Route element={<PrivateRoute />}>
                <Route exact path="/" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/submit-replay" element={<SubmitReplay />} />
                <Route path="/teams" element={<Teams />} />
                <Route path="/add-team" element={<AddTeam />} />
              </Route>
              <Route
                path="/signup"
                element={
                  !currentUser ? <SignUp /> : <Navigate to="/" replace={true} />
                }
              />
              <Route
                path="/login"
                element={
                  !currentUser ? <LogIn /> : <Navigate to="/" replace={true} />
                }
              />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="*" element={<p>Page does not exist</p>} />
            </Routes>
          </TeamsProvider>
        </InventoryProvider>
      </PokedexProvider>
    </>
  );
}

export default App;
