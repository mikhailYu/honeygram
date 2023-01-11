import { Link } from "react-router-dom";
import "../styles/loginPage.css";
import { Auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";

export function LoginPage(props) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  async function login() {
    try {
      await signInWithEmailAndPassword(Auth, loginEmail, loginPassword);
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="loginPageCont">
      <div className="loginBox">
        <div className="loginInfoCont">
          <div className="loginPadding"></div>
          <input
            placeholder="Email"
            type={"email"}
            onChange={(event) => {
              setLoginEmail(event.target.value);
            }}
          />
          <input
            placeholder="Password"
            type={"password"}
            onChange={(event) => {
              setLoginPassword(event.target.value);
            }}
          />
          <button type="button" onClick={login}>
            Login
          </button>
        </div>
        <div className="loginSignUpCont">
          <p>Not a member?</p>
          <Link to="/signUp">Sign Up Here</Link>
        </div>
      </div>
    </div>
  );
}
