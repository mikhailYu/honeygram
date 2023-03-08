import { Link } from "react-router-dom";
import "../styles/loginPage.css";
import { Auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

export function LoginPage(props) {
  const navigate = useNavigate();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  useEffect(() => {
    signOut(Auth);
  }, []);

  return (
    <div className="loginPageCont">
      <div className="loginSplashImg"></div>
      <div className="loginBox">
        <div className="loginInfoCont">
          <form id="loginForm">
            <input
              placeholder="Email"
              type={"text"}
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
            <button
              type="submit"
              onClick={() => {
                props.login(loginEmail, loginPassword);
              }}
            >
              Login
            </button>
          </form>
        </div>
        <div className="loginSignUpCont">
          <p>Not a member?</p>
          <Link className="loginSignUpLink" to="/signUp">
            SIGN UP HERE
          </Link>
        </div>
      </div>
    </div>
  );
}
