import { Link } from "react-router-dom";
import "../styles/signUp.css";
import { useState } from "react";
import { Auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
export function SignUpPage(props) {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");

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
        console.log(error.message);
      }
    } else {
      alert("Please enter a username");
    }
  }

  return (
    <div className="signUpPageCont">
      <div className="signUpBox">
        <input
          type="email"
          placeholder="New Email"
          onChange={(event) => {
            setRegisterEmail(event.target.value);
          }}
        />
        <input
          type="password"
          placeholder="New Password"
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
        <button onClick={register}>Create account</button>
      </div>
    </div>
  );
}
