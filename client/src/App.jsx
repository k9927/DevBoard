import React from "react";
import DevBoardLanding from "./components/landingPage";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Dashboards from "./pages/D";
import ResetPassword from "./pages/ResetPassword";
import { Navigate, Route, Routes } from "react-router-dom";

function RequireAuth({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" replace />;
  return children;
}
function App(){
  return(
<Routes>
<Route path="/" element={<LandingPage/>}/>
<Route
  path="/dashboard"
  element={
    <RequireAuth>
      <Dashboards />
    </RequireAuth>
  }
/>
<Route path="/reset-password" element={<ResetPassword/>}/>
</Routes>

  );
}
export default App;