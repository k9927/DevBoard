import React from "react";
import DevBoardLanding from "./components/landingPage";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import { Route,Routes } from "react-router-dom";
function App(){
  return(
<Routes>
<Route path="/" element={<LandingPage/>}/>
<Route path="/dashboard" element={<Dashboard/>}/>
</Routes>

  );
}
export default App;