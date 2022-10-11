import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  console.log(!currentUser);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login", { replace: true });
    }
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
}