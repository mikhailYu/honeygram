import { useNavigate } from "react-router-dom";
import "../styles/signUp.css";
import { useEffect, useState } from "react";
import { Auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { signOut } from "firebase/auth";
export function SignUpPage(props) {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    signOut(Auth);
  }, []);

  async function register() {
    if (registerUsername !== "") {
      try {
        await createUserWithEmailAndPassword(
          Auth,
          registerEmail,
          registerPassword
        );
        props.createNewUser(registerUsername);
      } catch (error) {
        if (error.message === "Firebase: Error (auth/invalid-email).") {
          alert("Invalid Email");
        } else if (
          error.message === "Firebase: Error (auth/email-already-in-use)"
        ) {
          alert("Email already in use");
        } else if (
          error.message ===
          "Firebase: Password should be at least 6 characters (auth/weak-password)."
        ) {
          alert("Please enter a longer password");
        } else {
          alert("Invalid signup details");
        }
        console.log(error.message);
      }
    } else {
      alert("Please enter a username");
    }
  }

  return (
    <div className="signUpPageCont">
      <img
        className="signUpLogo"
        src={require("../images/assets/honeyGramLogo.png")}
      ></img>
      <div className="signUpBox">
        <form id="signUpForm">
          <input
            type="text"
            placeholder="Email"
            onChange={(event) => {
              setRegisterEmail(event.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Password (6+ characters)"
            onChange={(event) => {
              setRegisterPassword(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Username"
            onChange={(event) => {
              setRegisterUsername(event.target.value);
            }}
          />
          <div className="signUpDisclaimer">
            Please do not share any personal or sensitive infomation when using
            this site. Thank you.
          </div>
          <button
            className="signUpButton interactiveButton"
            type="submit"
            onClick={register}
          >
            Create account
          </button>
        </form>
        <button
          onClick={(e) => {
            e.preventDefault();
            navigate("/login");
          }}
          className="signUpGoBackButton"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
