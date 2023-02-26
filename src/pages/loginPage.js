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

  async function login() {
    try {
      await signInWithEmailAndPassword(Auth, loginEmail, loginPassword).then(
        () => {
          navigate("/");
        }
      );
    } catch (error) {
      alert("Incorrect login details");
    }
  }

  return (
    <div className="loginPageCont">
      <div className="loginBox">
        <div className="loginInfoCont">
          <div className="loginPadding"></div>
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
            <button type="submit" onClick={login}>
              Login
            </button>
          </form>
        </div>
        <div className="loginSignUpCont">
          <p>Not a member?</p>
          <Link to="/signUp">Sign Up Here</Link>
        </div>
      </div>
    </div>
  );
}
