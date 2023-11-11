import "./App.css";
import Login from "./components/Login/Login";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignUp from "./components/SignUp/SignUp";
import Homepage from "./components/Homepage/Homepage";
import LandingPage from "./components/LandingPage/LandingPage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<Navigate to="/landing" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/landing" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
