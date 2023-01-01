import { Routes, Route, useFetcher } from "react-router-dom";
import { Feed } from "./pages/feedPage";
import { Link } from "react-router-dom";
import { SignUpPage } from "./pages/signUpPage";
import { LoginPage } from "./pages/loginPage";
import { Content } from "./pages/contentPage";
import { ProfilePage } from "./pages/profilePage";
import { ProfileSettings } from "./pages/profileSettingsPage";
import { Nav } from "./nav/nav";
import { About } from "./pages/about";
import "./styles/App.css";
import { useEffect, useState } from "react";

function App() {
  return (
    <div className="App">
      <div className="nav">
        <Nav />
      </div>
      <div className="body">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signUp" element={<SignUpPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/content" element={<Content />} />
          <Route path="/settings" element={<ProfileSettings />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
