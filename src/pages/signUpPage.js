import { Link } from "react-router-dom";
import "../styles/signUp.css";
export function SignUpPage() {
  return (
    <div className="signUpPageCont">
      <div className="signUpBox">
        <input type="email" placeholder="New Email" />
        <input type="password" placeholder="New Password" />
        <input type="text" placeholder="Display Name" />

        <Link to="/settings">Create account</Link>
      </div>
    </div>
  );
}
