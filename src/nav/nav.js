import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "../styles/nav.css";

export function Nav(props) {
  const [navStyle, setNavStyle] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname == "/login" || location.pathname == "/signUp") {
      disableNav();
    } else {
      enableNav();
    }
  }, [location]);

  function enableNav() {
    setNavStyle({ display: "flex" });
  }

  function disableNav() {
    setNavStyle({ display: "none" });
  }

  return (
    <nav style={navStyle}>
      <Link to="/home" className="navLogoCont ">
        <img src={require("../images/assets/honeyGramLogo.png")}></img>
      </Link>
      <Link className="navLink interactiveButton" to="/home">
        <p>Home</p> <img src={require("../images/assets/homeIcon.png")}></img>
      </Link>
      <div
        className="navLink interactiveButton"
        onClick={() => {
          const uid = Auth.currentUser.uid;

          navigate("/profile/" + uid);
        }}
      >
        <p>Profile</p>
        <img src={require("../images/assets/profileIcon.png")}></img>
      </div>
      <Link className="navLink interactiveButton" to="/newPost">
        <p> New Post</p>
        <img src={require("../images/assets/newPostIcon.png")}></img>
      </Link>

      <Link className="navLink interactiveButton" to="/settings">
        <p>Settings</p>
        <img src={require("../images/assets/settingsIcon.png")}></img>
      </Link>
      <Link className="navLink interactiveButton" to="/about">
        <p>About</p>
        <img src={require("../images/assets/aboutIcon.png")}></img>
      </Link>
      <div
        className="navLink interactiveButton"
        onClick={() => {
          props.logout();
        }}
      >
        <p> Log Out</p>
        <img src={require("../images/assets/logoutIcon.png")}></img>
      </div>
    </nav>
  );
}
